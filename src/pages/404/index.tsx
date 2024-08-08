import { Container, Stack, Typography } from "@mui/material";
import React from "react";

function RouteNotFoundPage() {
  return (
    <Container>
      <Stack alignItems={"center"} justifyContent={"center"} height={"60vh"}>
        <Typography variant="h5">
          We can't find the page you are looking for 😕
        </Typography>
      </Stack>
    </Container>
  );
}

export default RouteNotFoundPage;
