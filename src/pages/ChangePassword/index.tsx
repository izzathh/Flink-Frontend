import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { TokenConfig, useAppData } from "../../context/AppContext";
import axios from "axios";
import { useNavigate } from "react-router";
import { useSnackbar } from "notistack";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { changePasswordSchema } from "../../schema";


const initialState = {
  password: "",
  confirmPassword: "",
};

function ChangePassword() {
  const [{ password, confirmPassword }, setState] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [togglePassword, setTogglePassword] = useState(false);
  const [toggleConfirmPassword, setToggleConfirmPassword] = useState(false);
  const { state, tabIdentifier, baseUrl } = useAppData();

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const togglePasswordHandler = () => {
    setTogglePassword(!togglePassword);
  };

  const onChangeHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    const name = e.target.name;
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const changePasswordHandler = async (password: string) => {
    try {
      const { data } = await axios.post(
        `${baseUrl}/admin-actions/change-password`,
        {
          email: state.user.email,
          password,
        },
        TokenConfig(tabIdentifier)
      );
      enqueueSnackbar("Password changed successfully", {
        variant: "success",
      });

      navigate("/");
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

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(changePasswordSchema),
  });

  const onSubmitHandler = async (formData: { password: string }) => {
    const { password } = formData;
    console.log('password:', password);

    // e.preventDefault();
    // if (!confirmPassword || !password) {
    //   return setError("Please enter all the fields!");
    // }
    // if (confirmPassword !== password) {
    //   return setError("Passwords does not match");
    // }
    setError("");
    setLoading(true);
    await changePasswordHandler(password);
    setLoading(false);
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        mt: 10,
        width: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          padding: "1rem",
          width: { xs: "80%", md: "40%" },
        }}
      >
        <Typography variant="h6" textAlign={"center"} mb={2}>
          Change password
        </Typography>
        <form
          style={{ display: "flex", flexDirection: "column" }}
          onSubmit={handleSubmit(onSubmitHandler)}
        >
          <TextField
            variant="outlined"
            type={togglePassword ? 'text' : 'password'}
            sx={{ margin: '1rem 0' }}
            label="Enter your new password"
            {...register('password')}
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end" onClick={togglePasswordHandler}>
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
            error={errors.password && Boolean(errors.password)}
            helperText={
              Boolean(errors.password) && <>{errors?.password?.message}</>
            }
          />

          <TextField
            variant="outlined"
            type={toggleConfirmPassword ? 'text' : 'password'}
            sx={{ margin: '1rem 0' }}
            label="Re-enter your new password"
            {...register('confirmPassword')}
            required
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment
                  position="end"
                  onClick={() => setToggleConfirmPassword(!toggleConfirmPassword)}
                >
                  <IconButton aria-label="toggle password visibility">
                    {toggleConfirmPassword ? (
                      <VisibilityOffIcon fontSize="small" />
                    ) : (
                      <VisibilityIcon fontSize="small" />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={errors.confirmPassword && Boolean(errors.confirmPassword)}
            helperText={
              Boolean(errors.confirmPassword) && <>{errors?.confirmPassword?.message}</>
            }
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
            onClick={handleSubmit(onSubmitHandler)}
            disabled={loading}
            endIcon={
              loading ? (
                <CircularProgress
                  sx={{
                    color: "#fff",
                  }}
                  size={20}
                />
              ) : null
            }
          >
            Change Password
          </Button>
        </form>
      </Box>
    </Box>
  );
}

export default ChangePassword;
