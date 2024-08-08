import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { TokenConfig, useAppData } from "../../context/AppContext";
import { useFormik } from "formik";
import { addNoticeTextSchema } from "../../schema";
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

function AddNoticeText() {
  const { enqueueSnackbar } = useSnackbar();
  const { baseUrl, tabIdentifier } = useAppData();
  const [commonFieldsNoticeText, setCommonFieldsNoticeText] = useState<
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
        setCommonFieldsNoticeText(data?.commonFields?.noticeText || "");
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
      noticeText: commonFieldsNoticeText || "",
    },
    validationSchema: addNoticeTextSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        await axios.post(
          `${baseUrl}/common-fields/admin/modify-notice-text`,
          { noticeText: values.noticeText },
          TokenConfig(tabIdentifier)
        );
        setCommonFieldsNoticeText(values.noticeText);
        enqueueSnackbar("Added notice text", {
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
        Add Notice Text
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
            id="noticeText"
            name="noticeText"
            label="notice text"
            placeholder="enter notice text"
            multiline
            rows={4}
            value={formik.values.noticeText}
            onChange={formik.handleChange}
            autoFocus
            error={
              formik.touched.noticeText && Boolean(formik.errors.noticeText)
            }
            helperText={
              Boolean(formik.touched.noticeText) && (
                <>{formik.errors.noticeText}</>
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
          Add contact details
        </Button>
      </form>
    </Container>
  );
}

export default AddNoticeText;
