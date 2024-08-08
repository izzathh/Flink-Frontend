import {
  Button,
  CircularProgress,
  Container,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { TokenConfig, useAppData } from "../../context/AppContext";
import { useSnackbar } from "notistack";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router";
import { useFormik } from "formik";
import { resetPasswordSchema } from "../../schema";
import { useSearchParams } from "react-router-dom";

function ResetPassword() {
  const [togglePassword, setTogglePassword] = useState(false);
  const { baseUrl, tabIdentifier } = useAppData();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { enqueueSnackbar } = useSnackbar();

  const formik = useFormik({
    initialValues: {
      otp: "",
      password: "",
    },
    validationSchema: resetPasswordSchema,
    onSubmit: async (values) => {
      try {
        const { data } = await axios.post(
          `${baseUrl}/admin-actions/reset-password`,
          {
            email: searchParams.get("email"),
            otp: values.otp,
            password: values.password,
          },
          TokenConfig(tabIdentifier)
        );
        enqueueSnackbar(
          "Password reset successfull. Please use the new password to login",
          {
            variant: "success",
          }
        );

        navigate(`/login?email=${searchParams.get("email")}`, {
          replace: true,
        });
      } catch (error: any) {
        console.error(error);
        enqueueSnackbar(
          error.response.data.message || "an error occurred. please try again",
          {
            variant: "error",
          }
        );
      }
    },
  });

  const togglePasswordHandler = () => {
    setTogglePassword(!togglePassword);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 0.5 }}>
      <Stack
        alignItems={"center"}
        justifyContent="center"
        flexDirection={"column"}
        sx={{
          padding: "1rem",
          width: "100%",
        }}
      >
        <Typography variant="h6" textAlign={"center"} mb={2}>
          Reset your password
        </Typography>
        <Typography variant="caption" textAlign={"center"} mb={2}>
          enter the otp which you received on your registered email address and
          enter the new password to reset your account password.
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
            <TextField
              variant="outlined"
              sx={{ margin: "1rem 0", width: "50%" }}
              label="enter OTP"
              id="otp"
              name="otp"
              value={formik.values.otp}
              onChange={formik.handleChange}
              required
              error={formik.touched.otp && Boolean(formik.errors.otp)}
              helperText={
                Boolean(formik.touched.otp) && <>{formik.errors.otp}</>
              }
            />

            <TextField
              variant="outlined"
              type={togglePassword ? "text" : "password"}
              sx={{ margin: "1rem 0", width: "50%" }}
              label="enter your new password"
              id="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              required
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={
                Boolean(formik.touched.password) && (
                  <>{formik.errors.password}</>
                )
              }
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

            <Button
              variant="contained"
              type="submit"
              sx={{ margin: "0.5rem 0" }}
              disabled={formik.isSubmitting}
              endIcon={
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
              Reset Password
            </Button>
          </form>
        </Stack>
      </Stack>
    </Container>
  );
}

export default ResetPassword;
