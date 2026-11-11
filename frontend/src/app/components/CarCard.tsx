import {
  ArrowUpward,
  Favorite,
  FavoriteBorder,
  LocalGasStation,
  Speed,
} from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Car } from "../../types";
import { carPhoto, money, regionName } from "../../types";
import { useLocale } from "../context/LocaleContext";
import { useSession } from "../context/SessionContext";
import { useFavorites } from "../context/FavoritesContext";

type Props = { car: Car; index: number; onOpen: (car: Car) => void };
const fuelLabels = {
  uz: {
    PETROL: "Benzin",
    DIESEL: "Dizel",
    LPG: "Gaz",
    CNG: "Metan",
    HYBRID: "Gibrid",
    ELECTRIC: "Elektro",
  },
  ru: {
    PETROL: "Бензин",
    DIESEL: "Дизель",
    LPG: "Газ",
    CNG: "Метан",
    HYBRID: "Гибрид",
    ELECTRIC: "Электро",
  },
  en: {
    PETROL: "Petrol",
    DIESEL: "Diesel",
    LPG: "LPG",
    CNG: "CNG",
    HYBRID: "Hybrid",
    ELECTRIC: "Electric",
  },
  ko: {
    PETROL: "휘발유",
    DIESEL: "디젤",
    LPG: "LPG",
    CNG: "CNG",
    HYBRID: "하이브리드",
    ELECTRIC: "전기",
  },
} as const;

export default function CarCard({ car, index, onOpen }: Props) {
  const { language, t } = useLocale();
  const { member } = useSession();
  const { isFavorite, toggleFavorite } = useFavorites();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  const saved = isFavorite(car._id);
  const isOwner = Boolean(
    member?.id && car.sellerId?._id && member.id === car.sellerId._id,
  );
  const openCar = () => onOpen(car);

  const handleFavoriteClick = async (event: React.MouseEvent) => {
    event.stopPropagation();
    if (!member) {
      if (window.confirm(t("loginToFavorite"))) {
        navigate("/auth");
      }
      return;
    }
    if (busy) return;
    setBusy(true);
    try {
      await toggleFavorite(car._id);
    } catch {
      // Ignored, handled by rollback
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card className="car-card" style={{ animationDelay: `${index * 55}ms` }}>
      <Box
        className="card-image"
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") openCar();
        }}
        onClick={openCar}
        aria-label={`${car.title} — ${t("details")} `}
      >
        <CardMedia
          component="img"
          image={carPhoto(car)}
          alt={car.title}
          loading="lazy"
        />
        {isOwner && (
          <Chip className="owner-label" size="small" label={t("yourListing")} />
        )}
        <IconButton
          className={saved ? "favorite saved" : "favorite"}
          onClick={handleFavoriteClick}
          aria-label={t("save")}
          disabled={busy}
        >
          {saved ? <Favorite /> : <FavoriteBorder />}
        </IconButton>
      </Box>
      <CardContent className="card-body">
        <Stack direction="row" spacing={1} className="card-meta">
          <Typography variant="caption">{car.year}</Typography>
          <span className="meta-separator" />
          <Typography variant="caption">
            {regionName(car.region, language)}
          </Typography>
        </Stack>
        <button className="car-title" onClick={openCar}>
          {car.make} {car.model}
          <ArrowUpward fontSize="small" />
        </button>
        <Stack direction="row" spacing={2} className="car-specs">
          <Typography variant="caption">
            <Speed fontSize="small" />
            {money(car.mileage, language)} km
          </Typography>
          <Typography variant="caption">
            <LocalGasStation fontSize="small" />
            {fuelLabels[language][car.fuel as keyof typeof fuelLabels.uz] ??
              car.fuel}
          </Typography>
        </Stack>
        <Box className="card-footer">
          <Typography variant="h3">
            {money(car.price, language)}{" "}
            <Typography component="span" variant="caption">
              {t("currency")}
            </Typography>
          </Typography>
          <IconButton onClick={openCar} aria-label={t("details")}>
            <ArrowUpward />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
}
