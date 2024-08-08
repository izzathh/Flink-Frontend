import {
  Button,
  CircularProgress,
  Container,
  FormControl,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import React, { useState, useEffect } from "react";
import { generateUserSchema } from "../../schema";
import { useSnackbar } from "notistack";
import axios from "axios";
import { TokenConfig, useAppData } from "../../context/AppContext";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

function GenerateUsers() {
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const { baseUrl, tabIdentifier } = useAppData();
  const [branchCode, setBranchCode] = useState("");
  const [isError, setIsError] = useState(false);
  const [commonFieldsCurrency, setCommonFieldsCurrency] = useState<
    string | null
  >(null);

  const [togglePassword, setTogglePassword] = useState(false);

  const togglePasswordHandler = () => {
    setTogglePassword(!togglePassword);
  };

  const initialValues = {
    email: "",
    name: "",
    password: "",
    googleMapLocation: "",
    branchCode: "",
    houseNumber: "",
    streetAddress: "",
    phoneNumber: "",
    max_daily_order: "",
  };

  const formik = useFormik({
    initialValues,
    validationSchema: generateUserSchema,
    onSubmit: async (values) => {
      try {
        await axios.post(
          `${baseUrl}/admin/register-user`,
          values,
          TokenConfig(tabIdentifier)
        );
        enqueueSnackbar("User generated successfully!", { variant: "success" });
        formik.resetForm();
      } catch (error: any) {
        console.log({ error });
        enqueueSnackbar(error?.response?.data?.message || "an error occurred", {
          variant: "error",
        });
      }
    },
  });

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
        setBranchCode(data.branchCode || "")
        setIsLoading(false);
        setIsError(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
        setIsError(true);
      }
    })();
  }, [baseUrl]);

  useEffect(() => {
    formik.values.branchCode = branchCode
  }, [branchCode])

  const MaxDailyOrderLabel = `max daily order amount (${commonFieldsCurrency}) [Optional]`
  return (
    <Container maxWidth="lg" sx={{ mt: 0.5 }}>
      <Stack
        alignItems={"center"}
        justifyContent="center"
        flexDirection={"column"}
        sx={{
          padding: { xs: 0, md: "1rem" },
          width: "100%",
        }}
      >
        <Typography variant="h6" textAlign={"center"} mb={2}>
          Generate User
        </Typography>
        <Stack alignItems={"center"} width="100%" mt={4}>
          <form
            onSubmit={formik.handleSubmit}
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <FormControl
              variant="standard"
              sx={{ width: { xs: "100%", md: "50%" } }}
            >
              <TextField
                variant="outlined"
                id="email"
                name="email"
                label="email"
                placeholder="enter user email"
                InputProps={{
                  inputProps: { maxLength: 70 }
                }}
                value={formik.values.email}
                onChange={formik.handleChange}
                autoFocus
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={
                  Boolean(formik.touched.email) && <>{formik.errors.email}</>
                }
                sx={{ mb: 3 }}
                size="medium"
              />
            </FormControl>

            <FormControl
              variant="standard"
              sx={{ width: { xs: "100%", md: "50%" } }}
            >
              <TextField
                variant="outlined"
                id="name"
                name="name"
                label="name"
                placeholder="enter the name of the user"
                autoFocus
                value={formik.values.name}
                InputProps={{
                  inputProps: { maxLength: 70 }
                }}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={
                  Boolean(formik.touched.name) && <>{formik.errors.name}</>
                }
                sx={{ mb: 3 }}
                size="medium"
              />
            </FormControl>

            <FormControl
              variant="standard"
              sx={{ width: { xs: "100%", md: "50%" } }}
            >
              <TextField
                variant="outlined"
                id="password"
                name="password"
                label="password"
                type={togglePassword ? "text" : "password"}
                placeholder="enter password"
                value={formik.values.password}
                onChange={formik.handleChange}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={
                  Boolean(formik.touched.password) && (
                    <>{formik.errors.password}</>
                  )
                }
                sx={{ mb: 3 }}
                size="medium"
                InputProps={{
                  endAdornment: (
                    <InputAdornment
                      position="end"
                      onClick={togglePasswordHandler}
                    >
                      <IconButton aria-label="toggle password visibility">
                        {togglePassword ? (
                          <VisibilityOffIcon fontSize="small" />
                        ) : (
                          <VisibilityIcon fontSize="small" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>

            <FormControl
              variant="standard"
              sx={{ width: { xs: "100%", md: "50%" } }}
            >
              <TextField
                variant="outlined"
                id="branchCode"
                name="branchCode"
                label="branch code"
                placeholder="enter branch code"
                // autoFocus
                value={branchCode}
                onChange={formik.handleChange}
                InputProps={{
                  readOnly: true,
                  inputProps: { maxLength: 70 }
                }}
                error={formik.touched.branchCode && Boolean(formik.errors.branchCode)}
                helperText={
                  Boolean(formik.touched.branchCode) && <>{formik.errors.branchCode}</>
                }
                sx={{ mb: 3 }}
                size="medium"
              />
            </FormControl>

            <FormControl
              variant="standard"
              sx={{ width: { xs: "100%", md: "50%" } }}
            >
              <TextField
                variant="outlined"
                id="googleMapLocation"
                name="googleMapLocation"
                label="Google map location (optional)"
                placeholder="enter google map location (optional)"
                value={formik.values.googleMapLocation}
                InputProps={{
                  inputProps: { maxLength: 140 }
                }}
                onChange={formik.handleChange}
                error={
                  formik.touched.googleMapLocation &&
                  Boolean(formik.errors.googleMapLocation)
                }
                helperText={
                  Boolean(formik.touched.googleMapLocation) && (
                    <>{formik.errors.googleMapLocation}</>
                  )
                }
                sx={{ mb: 3 }}
                size="medium"
              />
            </FormControl>

            <FormControl
              variant="standard"
              sx={{ width: { xs: "100%", md: "50%" } }}
            >
              <TextField
                variant="outlined"
                id="coordinates"
                name="coordinates"
                label="Coordinates"
                placeholder="enter coordinates"
                value={formik.values.googleMapLocation}
                InputProps={{
                  inputProps: { maxLength: 140 }
                }}
                onChange={formik.handleChange}
                error={
                  formik.touched.googleMapLocation &&
                  Boolean(formik.errors.googleMapLocation)
                }
                helperText={
                  Boolean(formik.touched.googleMapLocation) && (
                    <>{formik.errors.googleMapLocation}</>
                  )
                }
                sx={{ mb: 3 }}
                size="medium"
              />
            </FormControl>

            <FormControl
              variant="standard"
              sx={{ width: { xs: "100%", md: "50%" } }}
            >
              <TextField
                variant="outlined"
                id="houseNumber"
                name="houseNumber"
                label="House number/identifier (optional)"
                placeholder="enter house number/identifier (optional)"
                value={formik.values.houseNumber}
                InputProps={{
                  inputProps: { maxLength: 140 }
                }}
                onChange={formik.handleChange}
                error={formik.touched.houseNumber && Boolean(formik.errors.houseNumber)}
                helperText={
                  Boolean(formik.touched.houseNumber) && <>{formik.errors.houseNumber}</>
                }
                sx={{ mb: 3 }}
                size="medium"
              />
            </FormControl>

            <FormControl
              variant="standard"
              sx={{ width: { xs: "100%", md: "50%" } }}
            >
              <TextField
                variant="outlined"
                id="streetAddress"
                name="streetAddress"
                label="street address"
                placeholder="enter street address"
                value={formik.values.streetAddress}
                InputProps={{
                  inputProps: { maxLength: 140 }
                }}
                onChange={formik.handleChange}
                error={
                  formik.touched.streetAddress &&
                  Boolean(formik.errors.streetAddress)
                }
                helperText={
                  Boolean(formik.touched.streetAddress) && (
                    <>{formik.errors.streetAddress}</>
                  )
                }
                sx={{ mb: 3 }}
                size="medium"
              />
            </FormControl>

            <FormControl
              variant="standard"
              sx={{ width: { xs: "100%", md: "50%" } }}
            >
              <TextField
                variant="outlined"
                id="phoneNumber"
                name="phoneNumber"
                label="phone number"
                placeholder="enter phone number"
                value={formik.values.phoneNumber}
                InputProps={{
                  inputProps: {
                    minLength: 4,
                    maxLength: 13
                  }
                }}
                onChange={formik.handleChange}
                error={
                  formik.touched.phoneNumber &&
                  Boolean(formik.errors.phoneNumber)
                }
                helperText={
                  Boolean(formik.touched.phoneNumber) && (
                    <>{formik.errors.phoneNumber}</>
                  )
                }
                sx={{ mb: 3 }}
                size="medium"
              />
            </FormControl>

            <FormControl
              variant="standard"
              sx={{ width: { xs: "100%", md: "50%" } }}
            >
              <TextField
                variant="outlined"
                id="max_daily_order"
                name="max_daily_order"
                label={MaxDailyOrderLabel}
                placeholder="enter max daily order amount"
                value={formik.values.max_daily_order}
                InputProps={{
                  inputProps: {
                    maxLength: 11
                  }
                }}
                onChange={formik.handleChange}
                error={
                  formik.touched.max_daily_order &&
                  Boolean(formik.errors.max_daily_order)
                }
                helperText={
                  Boolean(formik.touched.max_daily_order) && (
                    <>{formik.errors.max_daily_order}</>
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
              Generate
            </Button>
          </form>
        </Stack>
      </Stack>
    </Container>
  );
}

export default GenerateUsers;
