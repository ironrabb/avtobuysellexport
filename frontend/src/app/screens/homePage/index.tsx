import { Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useCars } from '../../hooks/useCars';
import Hero from '../../components/Hero';
import SearchFilters from '../../components/SearchFilters';
import CatalogSection from '../../components/CatalogSection';
import SellBanner from '../../components/SellBanner';
import TrustSection from '../../components/TrustSection';

export default function HomePage() {
  const carsState = useCars();
  const navigate = useNavigate();
  return <>
    <Hero />
    <SearchFilters query={carsState.query} make={carsState.make} region={carsState.region} fuel={carsState.fuel}
      onQueryChange={carsState.setQuery} onMakeChange={carsState.setMake} onRegionChange={carsState.setRegion} onFuelChange={carsState.setFuel} />
    <Container maxWidth="lg" disableGutters>
      <CatalogSection cars={carsState.cars} total={carsState.total} loading={carsState.loading} error={carsState.error} hasMore={carsState.cars.length < carsState.total}
        sort={carsState.sort} onSortChange={carsState.setSort} onLoadMore={() => void carsState.loadCars(carsState.page + 1, true)} onRetry={() => void carsState.loadCars()}
        onResetFilters={carsState.resetFilters} onOpenCar={(car) => navigate(`/cars/${car._id}`)} />
    </Container>
    <SellBanner onSell={() => navigate('/sell')} />
    <TrustSection />
  </>;
}
