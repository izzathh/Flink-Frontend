import {
  Button,
  CircularProgress,
  Container,
  FormControl,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import FullScreenLoader from "../../components/common/FullScreenLoader";
import { TokenConfig, useAppData } from "../../context/AppContext";
import { addContactDetailsSchema } from "../../schema";

function AddContactDetails() {
  const { enqueueSnackbar } = useSnackbar();
  const { baseUrl, tabIdentifier } = useAppData();
  const [commonFieldsContactInfo, setCommonFieldsContactInfo] = useState<
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
        //   TokenConfig()
        // );
        setCommonFieldsContactInfo(data?.commonFields?.contactDetails || "");
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
      contactText: commonFieldsContactInfo?.split('$')[0] || "",
      addressText: commonFieldsContactInfo?.split('$')[1] || "",
      copyrightText: commonFieldsContactInfo?.split('$')[2] || "",
    },
    validationSchema: addContactDetailsSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        await axios.post(
          `${baseUrl}/common-fields/admin/modify-contact-details`,
          {
            contactDetails: Object.values(values)
              .map((e) => e)
              .join("$"),
          },
          TokenConfig(tabIdentifier)
        );
        setCommonFieldsContactInfo(`${values.contactText}$${values.addressText}$${values.copyrightText}`);
        enqueueSnackbar("Added Contact Details", {
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
        Modify Footer Details
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
            id="contactText"
            name="contactText"
            label="Contact Text"
            placeholder="Enter Contact Text"
            value={formik.values.contactText}
            onChange={formik.handleChange}
            autoFocus
            error={
              formik.touched.contactText && Boolean(formik.errors.contactText)
            }
            helperText={
              Boolean(formik.touched.contactText) && (
                <>{formik.errors.contactText}</>
              )
            }
            sx={{ mb: 3 }}
            size="medium"
          />
          <TextField
            variant="outlined"
            id="addressText"
            name="addressText"
            label="Address Text"
            placeholder="Enter Contact Text"
            multiline
            rows={4}
            value={formik.values.addressText}
            onChange={formik.handleChange}
            autoFocus
            error={
              formik.touched.addressText && Boolean(formik.errors.addressText)
            }
            helperText={
              Boolean(formik.touched.addressText) && (
                <>{formik.errors.addressText}</>
              )
            }
            sx={{ mb: 3 }}
            size="medium"
          />
          <TextField
            variant="outlined"
            id="copyrightText"
            name="copyrightText"
            label="Copyright Text"
            placeholder="Enter Contact Text"
            value={formik.values.copyrightText}
            onChange={formik.handleChange}
            autoFocus
            error={
              formik.touched.copyrightText &&
              Boolean(formik.errors.copyrightText)
            }
            helperText={
              Boolean(formik.touched.copyrightText) && (
                <>{formik.errors.copyrightText}</>
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
          Modify Footer Details
        </Button>
      </form>
    </Container>
  );
}

export default AddContactDetails;
