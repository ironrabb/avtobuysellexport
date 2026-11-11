import { AutoAwesome, NorthEast } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { useLocale } from "../context/LocaleContext";

export default function Announcement() {
  const { t } = useLocale();
  return (
    <Box className="announcement">
      <AutoAwesome fontSize="small" />
      <Typography variant="caption">{t("announcement")}</Typography>
      <NorthEast fontSize="small" />
    </Box>
  );
}
