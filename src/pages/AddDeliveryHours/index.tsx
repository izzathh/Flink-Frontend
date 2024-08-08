import {
  Button,
  CircularProgress,
  Container,
  FormControl,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { TokenConfig, useAppData } from "../../context/AppContext";
import { useSnackbar } from "notistack";
import axios from "axios";
import { utcToZonedTime, format } from "date-fns-tz";
// import { addDeliveryHoursSchema } from "../../schema";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import TimezoneSelect, {
  ITimezone,
  ITimezoneOption,
} from "react-timezone-select";
import { formatInTimeZone } from "date-fns-tz";
import { isAfter } from "date-fns";
import FullScreenLoader from "../../components/common/FullScreenLoader";
import EmptyOrErrorState from "../../components/common/EmptyOrErrorState";
import { string } from "yup";
import { useConfirm } from "material-ui-confirm";

interface AutoArchiveTime {
  hours: string;
  minutes: string;
  amPm: string;
  runCron: boolean;
}

const initialStartTime = new Date();
initialStartTime.setHours(0, 0, 0, 0);
const initialEndTime = new Date();
initialEndTime.setHours(23, 59, 59, 999);

function AddDeliveryHours() {
  const confirm = useConfirm();
  const { baseUrl, tabIdentifier } = useAppData();
  const { enqueueSnackbar } = useSnackbar();
  const [selectedTimezone, setSelectedTimezone] = useState<ITimezone | string>(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  const [selectedGmtOffset, setSelectedGmtOffset] = useState<string>();

  const [autoArchiveTime, setAutoArchiveTime] = useState<AutoArchiveTime>();
  const [isTimechanged, setIsTimechanged] = useState<boolean>(false);

  // const [selectedTimezone, setSelectedTimezone] = useState<ITimezone | string>(
  //   ""
  // );
  const [commonFieldsDeliveryTime, setCommonFieldsDeliveryTime] = useState<{
    deliveryStartTime: Date;
    deliveryEndTime: Date;
    timeZone: ITimezone | string;
  } | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const displayOption =
    typeof selectedTimezone === "string"
      ? selectedTimezone
      : selectedTimezone.value;

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(
          `${baseUrl}/common-fields/admin/get-common-fields`,
          TokenConfig(tabIdentifier)
        );

        setSelectedGmtOffset(data?.commonFields.deliveryHours.timeZoneOffset)
        // await axios.get(
        //   `${baseUrl}/cron`,
        //   TokenConfig(tabIdentifier)
        // );
        setCommonFieldsDeliveryTime({
          deliveryStartTime: data?.startTimeConverted || new Date(),
          deliveryEndTime: data?.endTimeConverted || new Date(),
          timeZone:
            data?.commonFields?.deliveryHours?.timeZone ||
            Intl.DateTimeFormat().resolvedOptions().timeZone,
        });
        setSelectedTimezone(
          data?.commonFields?.deliveryHours?.timeZone ||
          Intl.DateTimeFormat().resolvedOptions().timeZone
        );
        setAutoArchiveTime(data?.commonFields?.deliveryHours?.autoArchiveTime);
        setIsLoading(false);
        setIsError(false);
      } catch (error) {
        console.error(error);
        setIsError(true);
        setIsLoading(false);
      }
    })();
  }, [baseUrl]);

  const updateNewTimezoneForCron = async () => {
    try {
      let flag = false
      const selectedValidTimeZone =
        typeof selectedTimezone === "string"
          ? selectedTimezone
          : selectedTimezone.value;

      const currentUtcTime = new Date();

      const existingCronHours = `${autoArchiveTime?.hours}`.padStart(2, '0');
      const existingCronMinutes = `${autoArchiveTime?.minutes}`.padStart(2, '0');
      const existingCronTime = `${existingCronHours}:${existingCronMinutes} ${autoArchiveTime?.amPm}`;

      const currentTimeInTargetTimeZone = utcToZonedTime(currentUtcTime, selectedValidTimeZone);
      const formattedCurrentDate = format(currentTimeInTargetTimeZone, 'hh:mm a', { timeZone: selectedValidTimeZone });

      if (formattedCurrentDate.includes('PM') && existingCronTime.includes('AM')) {
        flag = true
        console.log('Archive every current orders (AM PM variance)');
      } else if (formattedCurrentDate.includes('AM') && existingCronTime.includes('AM')) {
        const getCurrentHour = formattedCurrentDate.split(':')[0]
        const getExistingHour = existingCronTime.split(':')[0]
        const getCurrentMinutes = formattedCurrentDate.split(':')[1].split(' ')[0]
        const getExistingMinutes = existingCronTime.split(':')[1].split(' ')[0]
        if (Number(getCurrentHour) >= Number(getExistingHour)) {
          if (Number(getCurrentMinutes) > Number(getExistingMinutes)) {
            flag = true
            console.log('Archive every current orders (time variance AM)');
          }
        }
      } else if (formattedCurrentDate.includes('PM') && existingCronTime.includes('PM')) {
        const getCurrentHour = formattedCurrentDate.split(':')[0]
        const getExistingHour = existingCronTime.split(':')[0]
        const getCurrentMinutes = formattedCurrentDate.split(':')[1].split(' ')[0]
        const getExistingMinutes = existingCronTime.split(':')[1].split(' ')[0]
        if (Number(getCurrentHour) >= Number(getExistingHour)) {
          if (Number(getCurrentMinutes) > Number(getExistingMinutes)) {
            flag = true
            console.log('Archive every current orders (time variance PM)');
          }
        }
      }

      const archiveOrders = await axios.post(
        `${baseUrl}/cron-jobs/admin/run-cron`,
        {
          hours: autoArchiveTime?.hours,
          minutes: autoArchiveTime?.minutes,
          amPm: autoArchiveTime?.amPm,
          targetTimeZone: typeof selectedTimezone === "string"
            ? selectedTimezone
            : selectedTimezone.value,
          update: true,
          runCron: true,
          updateTimeZone: true,
          suddenArchive: flag
        },
        TokenConfig(tabIdentifier)
      );
    } catch (e) {
      console.error(e);
      setIsError(true);
      setIsLoading(false);
    }
  }

  const formik = useFormik({
    initialValues: {
      deliveryStartTime:
        commonFieldsDeliveryTime?.deliveryStartTime || new Date(),
      deliveryEndTime: commonFieldsDeliveryTime?.deliveryEndTime || new Date(),
    },
    // initialValues: {
    //   deliveryStartTime:
    //     commonFieldsDeliveryTime?.deliveryStartTime || initialStartTime,
    //   deliveryEndTime: commonFieldsDeliveryTime?.deliveryEndTime || initialEndTime,
    // },
    // validationSchema: addDeliveryHoursSchema,
    enableReinitialize: commonFieldsDeliveryTime ? true : false,
    onSubmit: async (values) => {
      setIsTimechanged(false)
      const loadUserTabIdentifier = localStorage.getItem("uniqueTabIdentifier") || "";

      const targetTimeZone = sessionStorage.getItem(`timezone`);

      targetTimeZone != null
        ? sessionStorage.setItem("timezone",
          typeof selectedTimezone === "string"
            ? selectedTimezone
            : selectedTimezone.value)
        : localStorage.setItem(
          `timezone_${loadUserTabIdentifier}`,
          typeof selectedTimezone === "string"
            ? selectedTimezone
            : selectedTimezone.value
        );

      if (
        typeof selectedTimezone === "string" &&
        !commonFieldsDeliveryTime?.timeZone
      ) {
        return enqueueSnackbar("Please select a timezone", {
          variant: "error",
        });
      }
      if (
        isAfter(
          new Date(initialEndTime),
          new Date(initialStartTime)
        ) === false
      ) {
        return enqueueSnackbar(
          "Delivery end time should be more than delivery start time",
          { variant: "error", autoHideDuration: 8000 }
        );
      }

      confirm({
        title: "Modify time zone ?",
        description: "Are you sure you want to modify time zone ?",
        confirmationText: "Yes",
        cancellationText: "Cancel",
      }).then(async () => {
        try {
          await axios.post(
            `${baseUrl}/common-fields/admin/time-zone`,
            // {
            //   deliveryStartTime: values.deliveryStartTime,
            //   deliveryEndTime: values.deliveryEndTime,
            {
              deliveryStartTime: initialStartTime,
              deliveryEndTime: initialEndTime,
              timeZone:
                typeof selectedTimezone === "string"
                  ? selectedTimezone
                  : selectedTimezone.value,
              timeZoneOffset: selectedGmtOffset,
              autoArchiveTime: autoArchiveTime,
            },
            TokenConfig(tabIdentifier)
          );
          setCommonFieldsDeliveryTime({
            // deliveryStartTime: values.deliveryStartTime,
            // deliveryEndTime: values.deliveryEndTime,
            deliveryStartTime: initialStartTime,
            deliveryEndTime: initialEndTime,
            timeZone:
              typeof selectedTimezone === "string"
                ? selectedTimezone
                : selectedTimezone.value,
          });
          enqueueSnackbar("Time Zone updated successfully", {
            variant: "success",
          });
          if (autoArchiveTime?.runCron) {
            updateNewTimezoneForCron()
          }
        } catch (error: any) {
          console.log(error);
          enqueueSnackbar(error.response.data.message || "", {
            variant: "error",
          });
        }
      })
        .catch(() => {
          setIsTimechanged(true)
        });
    },
  });

  if (isLoading) {
    return <FullScreenLoader />;
  }


  // if (isError) {
  //   return (
  //     <EmptyOrErrorState text="An error occurred 😕 Please try again later" />
  //   );
  // }

  return (
    <Container maxWidth="lg" sx={{ mt: 0.5 }}>
      <Typography variant="h6" textAlign={"center"} mb={2}>
        Modify time zone
      </Typography>
      <form
        onSubmit={formik.handleSubmit}
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Stack
          width={"100%"}
          direction="column"
          alignItems={"center"}
          spacing={4}
          mb={8}
          mt={4}
        >
          {/* <FormControl variant="standard" sx={{ width: "50%" }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <TimePicker
                label="delivery start time"
                minutesStep={1}
                value={formik.values.deliveryStartTime}
                onChange={(value) =>
                  formik.setFieldValue("deliveryStartTime", value)
                }
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </FormControl> */}

          {/* <FormControl variant="standard" sx={{ width: "50%" }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <TimePicker
                label="delivery end time"
                minutesStep={1}
                value={formik.values.deliveryEndTime}
                onChange={(value) =>
                  formik.setFieldValue("deliveryEndTime", value)
                }
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </FormControl> */}

          <Stack width={"50%"}>
            <TimezoneSelect
              value={selectedTimezone}
              onChange={(timeZone: ITimezoneOption) => {
                const myButton = document.getElementById('setTimeZoneButton') as HTMLButtonElement;

                if (typeof selectedTimezone === 'object' && selectedTimezone !== null) {
                  if (timeZone.value == commonFieldsDeliveryTime?.timeZone) {
                    myButton.classList.add('Mui-disabled');
                    setIsTimechanged(true)
                  } else {
                    myButton.classList.remove('Mui-disabled');
                  }
                }

                if (timeZone.value !== selectedTimezone) {
                  setSelectedTimezone(timeZone)
                  const stringtimeZone = timeZone.offset?.toString()
                  const setValue = typeof stringtimeZone == 'undefined' ? '' : stringtimeZone
                  setSelectedGmtOffset(setValue)
                  setIsTimechanged(true)
                } else {
                  setIsTimechanged(false)
                  setSelectedTimezone(selectedTimezone)
                }
              }}
              labelStyle="abbrev"
            />
          </Stack>
        </Stack>
        {/* {selectedTimezone.value} */}
        {/* {(typeof selectedTimezone !== "string" ||
          commonFieldsDeliveryTime?.deliveryStartTime !==
          formik.values.deliveryStartTime) && (
            <Typography mb={4}>
              Delivery start time in {displayOption} is{" "}
              <span style={{ fontWeight: "bold" }}>
                {formatInTimeZone(
                  // formik.values.deliveryStartTime,
                  initialStartTime,
                  displayOption,
                  "hh:mm:ss a zzz"
                )}
              </span>
            </Typography>
          )} */}

        {/* {(typeof selectedTimezone !== "string" ||
          commonFieldsDeliveryTime?.deliveryEndTime !==
          formik.values.deliveryEndTime) && (
            <Typography mb={4}>
              Delivery end time in {displayOption} is{" "}
              <span style={{ fontWeight: "bold" }}>
                {formatInTimeZone(
                  //  formik.values.deliveryEndTime,
                  initialEndTime,
                  displayOption,
                  "hh:mm:ss a zzz"
                )}
              </span>
            </Typography>
          )} */}
        <Button
          id="setTimeZoneButton"
          variant="contained"
          type="submit"
          disabled={formik.isSubmitting || !isTimechanged}
          startIcon={
            formik.isSubmitting ? (
              <CircularProgress
                sx={{
                  color: "#fff",
                }}
                size={20}
              />
            ) : null
          }
        >
          Set time zone
        </Button>
      </form>
    </Container>
  );
}

export default AddDeliveryHours;
