import { ArrowDownward } from "@mui/icons-material";
import { Box, Link, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useLocale } from "../context/LocaleContext";

export default function Hero() {
  const { t } = useLocale();
  return (
    <Box component="section" className="hero">
      <Box className="hero-copy">
        <Typography className="eyebrow" variant="overline">
          <span className="eyebrow-line" /> {t("heroEyebrow")}
        </Typography>
        <Typography component="h1" variant="h1">
          {t("heroTitle")}
          <br />
          <em>{t("heroTitleTail")}</em>
        </Typography>
        <Typography component="p">{t("heroBody")}</Typography>
        <Link className="hero-link" component={RouterLink} to="/cars">
          {t("browse")} <ArrowDownward fontSize="small" />
        </Link>
      </Box>
      <Box className="hero-visual">
        <img
          src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=90"
          alt={t("heroCaption")}
        />
        <div className="hero-image-shade" />
        <div className="hero-image-caption">
          <img className="hero-logo" src="/avto-logo-light.svg" alt="AVTO" />
          <span>{t("heroCaption")}</span>
        </div>
      </Box>
    </Box>
  );
}
