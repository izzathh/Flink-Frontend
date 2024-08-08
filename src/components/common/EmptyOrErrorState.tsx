import { Container, Stack, Typography } from "@mui/material";
import React from "react";

function EmptyOrErrorState({ text }: { text: string }) {
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
          height: "60vh",
        }}
      >
        <Typography variant="h6">{text}</Typography>
      </Stack>
    </Container>
  );
}

export default EmptyOrErrorState;
