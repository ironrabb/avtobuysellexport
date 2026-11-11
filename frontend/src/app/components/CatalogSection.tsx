import { ArrowForward, Search } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  FormControl,
  MenuItem,
  Pagination,
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
  page: number;
  totalPages: number;
  pageSize?: number;
  loading: boolean;
  error: string;
  sort: string;
  onSortChange: (value: string) => void;
  onPageChange: (page: number) => void;
  onRetry: () => void;
  onOpenCar: (car: Car) => void;
};

export default function CatalogSection(props: Props) {
  const {
    cars,
    total,
    page,
    totalPages,
    pageSize = 9,
    loading,
    error,
    sort,
    onSortChange,
    onPageChange,
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
          {Array.from({ length: 6 }, (_, index) => (
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

      {totalPages > 1 && (
        <Stack
          direction="column"
          alignItems="center"
          spacing={1.5}
          sx={{ mt: 5, mb: 2 }}
        >
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, newPage) => {
              onPageChange(newPage);
              const element = document.getElementById("catalog");
              if (element) {
                element.scrollIntoView({ behavior: "smooth" });
              }
            }}
            color="primary"
            size="large"
            shape="rounded"
            disabled={loading}
          />
          <Typography variant="caption" color="text.secondary">
            {total} {t("found")} · {page} / {totalPages}
          </Typography>
        </Stack>
      )}
    </Box>
  );
}
