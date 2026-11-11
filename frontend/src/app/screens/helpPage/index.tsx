import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Container,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import {
  ExpandMore,
  HelpOutline,
  MailOutline,
  PhoneInTalk,
} from "@mui/icons-material";
import { useLocale } from "../../context/LocaleContext";

export default function HelpPage() {
  const { t } = useLocale();
  const questions = [
    [t("questionListing"), t("answerListing")],
    [t("questionReview"), t("answerReview")],
    [t("questionContact"), t("answerContact")],
    [t("questionPayment"), t("answerPayment")],
  ];
  return (
    <Container maxWidth="md" sx={{ py: { xs: 5, md: 8 } }}>
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        color="secondary.main"
      >
        <HelpOutline />
        <Typography variant="overline">{t("helpCenter")}</Typography>
      </Stack>
      <Typography
        variant="h1"
        sx={{ fontSize: { xs: 34, md: 46 }, mt: 1, mb: 1 }}
      >
        {t("helpTitle")}
      </Typography>
      <Typography color="text.secondary" mb={4}>
        {t("helpIntro")}
      </Typography>
      <Box>
        {questions.map(([question, answer]) => (
          <Accordion
            key={question}
            disableGutters
            elevation={0}
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              "&:before": { display: "none" },
            }}
          >
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography fontWeight={600}>{question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography color="text.secondary" lineHeight={1.8}>
                {answer}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
      <Box
        sx={{
          mt: 5,
          p: { xs: 2.5, sm: 3 },
          bgcolor: "primary.main",
          color: "primary.contrastText",
          borderRadius: 1,
        }}
      >
        <Typography variant="h3" fontSize={20} mb={1}>
          {t("moreHelp")}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.8, mb: 2 }}>
          {t("contactUs")}
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
          <Button
            color="secondary"
            variant="contained"
            startIcon={<MailOutline />}
            component={Link}
            href="mailto:help@avto.uz"
          >
            help@avto.uz
          </Button>
          <Button
            color="inherit"
            variant="outlined"
            startIcon={<PhoneInTalk />}
            component={Link}
            href="tel:+998712000000"
          >
            +998 71 200 00 00
          </Button>
        </Stack>
      </Box>
    </Container>
  );
}
