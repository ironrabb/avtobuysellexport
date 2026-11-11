import { useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Drawer,
  IconButton,
  Stack,
  Toolbar,
} from "@mui/material";
import { Add, Close, Menu } from "@mui/icons-material";
import { NavLink, useNavigate } from "react-router-dom";
import { useSession } from "../context/SessionContext";
import { useLocale, type Language } from "../context/LocaleContext";

export default function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { member, signOut } = useSession();
  const { language, setLanguage, t } = useLocale();
  const navigate = useNavigate();
  const closeMenu = () => setMobileOpen(false);
  const navItems = (
    <>
      <Button component={NavLink} to="/" onClick={closeMenu}>
        {t("home")}
      </Button>
      <Button component={NavLink} to="/cars" onClick={closeMenu}>
        {t("cars")}
      </Button>
      <Button component={NavLink} to="/help" onClick={closeMenu}>
        {t("help")}
      </Button>
    </>
  );
  return (
    <AppBar
      position="sticky"
      color="transparent"
      elevation={0}
      className="site-header"
    >
      <Toolbar className="site-toolbar" disableGutters>
        <Box
          component={NavLink}
          to="/"
          className="brand-link"
          aria-label="Avto.uz"
        >
          <img src="/avto-logo.svg" className="brand-logo" alt="AVTO" />
        </Box>
        <Box className="desktop-navigation">
          <Stack direction="row" spacing={1} className="main-nav">
            {navItems}
          </Stack>
        </Box>
        <Stack
          className="header-actions"
          direction="row"
          alignItems="center"
          spacing={1.5}
        >
          <select
            className="language-select"
            aria-label={t("language")}
            value={language}
            onChange={(event) => setLanguage(event.target.value as Language)}
          >
            <option value="uz">O‘zbek</option>
            <option value="ru">Русский</option>
            <option value="en">English</option>
            <option value="ko">한국어</option>
          </select>
          {member ? (
            <>
              <Button
                component={NavLink}
                to="/account"
                startIcon={
                  <Avatar
                    className="header-avatar"
                    src={
                      member.avatarUrl
                        ? `/public${member.avatarUrl}`
                        : undefined
                    }
                  >
                    {member.name.slice(0, 1).toUpperCase()}
                  </Avatar>
                }
                className="account-link"
              >
                {member.name}
              </Button>
              <Button color="inherit" onClick={() => void signOut()}>
                {t("logout")}
              </Button>
            </>
          ) : (
            <Button color="inherit" component={NavLink} to="/login">
              {t("login")}
            </Button>
          )}
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => navigate("/sell")}
          >
            {t("sell")}
          </Button>
          <IconButton
            className="mobile-menu"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <Close /> : <Menu />}
          </IconButton>
        </Stack>
      </Toolbar>
      <Drawer anchor="right" open={mobileOpen} onClose={closeMenu}>
        <Stack
          className="mobile-drawer-nav"
          sx={{ width: 260, p: 3 }}
          spacing={1}
        >
          {navItems}
        </Stack>
      </Drawer>
    </AppBar>
  );
}
