import { Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useCars } from "../../hooks/useCars";
import Hero from "../../components/Hero";
import CatalogSection from "../../components/CatalogSection";
import SellBanner from "../../components/SellBanner";
import TrustSection from "../../components/TrustSection";

export default function HomePage() {
  const carsState = useCars();
  const navigate = useNavigate();

  return (
    <>
      <Hero />
      <Container maxWidth="lg" disableGutters>
        <CatalogSection
          cars={carsState.cars}
          total={carsState.total}
          page={carsState.page}
          totalPages={carsState.totalPages}
          pageSize={carsState.pageSize}
          loading={carsState.loading}
          error={carsState.error}
          sort={carsState.sort}
          onSortChange={carsState.setSort}
          onPageChange={carsState.setPage}
          onRetry={() => void carsState.loadCars(carsState.page)}
          onOpenCar={(car) => navigate(`/cars/${car._id}`)}
        />
      </Container>
      <SellBanner onSell={() => navigate("/sell")} />
      <TrustSection />
    </>
  );
}
