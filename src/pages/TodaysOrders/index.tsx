import FileDownloadIcon from "@mui/icons-material/FileDownload";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Pagination,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  Select,
  InputLabel,
  MenuItem,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useCallback, useEffect, useState, ChangeEvent } from "react";
import OrderSlip from "../../components/Orders/OrderSlip";
import EmptyOrErrorState from "../../components/common/EmptyOrErrorState";
import FullScreenLoader from "../../components/common/FullScreenLoader";
import { TokenConfig, useAppData } from "../../context/AppContext";
import { IOrdersList, ICommonFieldsResponse } from "../../types/appTypes";
import { utcToZonedTime, format } from "date-fns-tz";
import { decimalCalculation } from "../../utils/decimalCalc";
import { useConfirm } from "material-ui-confirm";

function TodaysOrders() {
  const [selectedOption, setSelectedOption] = useState("")
  const [orders, setOrders] = useState<IOrdersList[]>([]);
  const [todaysOrders, setTodaysOrders] = useState<IOrdersList[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloadPdfLoading, setIsDownloadPdfLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [page, setPage] = useState(1);
  const [goToPage, setGoToPage] = useState(1);
  const [searchString, setSearchString] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [visibleCall, setVisibleCall] = useState(false);
  const [showDownloadButton, setShowDownloadButton] = useState(false);
  const [downloadLink, setDownloadLink] = useState<string | null>(null);
  const [netTotal, setNetTotal] = useState(0);
  const { baseUrl, state, tabIdentifier } = useAppData();
  const { enqueueSnackbar } = useSnackbar();
  const [isPdfGenerationInProgress, setIsPdfGenerationInProgress] =
    useState(false);
  const [downloadId, setDownloadId] = useState("");
  const [allGrandTotal, setAllGrandTotal] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [amPm, setAmPm] = useState("AM");
  const [currentHour, setCurrentHour] = useState(0);
  const [currentMinute, setCurrentMinute] = useState(0);
  const [currentAmPm, setCurrentAmPm] = useState("AM");
  const [hourHasVal, setHourHasVal] = useState(true);
  const [minuteHasVal, setMinuteHasVal] = useState(true);
  const [autoarchive, setAutoarchive] = useState(false);
  const loadUserTabIdentifier = localStorage.getItem("uniqueTabIdentifier") || "";
  const targetTimeZone = sessionStorage.getItem(`timezone`) ||
    localStorage.getItem(`timezone_${loadUserTabIdentifier}`);

  const targetAdminType = sessionStorage.getItem(`adminType`) ||
    localStorage.getItem(`adminType_${loadUserTabIdentifier}`);
  // const targetTimeZone = `${localStorage.getItem("timezone")}`;

  const currentUtcTime = new Date();
  const currentTimeInTargetTimeZone = utcToZonedTime(currentUtcTime, `${targetTimeZone}`);
  const formattedDate = format(currentTimeInTargetTimeZone, 'dd/MM/yyyy', { timeZone: `${targetTimeZone}` });
  console.log('currentTimeInTargetTimeZone:', formattedDate);

  const confirm = useConfirm()

  const getOrders = useCallback(
    (offset: number, search: string, option?: string) => {
      (async () => {
        try {
          setIsLoading(true);
          const { data } = await axios.get(
            `${baseUrl}/order/admin/get-orders-list?page=${offset}&limit=6&searchString=${search}&selectOption=${typeof option === 'undefined' ? "" : option}&adminType=${targetAdminType}`,
            TokenConfig(tabIdentifier)
          );

          const currentUtcTime = new Date();

          const currentTimeInTargetTimeZone = utcToZonedTime(currentUtcTime, `${targetTimeZone}`);

          setCurrentHour(currentTimeInTargetTimeZone.getHours() % 12 || 12)
          setCurrentMinute(currentTimeInTargetTimeZone.getMinutes())
          setCurrentAmPm(format(currentTimeInTargetTimeZone, "a", { timeZone: `${targetTimeZone}` }))

          setOrders(data.orders);
          setAllGrandTotal(data.sumOfNetTotal)

          const currentUnformatHour = currentTimeInTargetTimeZone.getHours() % 12 || 12
          const currentUnformatMinute = currentTimeInTargetTimeZone.getMinutes()
          const formattedHour = currentUnformatHour < 10 ? `0${currentUnformatHour}` : currentUnformatHour;
          const formattedMinute = currentUnformatMinute < 10 ? `0${currentUnformatMinute}` : currentUnformatMinute;

          setAutoarchive(data.autoArchiveTime.runCron);
          setHours(!data.autoArchiveTime.runCron ? formattedHour : data.autoArchiveTime.hours)
          setMinutes(!data.autoArchiveTime.runCron ? formattedMinute : data.autoArchiveTime.minutes)
          setAmPm(!data.autoArchiveTime.runCron ? format(currentTimeInTargetTimeZone, "a", { timeZone: `${targetTimeZone}` }) : data.autoArchiveTime.amPm)
          // setHours(data.autoArchiveTime.hours);
          // setMinutes(data.autoArchiveTime.minutes);
          // setAmPm(data.autoArchiveTime.amPm);
          setTotalPages(data.totalPages || 1);
          setShowDownloadButton(data.showDownloadButton);
          setIsLoading(false);
          setIsError(false);
        } catch (error) {
          console.error(error);
          setIsLoading(false);
          setIsError(true);
        }
      })();
    },
    [baseUrl]
  );

  // console.log('adminType:--->', state?.user?.adminType);

  const getTodaysOrders = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(
        `${baseUrl}/order/admin/get-today-orders-list?admintype=${targetAdminType}`,
        TokenConfig(tabIdentifier)
      );

      setTodaysOrders(data.orders);
      // setTotalPages(data.totalPages || 1);
      // setAutoarchive(data.archiveCheckbox);
      setShowDownloadButton(data.showDownloadButton);
      setIsLoading(false);
      setIsError(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      setIsError(true);
    }
  };

  useEffect(() => {
    // if (state && state?.user?.adminType === "printing")
    getTodaysOrders();
  }, []);

  useEffect(() => {
    // if (state && state?.user?.adminType === "super")
    getOrders(1, searchString);
  }, [getOrders, visibleCall]);

  // useEffect(() => {
  //   const sum = allGrandTotal.reduce(
  //     (prevVal, currVal) => prevVal + currVal.grandTotal,
  //     0
  //   );

  //   setNetTotal(sum);
  // }, [orders]);

  const downloadIndividualTodaysOrdersHandler = async (
    date: string,
    date1: string
  ) => {
    try {
      setDownloadId(date1);
      // setIsDownloadPdfLoading(true);
      setIsPdfGenerationInProgress(true);
      const { data } = await axios.post(
        `${baseUrl}/generate-pdf/get-todays-orders-print-admin`,
        { archivedOrderDate: date1, date1: date1 },
        TokenConfig(tabIdentifier)
      );

      console.log('pdfLocation:', data.pdfLocation.data);

      const uint8Array = new Uint8Array(data.pdfLocation.data);

      const blob = new Blob([uint8Array], { type: 'application/pdf' });

      const url = URL.createObjectURL(blob);
      setDownloadLink(url);

      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = data.fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      // setIsDownloadPdfLoading(false);
      setIsPdfGenerationInProgress(false);
    } catch (error) {
      console.error(error);
      enqueueSnackbar("an error occurred while generating pdf", {
        variant: "error",
      });
      setIsPdfGenerationInProgress(false);
    }
  };

  const visibleTodayOrder = async () => {
    try {
      const today = new Date();
      const startOfToday = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        0,
        0,
        0,
        0
      );
      const endOfToday = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        23,
        59,
        59,
        999
      );

      const currentUtcTime = new Date();
      const currentTimeInTargetTimeZone = utcToZonedTime(currentUtcTime, `${targetTimeZone}`);
      const formattedDate = format(currentTimeInTargetTimeZone, 'dd/MM/yyyy hh:mm a', { timeZone: `${targetTimeZone}` });
      console.log('formattedArchiveAt:', formattedDate);

      const ans = await axios.post(
        `${baseUrl}/order/admin/edit-orders-list`,
        {
          autoArcive: false,
          isActive: false,
          filter: {
            // user: `${orders[0].user._id}`,
            archive: false,
            createdAdminId: TokenConfig(tabIdentifier).headers.adminid
            // createdAt: {
            //   $gte: startOfToday.toISOString(),
            //   $lte: endOfToday.toISOString(),
            // },
          },
          update: {
            archivedAt: formattedDate,
            archive: true,
          },
        },
        TokenConfig(tabIdentifier)
      );
      setVisibleCall(true);
    } catch (error) {
      console.log("edit-orders-list:", error);
    }
  };

  const handlePaginationChange = async (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    const newPage = value;
    await getOrders(newPage, searchString, selectedOption);
    setPage(newPage);
  };

  const downloadOrdersHandler = async () => {
    try {
      setIsDownloadPdfLoading(true);
      const { data } = await axios.get(
        `${baseUrl}/generate-pdf/todays-orders`,
        // {
        //   responseType: "blob",
        //   headers: { ...TokenConfig(tabIdentifier).headers } as any,
        // }
        TokenConfig(tabIdentifier)
      );

      console.log('pdfLocation:', data.pdfLocation.data);

      const uint8Array = new Uint8Array(data.pdfLocation.data);

      const blob = new Blob([uint8Array], { type: 'application/zip' });

      const url = URL.createObjectURL(blob);
      setDownloadLink(url);

      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = data.fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setDownloadLink(data.pdfLocation);
      // window.open(data.pdfLocation, "_blank");
      setIsDownloadPdfLoading(false);
      // const link = document.createElement("a");
      // link.href = data.pdfLocation;
      // link.setAttribute("download", data.pdfLocation); //or any other extension
      // document.body.appendChild(link);
      // link.click();

      // // clean up "a" element & remove ObjectURL
      // document.body.removeChild(link);
      // fileDownload(data, "sample.pdf");
    } catch (error) {
      console.error(error);
      enqueueSnackbar("an error occurred while genrating pdf", {
        variant: "error",
      });
      setIsDownloadPdfLoading(false);
    }
  };


  const postCronFilterUpdate = async (isChecked: boolean) => {

    const today = new Date();
    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      0,
      0,
      0,
      0
    );
    const endOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      23,
      59,
      59,
      999
    );

    console.log('endOfToday:', endOfToday);

    console.log('postCronFilterUpdate:', isChecked);
    const currentUtcTime = new Date();
    const currentTimeInTargetTimeZone = utcToZonedTime(currentUtcTime, `${targetTimeZone}`);
    const formattedDate = format(currentTimeInTargetTimeZone, 'dd/MM/yyyy hh:mm a', { timeZone: `${targetTimeZone}` });
    console.log('formattedArchiveAt:', formattedDate);

    const ans = await axios.post(
      `${baseUrl}/order/admin/edit-orders-list`,
      {
        autoArcive: true,
        isActive: isChecked,
        filter: {
          archive: false,
          createdAdminId: TokenConfig(tabIdentifier).headers.adminid
          // user: `${orders[0].user._id}`,
          // createdAt: {
          //   $gte: startOfToday.toISOString(),
          //   $lte: endOfToday.toISOString(),
          // },
        },
        update: {
          archive: true,
          archivedAt: formattedDate
        },
      },
      TokenConfig(tabIdentifier)
    );
  }

  const autoArchiveTimeSave = async () => {
    try {
      console.log('hours:', hours);

      if (!hourHasVal || !minuteHasVal) {
        enqueueSnackbar("Please enter the hours and minutes", {
          variant: "error",
        });
        return
      }

      const data = await axios.post(
        `${baseUrl}/common-fields/admin/auto-archive-time`,
        {
          hours,
          minutes,
          amPm,
          runCron: autoarchive
        },
        TokenConfig(tabIdentifier)
      );
      if (autoarchive) {
        console.log('autoArchiveTimeSave:', autoarchive);
        postCronFilterUpdate(autoarchive)

        const data = await axios.post(
          `${baseUrl}/cron-jobs/admin/run-cron`,
          {
            hours,
            minutes,
            amPm,
            targetTimeZone,
            update: autoarchive ? true : false,
            runCron: autoarchive,
            updateTimeZone: false,
            suddenArchive: false
          },
          TokenConfig(tabIdentifier)
        );
        if (data.status == 200) {
          enqueueSnackbar("Auto archive scheduled successfully", {
            variant: "success",
          });
        } else {
          enqueueSnackbar(`Auto archive error${data.status}`, {
            variant: "success",
          });
        }
      }
    } catch (error) {
      console.log(error)
    }
  };

  // useEffect(() => {
  //   if (autoarchive !== JSON.parse(localStorage.getItem('autoarchive'))) {
  //     localStorage.setItem('autoarchive', JSON.stringify(autoarchive));
  //   }
  // }, [autoarchive]);


  const handleAutoarchiveChange = (e: ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    if (!isChecked) {
      setHours(currentHour)
      setMinutes(currentMinute)
      setAmPm(currentAmPm)
    }
    setAutoarchive(isChecked);
    (async () => {
      try {

        const data = await axios.post(
          `${baseUrl}/common-fields/admin/auto-archive-time`,
          {
            hours,
            minutes,
            amPm,
            runCron: isChecked,
          },
          TokenConfig(tabIdentifier)
        );

        postCronFilterUpdate(isChecked)
        const archiveOrders = await axios.post(
          `${baseUrl}/cron-jobs/admin/run-cron`,
          {
            hours,
            minutes,
            amPm,
            targetTimeZone,
            update: isChecked ? true : false,
            runCron: isChecked,
            updateTimeZone: false,
            suddenArchive: false
          },
          TokenConfig(tabIdentifier)
        );
        console.log('archiveOrders:', archiveOrders);
        if (isChecked) {
          if (archiveOrders.status == 200) {
            enqueueSnackbar("Auto archive scheduled successfully", {
              variant: "success",
            });
          } else {
            enqueueSnackbar(`Auto archive error${archiveOrders.status}`, {
              variant: "success",
            });
          }
        } else {
          enqueueSnackbar(`Auto archive schedule stopped`, {
            variant: "success",
          });
        }
      } catch (error) {
        console.log(error);
      }
    })();
  };

  useEffect(() => {
    localStorage.setItem('autoarchive', JSON.stringify(autoarchive));
  }, [autoarchive]);


  if (isLoading) {
    return <FullScreenLoader />;
  }

  if (isError && !isLoading) {
    return (
      <EmptyOrErrorState text="Oops,an error occurred while fetching today's orders 😕" />
    );
  }

  if (orders.length === 0 && !isLoading && todaysOrders.length === 0) {
    return <EmptyOrErrorState text="Unfortunately, No one ordered today 😕" />;
  }

  if (state && state?.user?.adminType === "printing") {
    return (
      <Container sx={{ mt: 0.5 }}>
        <Stack
          alignItems={"center"}
          justifyContent="center"
          flexDirection={"column"}
          sx={{
            padding: "1rem",
            width: "100%",
            maxWidth: "100%",
          }}
        >
          <Typography variant="h5" textAlign={"center"} mb={2}>
            Today's Orders
          </Typography>
        </Stack>
        <Stack
          flexDirection={"row"}
          justifyContent={"center"}
          alignItems={"center"}
          my={8}
        >
          <Button
            variant="contained"
            startIcon={<FileDownloadIcon />}
            onClick={downloadOrdersHandler}
            disabled={!showDownloadButton || isDownloadPdfLoading}
            endIcon={
              isDownloadPdfLoading ? <CircularProgress size={16} /> : null
            }
          >
            Download all as ZIP
          </Button>
        </Stack>
        <Stack
          // flexDirection={"row"}
          // justifyContent={"space-between"}
          flexWrap={"wrap"}
          flex={1}
          rowGap={4}
        >
          {
            <>
              <TableContainer component={Paper} variant="outlined">
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="left" sx={{ fontWeight: 600 }}>
                        Orders
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {todaysOrders != null &&
                      todaysOrders?.length > 0 &&
                      todaysOrders.map((todaysOrder) => (
                        // archivedOrder._id.archive==true?
                        <TableRow
                          key={todaysOrder._id}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell
                            component="th"
                            scope="row"
                            sx={{ fontWeight: "bold" }}
                          >
                            <Stack
                              direction={"row"}
                              alignItems={"center"}
                              justifyContent={"space-between"}
                            >
                              User Orders
                              {/* User Orders ({format(utcToZonedTime(new Date(archivedOrder._id).setHours(23, 59, 59, 999), targetTimeZone), 'dd-MM-yyyy hh:mm:ss-a')}) */}
                              <Button
                                variant="contained"
                                startIcon={<FileDownloadIcon />}
                                // disabled={!showDownloadButton || isDownloadPdfLoading}
                                disabled={
                                  isPdfGenerationInProgress &&
                                  downloadId === `${todaysOrder.createdAt}`
                                }
                                endIcon={
                                  isPdfGenerationInProgress ? <CircularProgress size={16} /> : null
                                }

                                onClick={(e: any) => {
                                  e.stopPropagation();
                                  downloadIndividualTodaysOrdersHandler(
                                    `${utcToZonedTime(
                                      new Date(todaysOrder.createdAt).setHours(
                                        23,
                                        59,
                                        59,
                                        999
                                      ),
                                      `${targetTimeZone}`
                                    )}`,
                                    `${todaysOrder.archivedAt}`
                                  );
                                }}
                              >
                                Download
                              </Button>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          }
        </Stack>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 0.5 }}>
      <Stack
        alignItems={"center"}
        justifyContent="center"
        flexDirection={"column"}
        sx={{
          padding: "1rem",
          width: "100%",
          maxWidth: "100%",
        }}
      >
        <Typography variant="h5" textAlign={"center"} mb={2}>
          Today's Orders
        </Typography>
      </Stack>

      <Stack
        flexDirection={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
        mb={4}
      >
        <Stack flexDirection={"row"}>
          <Box sx={{ minWidth: 120, marginRight: "10px" }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Search By</InputLabel>
              <Select
                className="search__by__input"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedOption}
                label="Search By"
                onChange={(e) => {
                  setSelectedOption(e.target.value)
                }}
              >
                <MenuItem value="orderNumber">Order Number</MenuItem>
                <MenuItem value="userName">Username</MenuItem>
                <MenuItem value="email">Email</MenuItem>
                <MenuItem value="location">Location</MenuItem>
                <MenuItem value="houseNumber">House Number</MenuItem>
                <MenuItem value="streetAddress">Street Address</MenuItem>
                <MenuItem value="phoneNumber">Phone Number</MenuItem>
                <MenuItem value="itemCategory">Item Category</MenuItem>
                <MenuItem value="itemName">Item Name</MenuItem>
                <MenuItem value="transactionId">Transaction ID</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <TextField
            id="searchString"
            variant="outlined"
            label="Search"
            placeholder="Search order by user's name, email or order number"
            type="text"
            name="searchString"
            value={searchString}
            disabled={selectedOption == "" ? true : false}
            onChange={(e) => {
              setSearchString(e.target.value);
            }}
          />
          <Button
            variant="contained"
            style={{ marginLeft: "2%" }}
            onClick={async () => {
              await getOrders(1, searchString, selectedOption);
              setPage(1);
            }}
          >
            Search
          </Button>
        </Stack>
        <Stack flexDirection={"column"}>
          <Button
            variant="contained"
            // startIcon={<FileDownloadIcon />}
            onClick={async () => {
              return new Promise((resolve, reject) => {
                confirm({
                  title: "Archive orders?",
                  description: "Are you sure you want to archive today's orders?",
                  confirmationText: "yes",
                  cancellationText: "no",
                })
                  .then(() => {
                    visibleTodayOrder();
                  })
                  .catch(() => {
                  });
              });
            }}
            // onClick={visibleTodayOrder}
            disabled={visibleCall || !showDownloadButton || isDownloadPdfLoading}
            endIcon={
              isDownloadPdfLoading ? <CircularProgress size={16} /> : null
            }
          >
            Archive orders
          </Button>
          <Stack flexDirection={"column"}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={autoarchive}
                  onChange={handleAutoarchiveChange}
                />
              }
              label={`Auto archive at ${hours.toString().length < 2 && hours < 10 ? `0${hours}` : hours}:${minutes} ${amPm}`}
            />
            {(
              <FormControl component="fieldset">
                <FormLabel component="legend">Edit Time</FormLabel>
                <Box display="flex">
                  <TextField
                    label="Hours"
                    type="number"
                    required
                    value={parseInt((hours < 10 ? `0${hours}` : hours.toString().slice(0, 2)), 10)}
                    onChange={(e: any) => {
                      let validHrs
                      validHrs = e.target.value > 12 ?
                        e.target.value - 12 : e.target.value
                      validHrs = validHrs > 12 ?
                        12 : validHrs
                      validHrs !== '' ? setHourHasVal(true) : setHourHasVal(false)
                      setHours(validHrs);
                    }}
                    InputProps={{
                      inputProps: { min: 2, max: 2 },
                    }}
                  />
                  <TextField
                    label="Minutes"
                    type="number"
                    required
                    value={minutes}
                    onChange={(e: any) => {
                      setMinutes(e.target.value > 59 ?
                        '00' : e.target.value);
                      e.target.value !== '' ? setMinuteHasVal(true) : setMinuteHasVal(false)
                    }}
                    InputProps={{
                      inputProps: { min: 2, max: 2 },
                    }}
                  />
                  <FormControl component="fieldset">
                    <RadioGroup
                      row
                      aria-label="AM/PM"
                      name="amPm"
                      value={amPm}
                      onChange={(e: any) => {
                        setAmPm(e.target.value);
                      }}
                    >
                      <FormControlLabel
                        value="AM"
                        control={<Radio />}
                        label="AM"
                      />
                      <FormControlLabel
                        value="PM"
                        control={<Radio />}
                        label="PM"
                      />
                    </RadioGroup>
                    <Button onClick={autoArchiveTimeSave}>Save</Button>
                  </FormControl>
                </Box>
              </FormControl>
            )}
          </Stack>
        </Stack>
      </Stack>
      {downloadLink && !isDownloadPdfLoading && state && state?.user?.adminType === "super" && (
        <Stack
          flexDirection={"row"}
          justifyContent={"flex-end"}
          alignItems={"center"}
          mb={4}
        >
          <Typography
            variant="caption"
            component={"a"}
            href={downloadLink || ""}
            target="_blank"
            rel="noreferrer noopener"
          >
            {downloadLink}
          </Typography>
        </Stack>
      )}

      <Stack
        // flexDirection={"row"}
        // justifyContent={"space-between"}
        flexWrap={"wrap"}
        flex={1}
        rowGap={4}
      >
        {orders.map((order, index) => (
          <OrderSlip
            key={order._id}
            order={order}
            index={index}
            getOrders={getOrders}
            searchString={searchString}
          />
        ))}
      </Stack>
      {/* <Stack flexDirection={"row"} alignItems={"center"} columnGap={1} mb={1}> */}
      <Typography
        sx={{ fontSize: 14 }}
        mt={2}
        textAlign={"right"}
        fontWeight={"bold"}
      >
        Sum of net totals : {orders[0]?.currency || ""}{decimalCalculation(allGrandTotal)}
      </Typography>
      {/* </Stack> */}

      <Stack width={"100%"} my={8}>
        <Pagination
          className="justify-self-end"
          count={
            Math.ceil(totalPages / 6) === 0 ? 1 : Math.ceil(totalPages / 6)
          }
          page={page}
          variant="outlined"
          color="primary"
          sx={{ display: "flex", justifyContent: "center" }}
          onChange={handlePaginationChange}
        />
        width={"50%"}
        <Typography
          variant="caption"
          component={"h2"}
          alignSelf={"flex-start"}
          width={"50%"}
        >
          Go to page:{" "}
          <TextField
            id="pageNumber"
            variant="standard"
            size="small"
            hiddenLabel
            type="number"
            name="pageNumber"
            InputProps={{
              inputProps: {
                min: 1,
                max:
                  Math.ceil(totalPages / 6) === 0
                    ? 1
                    : Math.ceil(totalPages / 6),
              },
            }}
            value={goToPage}
            onChange={(e) => {
              setGoToPage(parseInt(e.target.value));
            }}
            style={{ width: "10%" }}
          />
          <Button
            variant="contained"
            style={{ marginLeft: "2%" }}
            onClick={async () => {
              await getOrders(goToPage, searchString, selectedOption);
              setPage(goToPage);
            }}
          >
            Go
          </Button>
        </Typography>
        <Typography variant="caption" component={"h2"} alignSelf={"flex-end"}>
          Showing page {page} of{" "}
          {Math.ceil(totalPages / 6) === 0 ? 1 : Math.ceil(totalPages / 6)}{" "}
          pages
        </Typography>
      </Stack>
    </Container>
  );
}

export default TodaysOrders;
