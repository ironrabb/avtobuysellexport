import { useState, type FormEvent } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSession } from "../../context/SessionContext";
import { useLocale } from "../../context/LocaleContext";

export default function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { signIn, signUp } = useSession();
  const { t } = useLocale();
  const registering = location.pathname === "/register";
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setBusy(true);
    const data = new FormData(event.currentTarget);
    try {
      if (registering) {
        await signUp({
          name: String(data.get("name")),
          email: String(data.get("email")),
          phone: String(data.get("phone")),
          password: String(data.get("password")),
          type: data.get("type") === "SELLER" ? "SELLER" : "BUYER",
        });
        navigate("/login");
      } else {
        await signIn({
          email: String(data.get("email")),
          password: String(data.get("password")),
        });
        navigate("/account");
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "");
    } finally {
      setBusy(false);
    }
  };
  return (
    <Box className="auth-page-wrap">
      <Card className="auth-page-card">
        <Box className="auth-editorial">
          <img
            className="auth-editorial-logo"
            src="/avto-logo-light.svg"
            alt="AVTO"
          />
          <Typography component="h2" className="auth-editorial-title">
            {t("heroTitle")}
            <br />
            <em>{t("heroTitleTail")}</em>
          </Typography>
          <Typography className="auth-editorial-copy">
            {t("heroBody")}
          </Typography>
          <span className="auth-editorial-rule" />
        </Box>
        <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
          <Typography variant="overline" color="secondary.main">
            AVTO.UZ
          </Typography>
          <Typography variant="h1" sx={{ fontSize: 32, mt: 1, mb: 1 }}>
            {registering ? t("newAccount") : t("welcome")}
          </Typography>
          <Typography color="text.secondary" mb={3}>
            {registering ? t("authIntroRegister") : t("authIntroLogin")}
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Box component="form" onSubmit={(event) => void submit(event)}>
            <Stack spacing={2}>
              {registering && (
                <>
                  <TextField
                    name="name"
                    label={t("fullName")}
                    autoComplete="name"
                    required
                  />
                  <TextField
                    name="phone"
                    label={t("phone")}
                    autoComplete="tel"
                    placeholder="+998 90 123 45 67"
                    required
                  />
                  <FormControl>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      mb={0.5}
                    >
                      {t("accountType")}
                    </Typography>
                    <RadioGroup row name="type" defaultValue="BUYER">
                      <FormControlLabel
                        value="BUYER"
                        control={<Radio size="small" />}
                        label={t("buyer")}
                      />
                      <FormControlLabel
                        value="SELLER"
                        control={<Radio size="small" />}
                        label={t("seller")}
                      />
                    </RadioGroup>
                  </FormControl>
                </>
              )}
              <TextField
                name="email"
                type="email"
                label="Email"
                autoComplete="email"
                required
              />
              <TextField
                name="password"
                type="password"
                label={t("password")}
                autoComplete={registering ? "new-password" : "current-password"}
                inputProps={{ minLength: 8 }}
                required
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                endIcon={<ArrowForward />}
                disabled={busy}
              >
                {busy
                  ? t("waiting")
                  : registering
                    ? t("createAccount")
                    : t("login")}
              </Button>
            </Stack>
          </Box>
          <Typography
            textAlign="center"
            variant="body2"
            color="text.secondary"
            mt={3}
          >
            {registering ? t("haveAccount") : t("noAccount")}{" "}
            <Link
              className="inline-link"
              to={registering ? "/login" : "/register"}
            >
              {registering ? t("login") : t("register")}
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
