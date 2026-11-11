import { createTheme } from "@mui/material/styles";
import { typography } from "./typography";
import { componentStyles } from "./components";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#615fff",
      dark: "#4b4ae6",
      light: "#8988ff",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#7b7aff",
      dark: "#615fff",
      light: "#b6b5ff",
      contrastText: "#ffffff",
    },
    background: { default: "#f2f6fb", paper: "#ffffff" },
    text: { primary: "#101828", secondary: "#6a7282" },
    divider: "#e5e7eb",
    success: { main: "#15803d" },
    error: { main: "#dc2626" },
  },
  typography,
  shape: { borderRadius: 4 },
  components: componentStyles,
});

export default theme;
