import React, { useEffect } from "react";
import { CssBaseline } from "@mui/material";
import AppRoutes from "./routes";
import { TokenConfig, useAppData } from "./context/AppContext";
import { Layout } from "./components";
import axios from "axios";

function App() {
  const { loadUser, baseUrl } = useAppData();
  useEffect(() => {
    (async () => {
      try {
        await loadUser();
      } catch (error) {
        console.error("inside", error);
      }
    })();
  }, [loadUser]);

  return (
    <div>
      <CssBaseline />
      <Layout>
        <AppRoutes />
      </Layout>
    </div>
  );
}

export default App;
