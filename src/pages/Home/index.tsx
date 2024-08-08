import { Container, Typography } from "@mui/material";

function Home() {
  return (
    <Container
      maxWidth="lg"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "80vh",
      }}
    >
      <Typography variant="h4">Dashboard</Typography>
    </Container>
  );
}

export default Home;
