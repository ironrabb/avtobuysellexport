import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  ButtonBase,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Container,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import {
  ArrowBack,
  Call,
  ChevronLeft,
  ChevronRight,
  DirectionsCar,
  LocalGasStation,
  Speed,
} from "@mui/icons-material";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../../../lib/api";
import type { Car } from "../../../types";
import { carPhoto, money, regionName } from "../../../types";
import { useLocale } from "../../context/LocaleContext";

type LanguageMap = Record<string, Record<string, string>>;
const fuelNames: LanguageMap = {
  PETROL: { uz: "Benzin", ru: "Бензин", en: "Petrol", ko: "휘발유" },
  DIESEL: { uz: "Dizel", ru: "Дизель", en: "Diesel", ko: "디젤" },
  LPG: { uz: "Gaz", ru: "Газ", en: "LPG", ko: "LPG" },
  CNG: { uz: "Metan", ru: "Метан", en: "CNG", ko: "CNG" },
  HYBRID: { uz: "Gibrid", ru: "Гибрид", en: "Hybrid", ko: "하이브리드" },
  ELECTRIC: { uz: "Elektro", ru: "Электро", en: "Electric", ko: "전기" },
};
const transmissionNames: LanguageMap = {
  MANUAL: { uz: "Mexanika", ru: "Механика", en: "Manual", ko: "수동" },
  AUTOMATIC: { uz: "Avtomat", ru: "Автомат", en: "Automatic", ko: "자동" },
  ROBOT: { uz: "Robot", ru: "Робот", en: "Robot", ko: "로봇" },
  CVT: { uz: "Variator", ru: "Вариатор", en: "CVT", ko: "CVT" },
};

export default function ChosenProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, language } = useLocale();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  useEffect(() => {
    if (!id) return;
    let active = true;
    setLoading(true);
    setError("");
    setActiveImageIndex(0);
    api<Car>(`/api/cars/${id}`)
      .then((result) => {
        if (active) setCar(result);
      })
      .catch((cause: unknown) => {
        if (active)
          setError(cause instanceof Error ? cause.message : t("notFound"));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id, language, t]);
  if (loading)
    return (
      <Box className="page-loading">
        <CircularProgress />
      </Box>
    );
  if (error || !car)
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert
          severity="error"
          action={
            <Button component={Link} to="/cars">
              {t("returnCatalog")}
            </Button>
          }
        >
          {error || t("notFound")}
        </Alert>
      </Container>
    );
  const fuel = fuelNames[car.fuel]?.[language] ?? car.fuel;
  const transmission =
    transmissionNames[car.transmission]?.[language] ?? car.transmission;
  const galleryImages = car.images?.length
    ? car.images.map((_, index) => carPhoto(car, index))
    : [carPhoto(car)];
  const showPreviousImage = () =>
    setActiveImageIndex(
      (current) => (current - 1 + galleryImages.length) % galleryImages.length,
    );
  const showNextImage = () =>
    setActiveImageIndex((current) => (current + 1) % galleryImages.length);
  return (
    <Container
      maxWidth="lg"
      className="chosen-product-page page-frame"
      sx={{ py: { xs: 4, md: 7 } }}
    >
      <Button
        className="detail-back"
        startIcon={<ArrowBack />}
        onClick={() => navigate(-1)}
        sx={{ mb: 2 }}
      >
        {t("back")}
      </Button>
      <Card className="detail-page-card">
        <Box className="detail-gallery">
          <Box className="detail-image-stage">
            <CardMedia
              component="img"
              image={galleryImages[activeImageIndex]}
              alt={`${car.title} — ${activeImageIndex + 1}`}
              className="detail-page-image"
            />
            <Chip
              className="detail-image-counter"
              size="small"
              label={`${String(activeImageIndex + 1).padStart(2, "0")} / ${String(galleryImages.length).padStart(2, "0")}`}
            />
            {galleryImages.length > 1 && (
              <>
                <IconButton
                  className="detail-image-arrow detail-image-previous"
                  aria-label="Oldingi rasm"
                  onClick={showPreviousImage}
                >
                  <ChevronLeft />
                </IconButton>
                <IconButton
                  className="detail-image-arrow detail-image-next"
                  aria-label="Keyingi rasm"
                  onClick={showNextImage}
                >
                  <ChevronRight />
                </IconButton>
              </>
            )}
          </Box>
          {galleryImages.length > 1 && (
            <Stack
              className="detail-image-thumbnails"
              direction="row"
              spacing={1}
              aria-label="Avtomobil rasmlari"
            >
              {galleryImages.map((image, index) => (
                <ButtonBase
                  key={`${image}-${index}`}
                  className={`detail-image-thumbnail${index === activeImageIndex ? " is-active" : ""}`}
                  aria-label={`Rasm ${index + 1}`}
                  aria-pressed={index === activeImageIndex}
                  onClick={() => setActiveImageIndex(index)}
                >
                  <CardMedia component="img" image={image} alt="" />
                </ButtonBase>
              ))}
            </Stack>
          )}
        </Box>
        <CardContent className="detail-copy" sx={{ p: { xs: 2.5, md: 4 } }}>
          <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
            <Chip
              className="detail-verified-chip"
              size="small"
              label={t("verifiedListing")}
            />
            <Chip
              size="small"
              variant="outlined"
              label={regionName(car.region, language)}
            />
          </Stack>
          <Typography variant="overline" color="text.secondary">
            {car.year} · {car.make}
          </Typography>
          <Typography variant="h1" sx={{ fontSize: { xs: 30, md: 42 }, mb: 2 }}>
            {car.title}
          </Typography>
          <Typography
            variant="h2"
            color="primary.main"
            sx={{ fontSize: 30, mb: 3 }}
          >
            {money(car.price, language)}{" "}
            <Typography component="span" color="text.secondary" fontSize={14}>
              {t("currency")}
            </Typography>
          </Typography>
          <Stack
            direction="row"
            spacing={3}
            flexWrap="wrap"
            useFlexGap
            sx={{ mb: 3 }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Speed color="action" />
              <Typography>{money(car.mileage, language)} km</Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <LocalGasStation color="action" />
              <Typography>{fuel}</Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <DirectionsCar color="action" />
              <Typography>{transmission}</Typography>
            </Stack>
          </Stack>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="h3" fontSize={18} mb={1}>
            {t("descriptionLabel")}
          </Typography>
          <Typography
            color="text.secondary"
            sx={{ lineHeight: 1.8, whiteSpace: "pre-wrap" }}
          >
            {car.description || t("noDescription")}
          </Typography>
          <Card
            className="detail-seller-card"
            variant="outlined"
            sx={{
              mt: 4,
              p: 2,
              display: "flex",
              alignItems: "center",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Box className="avatar">
              {car.sellerId?.name?.slice(0, 1) ?? "S"}
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
              >
                {t("sellerLabel")}
              </Typography>
              <Typography fontWeight={700}>
                {car.sellerId?.name ?? t("noSeller")}
              </Typography>
            </Box>
            {car.sellerId?.phone && (
              <Button
                variant="contained"
                startIcon={<Call />}
                href={`tel:${car.sellerId.phone}`}
              >
                {t("call")}
              </Button>
            )}
          </Card>
        </CardContent>
      </Card>
    </Container>
  );
}
