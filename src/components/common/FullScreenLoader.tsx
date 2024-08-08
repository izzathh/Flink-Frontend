import { CircularProgress, Container, Stack } from "@mui/material";
import React from "react";

function FullScreenLoader() {
  return (
    <Container sx={{ mt: 0.5 }}>
      <Stack
        alignItems={"center"}
        justifyContent="center"
        flexDirection={"column"}
        sx={{
          padding: "1rem",
          width: "100%",
          maxWidth: "100%",
        }}
      >
        <CircularProgress size={40} />
      </Stack>
    </Container>
  );
}

export default FullScreenLoader;
