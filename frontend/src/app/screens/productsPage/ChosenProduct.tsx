import { useEffect, useState } from 'react';
import { Alert, Box, Button, Card, CardContent, CardMedia, Chip, CircularProgress, Container, Divider, Stack, Typography } from '@mui/material';
import { ArrowBack, Call, DirectionsCar, LocalGasStation, Speed } from '@mui/icons-material';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../../../lib/api';
import type { Car } from '../../../types';
import { carPhoto, money, regionName } from '../../../types';

export default function ChosenProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    let active = true;
    setLoading(true);
    api<Car>(`/api/cars/${id}`).then((result) => { if (active) setCar(result); })
      .catch((cause: unknown) => { if (active) setError(cause instanceof Error ? cause.message : 'E’lonni yuklab bo‘lmadi.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  if (loading) return <Box className="page-loading"><CircularProgress /></Box>;
  if (error || !car) return <Container maxWidth="md" sx={{ py: 8 }}><Alert severity="error" action={<Button component={Link} to="/cars">Katalogga qaytish</Button>}>{error || 'E’lon topilmadi.'}</Alert></Container>;
  return <Container maxWidth="lg" sx={{ py: { xs: 4, md: 7 } }}>
    <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>Orqaga</Button>
    <Card className="detail-page-card"><CardMedia component="img" image={carPhoto(car)} alt={car.title} className="detail-page-image" />
      <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
        <Stack direction="row" spacing={1} sx={{ mb: 1 }}><Chip size="small" color="success" label="Tekshirilgan e’lon" /><Chip size="small" variant="outlined" label={regionName(car.region)} /></Stack>
        <Typography variant="overline" color="text.secondary">{car.year} · {car.make}</Typography><Typography variant="h1" sx={{ fontSize: { xs: 30, md: 42 }, mb: 2 }}>{car.title}</Typography>
        <Typography variant="h2" color="primary.main" sx={{ fontSize: 30, mb: 3 }}>{money(car.price)} <Typography component="span" color="text.secondary" fontSize={14}>so‘m</Typography></Typography>
        <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap sx={{ mb: 3 }}>
          <Stack direction="row" spacing={1} alignItems="center"><Speed color="action" /><Typography>{money(car.mileage)} km</Typography></Stack>
          <Stack direction="row" spacing={1} alignItems="center"><LocalGasStation color="action" /><Typography>{car.fuel}</Typography></Stack>
          <Stack direction="row" spacing={1} alignItems="center"><DirectionsCar color="action" /><Typography>{car.transmission}</Typography></Stack>
        </Stack>
        <Divider sx={{ mb: 2 }} /><Typography variant="h3" fontSize={18} mb={1}>Tavsif</Typography><Typography color="text.secondary" sx={{ lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{car.description || 'Sotuvchi qo‘shimcha tavsif kiritmagan.'}</Typography>
        <Card variant="outlined" sx={{ mt: 4, p: 2, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}><Box className="avatar">{car.sellerId?.name?.slice(0, 1) ?? 'S'}</Box><Box sx={{ flex: 1 }}><Typography variant="caption" color="text.secondary" display="block">SOTUVCHI</Typography><Typography fontWeight={700}>{car.sellerId?.name ?? 'Avto.uz foydalanuvchisi'}</Typography></Box>{car.sellerId?.phone && <Button variant="contained" startIcon={<Call />} href={`tel:${car.sellerId.phone}`}>Qo‘ng‘iroq qilish</Button>}</Card>
      </CardContent>
    </Card>
  </Container>;
}
