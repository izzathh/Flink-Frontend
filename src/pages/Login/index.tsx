import {
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import EmailIcon from "@mui/icons-material/Email";
import React, { useEffect, useState } from "react";
import { useAppData } from "../../context/AppContext";
import { useNavigate } from "react-router";
import { useSearchParams } from "react-router-dom";

const initialState = {
  email: "",
  password: "",
};

function Login() {
  const [{ email, password }, setState] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [togglePassword, setTogglePassword] = useState(false);

  const { loginUser } = useAppData();

  const togglePasswordHandler = () => {
    setTogglePassword(!togglePassword);
  };

  useEffect(() => {
    if (searchParams.get("email") && searchParams?.get("email")?.length! > 0) {
      setState((prevState) => ({
        ...prevState,
        email: searchParams.get("email")!,
      }));
    }
  }, [searchParams]);

  const onChangeHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    const name = e.target.name;
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const onSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      return setError("Please enter all the fields!");
    }
    try {
      setError("");
      setLoading(true);
      await loginUser(email, password, false);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
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
          Login
        </Typography>
        <form
          style={{ display: "flex", flexDirection: "column" }}
          onSubmit={onSubmitHandler}
        >
          <TextField
            variant="outlined"
            sx={{ margin: "1rem 0" }}
            label="email"
            name="email"
            value={email}
            onChange={onChangeHandler}
            required
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton aria-label="toggle password visibility">
                    <EmailIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            variant="outlined"
            type={togglePassword ? "text" : "password"}
            sx={{ margin: "1rem 0" }}
            label="password"
            name="password"
            value={password}
            onChange={onChangeHandler}
            required
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
          />
          <Typography
            variant="subtitle2"
            color="red"
            sx={{ marginBottom: "0.5rem" }}
          >
            {error}
          </Typography>

          <Box
            display={"flex"}
            flexDirection={"row"}
            justifyContent={"flex-end"}
            width={"100%"}
          >
            <Button
              variant="text"
              sx={{
                marginBottom: "0.75rem",
                textTransform: "lowercase",
                width: "auto",
                color: "InactiveBorder",
              }}
              onClick={() => navigate("/forgot-password")}
            >
              forgot password ?
            </Button>
          </Box>

          <Button
            variant="contained"
            sx={{ margin: "0.5rem 0" }}
            onClick={onSubmitHandler}
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
            login
          </Button>
        </form>
      </Box>
    </Box>
  );
}

export default Login;
