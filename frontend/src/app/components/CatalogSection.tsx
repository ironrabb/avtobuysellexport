import { ArrowDownward, ArrowForward, Search } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  FormControl,
  MenuItem,
  Paper,
  Select,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import type { Car } from "../../types";
import { useLocale } from "../context/LocaleContext";
import CarCard from "./CarCard";

type Props = {
  cars: Car[];
  total: number;
  loading: boolean;
  error: string;
  hasMore: boolean;
  sort: string;
  onSortChange: (value: string) => void;
  onLoadMore: () => void;
  onRetry: () => void;
  onOpenCar: (car: Car) => void;
};

export default function CatalogSection(props: Props) {
  const {
    cars,
    total,
    loading,
    error,
    hasMore,
    sort,
    onSortChange,
    onLoadMore,
    onRetry,
    onOpenCar,
  } = props;
  const { t } = useLocale();
  return (
    <Box component="section" className="catalog section-wrap" id="catalog">
      <Box className="section-heading">
        <Box>
          <Typography className="eyebrow" variant="overline">
            <span className="eyebrow-line" /> {t("choose")}
          </Typography>
          <Typography variant="h2">
            {t("newListings")}
            <span className="orange-dot">.</span>
          </Typography>
          <Typography className="section-subtitle">
            {t("catalogSubtitle")}
          </Typography>
        </Box>
        <Button
          component={Link}
          to="/cars"
          endIcon={<ArrowForward />}
          className="all-link"
        >
          {t("allListings")}
        </Button>
      </Box>
      <Paper className="catalog-toolbar" elevation={0}>
        <Box className="result-count">
          <span className="live-dot" />{" "}
          <strong>{total.toLocaleString()}</strong> {t("found")}
        </Box>
        <Stack
          className="toolbar-right"
          direction="row"
          alignItems="center"
          spacing={2}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={0.5}
            className="sort-control"
          >
            <Typography variant="caption">{t("sort")}</Typography>
            <FormControl size="small" variant="standard">
              <Select
                value={sort}
                onChange={(event) => onSortChange(event.target.value)}
                disableUnderline
              >
                <MenuItem value="newest">{t("newest")}</MenuItem>
                <MenuItem value="cheap">{t("cheap")}</MenuItem>
                <MenuItem value="expensive">{t("expensive")}</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Stack>
      </Paper>
      {error && (
        <Alert
          severity="error"
          sx={{ mt: 2 }}
          action={
            <Button color="inherit" size="small" onClick={onRetry}>
              {t("retry")}
            </Button>
          }
        >
          {error}
        </Alert>
      )}
      {loading && cars.length === 0 && (
        <Box className="loading-grid">
          {Array.from({ length: 4 }, (_, index) => (
            <Paper className="skeleton-card" key={index} elevation={0}>
              <Skeleton variant="rectangular" height={181} />
              <Skeleton width="60%" sx={{ m: 1.5 }} />
              <Skeleton width="40%" sx={{ mx: 1.5 }} />
            </Paper>
          ))}
        </Box>
      )}
      {!loading && !error && cars.length === 0 && (
        <Stack className="state-message empty-state" alignItems="center">
          <Search />
          <Typography variant="h3" fontSize={18}>
            {t("emptyCars")}
          </Typography>
          <Typography color="text.secondary">{t("emptyCarsBody")}</Typography>
        </Stack>
      )}
      {cars.length > 0 && (
        <Box className="car-grid">
          {cars.map((car, index) => (
            <CarCard key={car._id} car={car} index={index} onOpen={onOpenCar} />
          ))}
        </Box>
      )}
      {hasMore && (
        <Stack className="load-more-wrap" alignItems="center">
          <Button
            variant="outlined"
            className="load-more"
            disabled={loading}
            onClick={onLoadMore}
            endIcon={<ArrowDownward />}
          >
            {loading ? t("loading") : t("loadMore")}
          </Button>
          <Typography variant="caption" color="text.secondary">
            {cars.length} / {total} {t("shown")}
          </Typography>
        </Stack>
      )}
    </Box>
  );
}
