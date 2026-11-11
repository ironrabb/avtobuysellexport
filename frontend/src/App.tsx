import { Box, Button, Container, Typography } from "@mui/material";
import { Link, Route, Routes } from "react-router-dom";
import Announcement from "./app/components/Announcement";
import SiteFooter from "./app/components/SiteFooter";
import SiteHeader from "./app/components/SiteHeader";
import AuthPage from "./app/screens/authPage";
import HelpPage from "./app/screens/helpPage";
import HomePage from "./app/screens/homePage";
import ProductsPage from "./app/screens/productsPage";
import ChosenProduct from "./app/screens/productsPage/ChosenProduct";
import SellPage from "./app/screens/sellPage";
import UserPage from "./app/screens/userPage";
import { useLocale } from "./app/context/LocaleContext";
import { useSession } from "./app/context/SessionContext";

function NotFoundPage() {
  const { t } = useLocale();
  return (
    <Container maxWidth="sm" sx={{ py: 12, textAlign: "center" }}>
      <Typography variant="overline" color="secondary.main">
        404
      </Typography>
      <Typography variant="h1" sx={{ fontSize: 42, my: 2 }}>
        {t("notFoundTitle")}
      </Typography>
      <Button component={Link} to="/" variant="contained">
        {t("goHome")}
      </Button>
    </Container>
  );
}

export default function App() {
  const { restriction, signOut } = useSession();
  const { t } = useLocale();
  if (restriction)
    return (
      <Container
        maxWidth="sm"
        sx={{
          minHeight: "100vh",
          display: "grid",
          alignContent: "center",
          textAlign: "center",
          py: 5,
        }}
      >
        <Typography variant="overline" color="secondary.main">
          AVTO.UZ
        </Typography>
        <Typography variant="h1" sx={{ fontSize: { xs: 30, md: 40 }, my: 2 }}>
          {t("restrictedTitle")}
        </Typography>
        <Typography color="text.secondary" sx={{ lineHeight: 1.8, mb: 3 }}>
          {t("restrictedBody")}
        </Typography>
        <Button variant="contained" onClick={() => void signOut()}>
          {t("logout")}
        </Button>
      </Container>
    );
  return (
    <Box className="app-shell" id="top">
      <Announcement />
      <SiteHeader />
      <Box component="main" className="route-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cars" element={<ProductsPage />} />
          <Route path="/cars/:id" element={<ChosenProduct />} />
          <Route path="/sell" element={<SellPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />
          <Route path="/account" element={<UserPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Box>
      <SiteFooter />
    </Box>
  );
}
