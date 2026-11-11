import React from "react";
import ReactDOM from "react-dom/client";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import theme from "./app/components/MaterialTheme";
import { SessionProvider } from "./app/context/SessionContext";
import { LocaleProvider } from "./app/context/LocaleContext";
import { FavoritesProvider } from "./app/context/FavoritesContext";
import "./styles.css";
import "./app/components/MaterialTheme/styled.css";
import "./modern.css";
import "./saasly-palette.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <LocaleProvider>
          <SessionProvider>
            <FavoritesProvider>
              <App />
            </FavoritesProvider>
          </SessionProvider>
        </LocaleProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
);
