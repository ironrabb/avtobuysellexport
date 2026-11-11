import { Box, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CatalogSection from "../../components/CatalogSection";
import { useCars } from "../../hooks/useCars";
import { useLocale } from "../../context/LocaleContext";

export default function ProductsPage() {
  const carsState = useCars();
  const navigate = useNavigate();
  const { t } = useLocale();

  return (
    <Container
      maxWidth="lg"
      className="catalog-page page-frame"
      sx={{ py: { xs: 5, md: 8 } }}
    >
      <Box className="page-intro catalog-page-intro" sx={{ mb: 4 }}>
        <Typography variant="overline" color="secondary.main">
          {t("allListings")}
        </Typography>
        <Typography variant="h1" sx={{ fontSize: { xs: 38, md: 54 }, mb: 1 }}>
          {t("carsCatalog")}
        </Typography>
        <Typography color="text.secondary">{t("catalogIntro")}</Typography>
      </Box>
      <CatalogSection
        cars={carsState.cars}
        total={carsState.total}
        page={carsState.page}
        totalPages={carsState.totalPages}
        loading={carsState.loading}
        error={carsState.error}
        sort={carsState.sort}
        onSortChange={carsState.setSort}
        onPageChange={carsState.setPage}
        onRetry={() => void carsState.loadCars(carsState.page)}
        onOpenCar={(car) => navigate(`/cars/${car._id}`)}
      />
    </Container>
  );
}
