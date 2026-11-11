import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  Alert,
  Box,
  Button,
  Container,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Close, CloudUpload } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { fuels, makes } from "../../../constants";
import { api } from "../../../lib/api";
import { regions, type Car } from "../../../types";
import { useSession } from "../../context/SessionContext";
import { useLocale } from "../../context/LocaleContext";

const regionsByLanguage: Record<string, Record<string, string>> = {
  uz: {
    TASHKENT: "Toshkent shahri",
    TASHKENT_REGION: "Toshkent viloyati",
    SAMARKAND: "Samarqand",
    ANDIJAN: "Andijon",
    FERGANA: "Farg‘ona",
    NAMANGAN: "Namangan",
    BUKHARA: "Buxoro",
    KHOREZM: "Xorazm",
    NAVOI: "Navoiy",
    KASHKADARYA: "Qashqadaryo",
    SURKHANDARYA: "Surxondaryo",
    JIZZAKH: "Jizzax",
    SYRDARYA: "Sirdaryo",
    KARAKALPAKSTAN: "Qoraqalpog‘iston",
  },
  ru: {
    TASHKENT: "Ташкент",
    TASHKENT_REGION: "Ташкентская область",
    SAMARKAND: "Самарканд",
    ANDIJAN: "Андижан",
    FERGANA: "Фергана",
    NAMANGAN: "Наманган",
    BUKHARA: "Бухара",
    KHOREZM: "Хорезм",
    NAVOI: "Навои",
    KASHKADARYA: "Кашкадарья",
    SURKHANDARYA: "Сурхандарья",
    JIZZAKH: "Джизак",
    SYRDARYA: "Сырдарья",
    KARAKALPAKSTAN: "Каракалпакстан",
  },
  en: {
    TASHKENT: "Tashkent city",
    TASHKENT_REGION: "Tashkent region",
    SAMARKAND: "Samarkand",
    ANDIJAN: "Andijan",
    FERGANA: "Fergana",
    NAMANGAN: "Namangan",
    BUKHARA: "Bukhara",
    KHOREZM: "Khorezm",
    NAVOI: "Navoi",
    KASHKADARYA: "Kashkadarya",
    SURKHANDARYA: "Surkhandarya",
    JIZZAKH: "Jizzakh",
    SYRDARYA: "Syrdarya",
    KARAKALPAKSTAN: "Karakalpakstan",
  },
  ko: {
    TASHKENT: "타슈켄트시",
    TASHKENT_REGION: "타슈켄트주",
    SAMARKAND: "사마르칸트",
    ANDIJAN: "안디잔",
    FERGANA: "페르가나",
    NAMANGAN: "나망간",
    BUKHARA: "부하라",
    KHOREZM: "호레즘",
    NAVOI: "나보이",
    KASHKADARYA: "카슈카다리야",
    SURKHANDARYA: "수르한다리야",
    JIZZAKH: "지자흐",
    SYRDARYA: "시르다리야",
    KARAKALPAKSTAN: "카라칼팍스탄",
  },
};
const labels: Record<string, Record<string, string>> = {
  uz: {
    MANUAL: "Mexanika",
    AUTOMATIC: "Avtomat",
    ROBOT: "Robot",
    CVT: "Variator",
    PETROL: "Benzin",
    DIESEL: "Dizel",
    LPG: "Gaz",
    CNG: "Metan",
    HYBRID: "Gibrid",
    ELECTRIC: "Elektro",
  },
  ru: {
    MANUAL: "Механика",
    AUTOMATIC: "Автомат",
    ROBOT: "Робот",
    CVT: "Вариатор",
    PETROL: "Бензин",
    DIESEL: "Дизель",
    LPG: "Газ",
    CNG: "Метан",
    HYBRID: "Гибрид",
    ELECTRIC: "Электро",
  },
  en: {
    MANUAL: "Manual",
    AUTOMATIC: "Automatic",
    ROBOT: "Robot",
    CVT: "CVT",
    PETROL: "Petrol",
    DIESEL: "Diesel",
    LPG: "LPG",
    CNG: "CNG",
    HYBRID: "Hybrid",
    ELECTRIC: "Electric",
  },
  ko: {
    MANUAL: "수동",
    AUTOMATIC: "자동",
    ROBOT: "로봇",
    CVT: "CVT",
    PETROL: "휘발유",
    DIESEL: "디젤",
    LPG: "LPG",
    CNG: "CNG",
    HYBRID: "하이브리드",
    ELECTRIC: "전기",
  },
};

