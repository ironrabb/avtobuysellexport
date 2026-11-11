import { Box, Container, Link, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useLocale } from "../context/LocaleContext";

export default function SiteFooter() {
  const { t } = useLocale();
  return (
    <Box component="footer" className="footer">
      <Container maxWidth="lg" className="footer-inner">
        <Link
          component={RouterLink}
          to="/"
          underline="none"
          className="footer-brand"
        >
          <img src="/avto-logo.svg" alt="AVTO" />
        </Link>
        <Typography variant="body2" color="text.secondary">
          {t("footerTag")}
        </Typography>
        <Stack direction="row" spacing={2}>
          <Link
            component={RouterLink}
            to="/cars"
            color="text.secondary"
            underline="hover"
          >
            {t("cars")}
          </Link>
          <Link
            component={RouterLink}
            to="/help"
            color="text.secondary"
            underline="hover"
          >
            {t("help")}
          </Link>
          <Typography variant="caption" color="text.secondary">
            © 2026 Avto.uz
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
