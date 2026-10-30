import { Box, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchFilters from '../../components/SearchFilters';
import CatalogSection from '../../components/CatalogSection';
import { useCars } from '../../hooks/useCars';

export default function ProductsPage() {
  const carsState = useCars();
  const navigate = useNavigate();
  return <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
    <Box sx={{ mb: 4 }}><Typography variant="overline" color="secondary.main">BARCHA E’LONLAR</Typography><Typography variant="h1" sx={{ fontSize: { xs: 34, md: 46 }, mb: 1 }}>Avtomobillar katalogi</Typography><Typography color="text.secondary">Qidiruv va filtrlar yordamida mos avtomobilni toping.</Typography></Box>
    <SearchFilters query={carsState.query} make={carsState.make} region={carsState.region} fuel={carsState.fuel}
      onQueryChange={carsState.setQuery} onMakeChange={carsState.setMake} onRegionChange={carsState.setRegion} onFuelChange={carsState.setFuel} />
    <CatalogSection cars={carsState.cars} total={carsState.total} loading={carsState.loading} error={carsState.error} hasMore={carsState.cars.length < carsState.total}
      sort={carsState.sort} onSortChange={carsState.setSort} onLoadMore={() => void carsState.loadCars(carsState.page + 1, true)} onRetry={() => void carsState.loadCars()}
      onResetFilters={carsState.resetFilters} onOpenCar={(car) => navigate(`/cars/${car._id}`)} />
  </Container>;
}
