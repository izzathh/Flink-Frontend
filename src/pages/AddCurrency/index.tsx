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
import { addCurrencySchema } from "../../schema";
import FullScreenLoader from "../../components/common/FullScreenLoader";
import EmptyOrErrorState from "../../components/common/EmptyOrErrorState";

function AddCurrency() {
  const { enqueueSnackbar } = useSnackbar();
  const { baseUrl, tabIdentifier } = useAppData();
  const [commonFieldsCurrency, setCommonFieldsCurrency] = useState<
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
        // await axios.get(
        //   `${baseUrl}/cron`,
        //   TokenConfig(tabIdentifier)
        // );
        setCommonFieldsCurrency(data?.commonFields?.currency || "");
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
      currency: commonFieldsCurrency || "",
    },
    validationSchema: addCurrencySchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        await axios.post(
          `${baseUrl}/common-fields/admin/modify-currency`,
          { currency: values.currency },
          TokenConfig(tabIdentifier)
        );
        setCommonFieldsCurrency(values.currency);
        enqueueSnackbar("Added currency successfully", { variant: "success" });
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
  // if (isError) {
  //   return (
  //     <EmptyOrErrorState text="An error occurred 😕 Please try again later" />
  //   );
  // }

  return (
    <Container maxWidth="lg" sx={{ mt: 0.5 }}>
      <Typography variant="h6" textAlign={"center"} mb={2}>
        Add/Modify Currency
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
            id="currency"
            name="currency"
            label="currency"
            InputProps={{
              inputProps: { maxLength: 3 },
            }}
            placeholder="enter currency"
            value={formik.values.currency}
            onChange={formik.handleChange}
            autoFocus
            error={formik.touched.currency && Boolean(formik.errors.currency)}
            helperText={
              Boolean(formik.touched.currency) && <>{formik.errors.currency}</>
            }
            sx={{ mb: 3 }}
            size="medium"
          />
        </FormControl>
        <Button
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
          add currency
        </Button>
      </form>
    </Container>
  );
}

export default AddCurrency;
