import { ArrowDownward, ArrowForward, Search, Tune } from '@mui/icons-material';
import { Alert, Box, Button, FormControl, MenuItem, Paper, Select, Skeleton, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import type { Car } from '../../types';
import CarCard from './CarCard';

type Props = {
  cars: Car[]; total: number; loading: boolean; error: string; hasMore: boolean;
  sort: string; onSortChange: (value: string) => void; onLoadMore: () => void;
  onRetry: () => void; onResetFilters: () => void; onOpenCar: (car: Car) => void;
};

export default function CatalogSection(props: Props) {
  const { cars, total, loading, error, hasMore, sort, onSortChange, onLoadMore, onRetry, onResetFilters, onOpenCar } = props;
  return <Box component="section" className="catalog section-wrap" id="catalog">
    <Box className="section-heading"><Box><Typography className="eyebrow" variant="overline"><span className="eyebrow-line" /> SIZ UCHUN TANLOV</Typography><Typography variant="h2">Yangi e’lonlar<span className="orange-dot">.</span></Typography><Typography className="section-subtitle">Bugun joylangan, ko‘rishga arziydigan avtomobillar.</Typography></Box><Button component={Link} to="/cars" endIcon={<ArrowForward />} className="all-link">Barcha e’lonlar</Button></Box>
    <Paper className="catalog-toolbar" elevation={0}><Box className="result-count"><span className="live-dot" /> <strong>{total.toLocaleString('uz-UZ')}</strong> ta avtomobil topildi</Box><Stack className="toolbar-right" direction="row" alignItems="center" spacing={2}><Button className="filter-button" startIcon={<Tune />} onClick={() => document.querySelector('.search-section')?.scrollIntoView({ behavior: 'smooth' })}>Filtrlar</Button><Stack direction="row" alignItems="center" spacing={.5} className="sort-control"><Typography variant="caption">Tartiblash:</Typography><FormControl size="small" variant="standard"><Select value={sort} onChange={(event) => onSortChange(event.target.value)} disableUnderline><MenuItem value="newest">Eng yangilari</MenuItem><MenuItem value="cheap">Avval arzonlari</MenuItem><MenuItem value="expensive">Avval qimmatlari</MenuItem></Select></FormControl></Stack></Stack></Paper>
    {error && <Alert severity="error" sx={{ mt: 2 }} action={<Button color="inherit" size="small" onClick={onRetry}>Qayta urinish</Button>}>{error}</Alert>}
    {loading && cars.length === 0 && <Box className="loading-grid">{Array.from({ length: 4 }, (_, index) => <Paper className="skeleton-card" key={index} elevation={0}><Skeleton variant="rectangular" height={181} /><Skeleton width="60%" sx={{ m: 1.5 }} /><Skeleton width="40%" sx={{ mx: 1.5 }} /></Paper>)}</Box>}
    {!loading && !error && cars.length === 0 && <Stack className="state-message empty-state" alignItems="center"><Search /><Typography variant="h3" fontSize={18}>Mos avtomobil topilmadi</Typography><Typography color="text.secondary">Filtrlarni o‘zgartiring yoki keyinroq yana ko‘ring.</Typography><Button onClick={onResetFilters} startIcon={<Tune />}>Filtrlarni tozalash</Button></Stack>}
    {cars.length > 0 && <Box className="car-grid">{cars.map((car, index) => <CarCard key={car._id} car={car} index={index} onOpen={onOpenCar} />)}</Box>}
    {hasMore && <Stack className="load-more-wrap" alignItems="center"><Button variant="outlined" className="load-more" disabled={loading} onClick={onLoadMore} endIcon={<ArrowDownward />}>{loading ? 'Yuklanmoqda…' : 'Yana avtomobillarni ko‘rish'}</Button><Typography variant="caption" color="text.secondary">{cars.length} / {total} ko‘rsatildi</Typography></Stack>}
  </Box>;
}
