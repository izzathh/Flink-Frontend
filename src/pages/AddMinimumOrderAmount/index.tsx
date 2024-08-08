import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { TokenConfig, useAppData } from "../../context/AppContext";
import { useFormik } from "formik";
import { minimumOrderAmountSchema } from "../../schema";
import axios from "axios";
import {
  Button,
  CircularProgress,
  Container,
  FormControl,
  TextField,
  Typography,
} from "@mui/material";
import FullScreenLoader from "../../components/common/FullScreenLoader";
import EmptyOrErrorState from "../../components/common/EmptyOrErrorState";

function AddMinimumOrderAmount() {
  const { enqueueSnackbar } = useSnackbar();
  const { baseUrl, tabIdentifier } = useAppData();
  const [commonFieldsMinOrderAmount, setCommonFieldsMinOrderAmount] = useState<
    number | null
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
        setCommonFieldsMinOrderAmount(data?.commonFields?.minOrderAmount || 0);
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
      minimumOrderAmount: commonFieldsMinOrderAmount || 0,
    },
    validationSchema: minimumOrderAmountSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        await axios.post(
          `${baseUrl}/common-fields/admin/modify-minimum-order-amount`,
          { minimumOrderAmount: values.minimumOrderAmount },
          TokenConfig(tabIdentifier)
        );
        setCommonFieldsMinOrderAmount(values.minimumOrderAmount);
        enqueueSnackbar("Added minimum order amount", {
          variant: "success",
        });
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
        Add/Modify minimum order amount for free delivery
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
            id="minimumOrderAmount"
            name="minimumOrderAmount"
            label="minimum order amount"
            type={"number"}
            placeholder="enter minimum order amount"
            value={formik.values.minimumOrderAmount}
            onChange={formik.handleChange}
            autoFocus
            error={
              formik.touched.minimumOrderAmount &&
              Boolean(formik.errors.minimumOrderAmount)
            }
            helperText={
              Boolean(formik.touched.minimumOrderAmount) && (
                <>{formik.errors.minimumOrderAmount}</>
              )
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
          Add amount
        </Button>
      </form>
    </Container>
  );
}

export default AddMinimumOrderAmount;
