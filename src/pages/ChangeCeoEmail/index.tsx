import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { TokenConfig, baseUrl, useAppData } from "../../context/AppContext";
import { useSnackbar } from "notistack";
import axios from "axios";
import { useNavigate, useNavigation, useRoutes } from "react-router";

function ChangeCeoEmail() {
  const { state, loadUser, tabIdentifier } = useAppData();
  const [email, setEmail] = useState(state?.user?.email ?? "");
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const onSubmitHandler = async () => {
    try {
      setLoading(true);

      const data = await axios.post(
        `${baseUrl}/ceo-actions/change-email`,
        { userId: state.user._id, email },
        TokenConfig(tabIdentifier)
      );

      await loadUser();
      enqueueSnackbar("ceo email updated successfully 🙌🏻", {
        variant: "success",
      });
      setLoading(false);
      navigate(-1);
    } catch (error: any) {
      console.log(error);
      enqueueSnackbar(error?.response?.message || "an error occurred", {
        variant: "error",
      });
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
          Change email address
        </Typography>
        <form
          style={{ display: "flex", flexDirection: "column" }}
          onSubmit={onSubmitHandler}
        >
          <TextField
            variant="outlined"
            sx={{ margin: "1rem 0" }}
            label="enter new ceo email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
          />

          <Button
            variant="contained"
            sx={{ marginTop: "3rem" }}
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
            Change email
          </Button>
        </form>
      </Box>
    </Box>
  );
}

export default ChangeCeoEmail;
