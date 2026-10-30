import { ArrowUpward, Favorite, FavoriteBorder, LocalGasStation, Speed } from '@mui/icons-material';
import { Box, Card, CardContent, CardMedia, Chip, IconButton, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import type { Car } from '../../types';
import { carPhoto, money, regionName } from '../../types';

type Props = { car: Car; index: number; onOpen: (car: Car) => void };

export default function CarCard({ car, index, onOpen }: Props) {
  const [saved, setSaved] = useState(false);
  const openCar = () => onOpen(car);
  return <Card className="car-card" style={{ animationDelay: `${index * 55}ms` }}>
    <Box className="card-image" role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') openCar(); }} onClick={openCar} aria-label={`${car.title} tafsilotlari`}>
      <CardMedia component="img" image={carPhoto(car)} alt={car.title} loading="lazy" />
      <Chip className="image-label" size="small" label={index === 0 ? 'YANGI' : 'TEKSHIRILGAN'} />
      <IconButton className={saved ? 'favorite saved' : 'favorite'} onClick={(event) => { event.stopPropagation(); setSaved(!saved); }} aria-label="Sevimlilarga saqlash">{saved ? <Favorite /> : <FavoriteBorder />}</IconButton>
    </Box>
    <CardContent className="card-body">
      <Stack direction="row" spacing={1} className="card-meta"><Typography variant="caption">{car.year}</Typography><span className="meta-separator" /><Typography variant="caption">{regionName(car.region)}</Typography></Stack>
      <button className="car-title" onClick={openCar}>{car.make} {car.model}<ArrowUpward fontSize="small" /></button>
      <Stack direction="row" spacing={2} className="car-specs"><Typography variant="caption"><Speed fontSize="small" />{money(car.mileage)} km</Typography><Typography variant="caption"><LocalGasStation fontSize="small" />{car.fuel === 'PETROL' ? 'Benzin' : car.fuel === 'ELECTRIC' ? 'Elektro' : car.fuel === 'HYBRID' ? 'Gibrid' : car.fuel}</Typography></Stack>
      <Box className="card-footer"><Typography variant="h3">{money(car.price)} <Typography component="span" variant="caption">so‘m</Typography></Typography><IconButton onClick={openCar} aria-label="Batafsil"><ArrowUpward /></IconButton></Box>
    </CardContent>
  </Card>;
}
