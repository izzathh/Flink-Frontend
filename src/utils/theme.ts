import { grey } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";

declare module "@mui/material/Button" {
  interface ButtonPropsVariantOverrides {
    gradient: true;
  }
}

// Create a theme instance.
const theme = createTheme({
  palette: {
    //  mode: 'dark',
    // primary: {
    //   // main: "#f42b4d",
    //   //   main: grey[700],
    // },
    secondary: {
      main: grey[700],
      // main: "#000000",
    },
  },
  components: {
    MuiButton: {
      //   variants: [
      //     {
      //       props: { variant: "gradient", color: "primary" },
      //       style: {
      //         background:
      //           "radial-gradient(100% 1267.36% at 0% 50%, #F42B4D 0%, #FA541A 100%)",
      //         fontWeight: 500,
      //         borderRadius: 24,
      //         padding: "8px 16px",
      //         color: "white",
      //       },
      //     },
      //     {
      //       props: { variant: "gradient", color: "secondary" },
      //       style: {
      //         background: "linear-gradient(90deg, #232526 0%, #414345 100%);",
      //         fontSize: 16,
      //         fontWeight: 500,
      //         borderRadius: 24,
      //         padding: "8px 16px",
      //         color: "white",
      //       },
      //     },
      //   ],
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          "&:last-child": {
            paddingBottom: "16px",
          },
        },
      },
    },
  },
  zIndex: {
    modal: 1000000,
    tooltip: 1000000, // appBar ie header has it 1000000 as default so had to make it equal to make tooltip visible
    snackbar: 1000001,
  },
});

export default theme;
