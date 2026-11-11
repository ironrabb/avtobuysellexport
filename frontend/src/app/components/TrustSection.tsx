import { ArrowOutward } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { useLocale } from "../context/LocaleContext";

export default function TrustSection() {
  const { t } = useLocale();
  const benefits = [
    ["01", t("checked"), t("checkedBody")],
    ["02", t("direct"), t("directBody")],
    ["03", t("easySearch"), t("easySearchBody")],
  ];
  return (
    <Box component="section" className="trust-section section-wrap" id="about">
      <Box className="trust-intro">
        <Typography className="eyebrow" variant="overline">
          <span className="eyebrow-line" /> {t("benefits")}
        </Typography>
        <Typography component="h2" variant="h2">
          {t("chooseEasy")}
          <br />
          <em>{t("calm")}</em>
        </Typography>
        <Typography component="p">{t("benefitIntro")}</Typography>
      </Box>
      <Box className="trust-points">
        {benefits.map(([number, title, description]) => (
          <Box key={number}>
            <span className="trust-number">{number}</span>
            <Box>
              <Typography component="h3" variant="h3">
                {title}
              </Typography>
              <Typography component="p">{description}</Typography>
            </Box>
            <ArrowOutward fontSize="small" />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
