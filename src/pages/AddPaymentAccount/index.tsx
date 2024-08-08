import {
    Button,
    CircularProgress,
    Container,
    FormControl,
    TextField,
    Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { TokenConfig, useAppData } from "../../context/AppContext";
import axios from "axios";
import { addAccountNumberSchema } from "../../schema";
import FullScreenLoader from "../../components/common/FullScreenLoader";
import EmptyOrErrorState from "../../components/common/EmptyOrErrorState";

function AddAddPaymentAccount() {
    const { enqueueSnackbar } = useSnackbar();
    const { baseUrl, tabIdentifier } = useAppData();
    const [commonPaymentAccountNumber, setCommonPaymentAccountNumber] = useState<
        string | null
    >(null);
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
                setCommonPaymentAccountNumber(data?.commonFields?.paymentAccountNumber || "");
                setIsLoading(false);
                setIsError(false);
            } catch (error) {
                console.error(error);
                setIsLoading(false);
                setIsError(true);
            }
        })();
    }, [baseUrl]);

    const formik = useFormik({
        initialValues: {
            accountNumber: commonPaymentAccountNumber || "",
        },
        validationSchema: addAccountNumberSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            try {
                console.log('accountNumber:', values.accountNumber);

                await axios.post(
                    `${baseUrl}/common-fields/admin/modify-account-number`,
                    { accountNumber: values.accountNumber },
                    TokenConfig(tabIdentifier)
                );
                setCommonPaymentAccountNumber(values.accountNumber);
                enqueueSnackbar("Updated account number successfully", { variant: "success" });
                formik.resetForm();
            } catch (error: any) {
                console.log(error);
                enqueueSnackbar(error.response.data.message || "an error occurred", {
                    variant: "error",
                });
            }
        },
    });

    if (isLoading) {
        return <FullScreenLoader />;
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 0.5 }}>
            <Typography variant="h6" textAlign={"center"} mb={2}>
                Enter payment account number
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
                        id="accountNumber"
                        name="accountNumber"
                        label="account number"
                        placeholder="enter account number"
                        value={formik.values.accountNumber}
                        onChange={formik.handleChange}
                        autoFocus
                        error={formik.touched.accountNumber && Boolean(formik.errors.accountNumber)}
                        helperText={
                            Boolean(formik.touched.accountNumber) && <>{formik.errors.accountNumber}</>
                        }
                        sx={{ mb: 3 }}
                        size="medium"
                    />
                </FormControl>
                <Button
                    variant="contained"
                    type="submit"
                    disabled={formik.isSubmitting}
                    onClick={() => {
                        formik.values.accountNumber.trim()
                        console.log('accountNumber:', formik.values.accountNumber);
                    }}
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
                    add account number
                </Button>
            </form>
        </Container>
    );
}

export default AddAddPaymentAccount;
