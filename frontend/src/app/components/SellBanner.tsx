import { ArrowOutward } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import { useLocale } from "../context/LocaleContext";

type Props = { onSell: () => void };
export default function SellBanner({ onSell }: Props) {
  const { t } = useLocale();
  return (
    <Box component="section" className="sell-banner" id="how">
      <div className="sell-banner-shape">✳</div>
      <Box>
        <Typography className="eyebrow light-eyebrow" variant="overline">
          <span className="eyebrow-line" /> {t("sellEyebrow")}
        </Typography>
        <Typography component="h2" variant="h2">
          {t("sellTitle")}
        </Typography>
        <Typography component="p">{t("sellBody")}</Typography>
      </Box>
      <Button
        onClick={onSell}
        color="secondary"
        variant="contained"
        endIcon={<ArrowOutward />}
      >
        {t("freeListing")}
      </Button>
    </Box>
  );
}
