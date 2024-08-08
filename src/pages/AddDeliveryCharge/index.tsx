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
import { addDeliveryChargeSchema } from "../../schema"

const initialStartTime = new Date();
initialStartTime.setHours(0, 0, 0, 0);
const initialEndTime = new Date();
initialEndTime.setHours(23, 59, 59, 999);

function AddDeliveryCharge() {
    const confirm = useConfirm();
    const { baseUrl, tabIdentifier } = useAppData();
    const { enqueueSnackbar } = useSnackbar();
    const [deliveryCharge, setDeliveryCharge] = useState<number>();
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    useEffect(() => {
        (async () => {
            try {
                setIsLoading(true);
                const { data } = await axios.get(
                    `${baseUrl}/common-fields/admin/get-common-fields`,
                    TokenConfig(tabIdentifier)
                );
                setDeliveryCharge(data?.commonFields.deliveryCharge || 0)
                setIsLoading(false);
                setIsError(false);
            } catch (error) {
                console.error(error);
                setIsError(true);
                setIsLoading(false);
            }
        })();
    }, [baseUrl]);

    const formik = useFormik({
        initialValues: {
            deliveryCharge: deliveryCharge || 1
        },
        validationSchema: addDeliveryChargeSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            confirm({
                title: "Modify delivery charge ?",
                description: "Are you sure you want to modify delivery charge ?",
                confirmationText: "Yes",
                cancellationText: "Cancel",
            }).then(async () => {
                try {
                    await axios.post(
                        `${baseUrl}/common-fields/admin/modify-delivery-charge`,
                        {
                            deliveryCharge: values.deliveryCharge || 0
                        },
                        TokenConfig(tabIdentifier)
                    );
                    setDeliveryCharge(values.deliveryCharge)
                    enqueueSnackbar("Delivery charge updated successfully", {
                        variant: "success",
                    });
                } catch (error: any) {
                    console.log(error);
                    enqueueSnackbar(error.response.data.message || "", {
                        variant: "error",
                    });
                }
            })
                .catch(() => {
                });
        },
    });

    if (isLoading) {
        return <FullScreenLoader />;
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 0.5 }}>
            <Typography variant="h6" textAlign={"center"} mb={2}>
                Add/Modify delivery charge
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
                <FormControl variant="standard" sx={{ width: "50%" }}>
                    <TextField
                        variant="outlined"
                        id="deliveryCharge"
                        name="deliveryCharge"
                        label="delivery charge *"
                        type={"number"}
                        placeholder="enter delivery charge"
                        value={formik.values.deliveryCharge}
                        onChange={formik.handleChange}
                        autoFocus
                        error={
                            formik.touched.deliveryCharge &&
                            Boolean(formik.errors.deliveryCharge)
                        }
                        helperText={
                            Boolean(formik.touched.deliveryCharge) && (
                                <>{formik.errors.deliveryCharge}</>
                            )
                        }
                        sx={{ mb: 3 }}
                        size="medium"
                    />
                </FormControl>
                <Button
                    id="setDeliveryCharge"
                    variant="contained"
                    type="submit"
                    disabled={formik.isSubmitting}
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
                    Add Delivery Charge
                </Button>
            </form>
        </Container>
    );
}

export default AddDeliveryCharge;