export default function SellPage() {
  const { member } = useSession();
  const { language, t } = useLocale();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busy, setBusy] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const previews = useMemo(
    () => selectedImages.map((file) => URL.createObjectURL(file)),
    [selectedImages],
  );
  useEffect(
    () => () => previews.forEach((url) => URL.revokeObjectURL(url)),
    [previews],
  );
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    if (!member) {
      navigate("/login");
      return;
    }
    if (member.type !== "SELLER" && member.type !== "ADMIN") {
      setError(t("sellerOnly"));
      return;
    }
    setBusy(true);
    const form = event.currentTarget;
    const data = new FormData(form);
    const body = new FormData();
    for (const field of [
      "title",
      "make",
      "model",
      "year",
      "price",
      "mileage",
      "transmission",
      "fuel",
      "region",
      "description",
    ])
      body.append(field, String(data.get(field) ?? ""));
    for (const file of selectedImages) body.append("images", file);
    try {
      const created = await api<Car>("/api/cars", { method: "POST", body });
      setSuccess(
        member.type === "ADMIN" && created.status === "ACTIVE"
          ? t("listingPublished")
          : t("listingSent"),
      );
      form.reset();
      setSelectedImages([]);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : t("listingError"));
    } finally {
      setBusy(false);
    }
  };
  const localeOptions = labels[language];
  return (
    <Container
      maxWidth="lg"
      className="sell-page page-frame"
      sx={{ py: { xs: 5, md: 8 } }}
    >
      <Box className="sell-page-sidebar">
        <Box className="page-intro sell-page-intro">
          <Typography variant="overline" color="secondary.main">
            {t("sellFor")}
          </Typography>
          <Typography variant="h1" sx={{ fontSize: { xs: 38, md: 54 }, mb: 1 }}>
            {t("carListing")}
          </Typography>
          <Typography color="text.secondary" mb={4}>
            {t("listingHelp")}
          </Typography>
        </Box>
        {!member && (
          <Alert severity="info" sx={{ mb: 2 }}>
            {t("loginToSell")}{" "}
            <Button size="small" onClick={() => navigate("/login")}>
              {t("login")}
            </Button>
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}
      </Box>
      <Paper
        className="listing-form"
        component="form"
        onSubmit={(event) => void submit(event)}
        sx={{ p: { xs: 2, sm: 4 } }}
      >
        <Stack spacing={2.5}>
          <Typography variant="h3" fontSize={19}>
            {t("mainInfo")}
          </Typography>
          <TextField
            name="title"
            label={t("listingTitle")}
            placeholder="Chevrolet Cobalt 2022"
            inputProps={{ maxLength: 160 }}
            required
            fullWidth
          />
          <Box className="form-grid-two">
            <TextField
              name="make"
              label={t("make")}
              select
              required
              defaultValue=""
            >
              <MenuItem value="" disabled>
                {t("select")}
              </MenuItem>
              {makes.map((name) => (
                <MenuItem key={name} value={name}>
                  {name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              name="model"
              label={t("model")}
              placeholder="Cobalt"
              required
            />
          </Box>
          <Box className="form-grid-two">
            <TextField
              name="year"
              label={t("year")}
              type="number"
              defaultValue={2022}
              inputProps={{ min: 1900, max: new Date().getFullYear() + 1 }}
              required
            />
            <TextField
              name="price"
              label={`${t("price")} (${t("currency")})`}
              type="number"
              inputProps={{ min: 0 }}
              required
            />
          </Box>
          <Box className="form-grid-two">
            <TextField
              name="mileage"
              label={t("mileage")}
              type="number"
              inputProps={{ min: 0 }}
              required
            />
            <TextField
              name="region"
              label={t("region")}
              select
              required
              defaultValue=""
            >
              <MenuItem value="" disabled>
                {t("select")}
              </MenuItem>
              {regions.map(([key]) => (
                <MenuItem key={key} value={key}>
                  {regionsByLanguage[language][key] ?? key}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box className="form-grid-two">
            <TextField
              name="transmission"
              label={t("transmission")}
              select
              defaultValue="MANUAL"
            >
              {["MANUAL", "AUTOMATIC", "ROBOT", "CVT"].map((key) => (
                <MenuItem value={key} key={key}>
                  {localeOptions[key] ?? key}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              name="fuel"
              label={t("fuelType")}
              select
              defaultValue="PETROL"
            >
              {fuels.map(([key]) => (
                <MenuItem key={key} value={key}>
                  {localeOptions[key] ?? key}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <TextField
            name="description"
            label={t("description")}
            multiline
            minRows={4}
            inputProps={{ maxLength: 5000 }}
            placeholder={t("description")}
          />
          <Button
            className="image-upload-action"
            component="label"
            variant="outlined"
            color="inherit"
            startIcon={<CloudUpload />}
            sx={{ alignSelf: "flex-start" }}
          >
            {t("chooseImages")}
            <input
              name="images"
              type="file"
              hidden
              multiple
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) =>
                setSelectedImages(
                  Array.from(event.target.files ?? []).slice(0, 10),
                )
              }
            />
          </Button>
          <Typography variant="caption" color="text.secondary">
            {t("uploadHelp")}
          </Typography>
          {previews.length > 0 && (
            <Box className="image-preview-grid" aria-live="polite">
              {previews.map((src, index) => (
                <Box
                  component="figure"
                  className="image-preview"
                  key={`${src}-${index}`}
                >
                  <img src={src} alt={`${t("selectedPhoto")} ${index + 1}`} />
                  <IconButton
                    aria-label={t("removePhoto")}
                    onClick={() =>
                      setSelectedImages((files) =>
                        files.filter((_, fileIndex) => fileIndex !== index),
                      )
                    }
                  >
                    <Close />
                  </IconButton>
                </Box>
              ))}
            </Box>
          )}
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={busy}
          >
            {busy ? t("sending") : t("sendListing")}
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
