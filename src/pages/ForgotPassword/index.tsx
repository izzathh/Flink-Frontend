import {
  Button,
  CircularProgress,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { TokenConfig, useAppData } from "../../context/AppContext";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router";

function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [email, setEmail] = useState("");
  const { baseUrl, tabIdentifier } = useAppData();
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const sendOtpHandler = async () => {
    try {
      await axios.post(
        `${baseUrl}/admin-actions/generate-otp`,
        {
          email,
        },
        TokenConfig(tabIdentifier)
      );

      enqueueSnackbar("OTP sent to your registered email address", {
        variant: "success",
      });

      navigate(`/reset-password?email=${email}`, { replace: true });
    } catch (error: any) {
      console.error(error);
      enqueueSnackbar(
        error.response.data.message || "an error occurred. please try again",
        {
          variant: "error",
        }
      );
    }
  };

  const onChangeHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    setEmail(value);
  };

  const onSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      return setError("Please enter your email!");
    }
    setError("");
    setIsLoading(true);
    await sendOtpHandler();
    setIsLoading(false);
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
          Forgot your password
        </Typography>
        <Typography variant="caption" textAlign={"center"} mb={2}>
          forgot your password enter your registered email address and we will
          send you instructions to reset your password
        </Typography>
        <Stack alignItems={"center"} width="100%" mt={4}>
          <form
            onSubmit={onSubmitHandler}
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
              label="enter your email"
              name="email"
              value={email}
              onChange={onChangeHandler}
              required
            />
            <Typography
              variant="subtitle2"
              color="red"
              sx={{ marginBottom: "1rem" }}
            >
              {error}
            </Typography>

            <Button
              variant="contained"
              sx={{ margin: "0.5rem 0" }}
              onClick={onSubmitHandler}
              disabled={isLoading}
              endIcon={
                isLoading ? (
                  <CircularProgress
                    sx={{
                      color: "#fff",
                    }}
                    size={20}
                  />
                ) : null
              }
            >
              Generate Otp
            </Button>
          </form>
        </Stack>
      </Stack>
    </Container>
  );
}

export default ForgotPassword;
