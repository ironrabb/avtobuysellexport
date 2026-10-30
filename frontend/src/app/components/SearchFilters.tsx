import { Box, Button, InputAdornment, MenuItem, Paper, TextField, Typography } from '@mui/material';
import { Search } from '@mui/icons-material';
import { fuels, makes } from '../../constants';
import { regions } from '../../types';

type Props = {
  query: string; make: string; region: string; fuel: string;
  onQueryChange: (value: string) => void; onMakeChange: (value: string) => void;
  onRegionChange: (value: string) => void; onFuelChange: (value: string) => void;
};

export default function SearchFilters(props: Props) {
  const { query, make, region, fuel, onQueryChange, onMakeChange, onRegionChange, onFuelChange } = props;
  const scrollToCatalog = () => document.querySelector('#catalog')?.scrollIntoView({ behavior: 'smooth' });
  return <Paper component="section" elevation={0} className="search-section" aria-label="Avtomobil qidirish">
    <Typography className="search-label" variant="overline"><Search fontSize="small" /> O‘zingizga mosini toping</Typography>
    <Box component="form" className="search-bar" onSubmit={(event) => { event.preventDefault(); scrollToCatalog(); }}>
      <TextField className="search-control query-control" size="small" label="Qidiruv" value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Marka yoki modelni yozing" InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment> }} />
      <TextField className="search-control" size="small" label="Marka" select value={make} onChange={(event) => onMakeChange(event.target.value)}><MenuItem value="">Barcha markalar</MenuItem>{makes.map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}</TextField>
      <TextField className="search-control" size="small" label="Hudud" select value={region} onChange={(event) => onRegionChange(event.target.value)}><MenuItem value="">Barcha hududlar</MenuItem>{regions.map(([key, name]) => <MenuItem key={key} value={key}>{name}</MenuItem>)}</TextField>
      <TextField className="search-control" size="small" label="Yoqilg‘i" select value={fuel} onChange={(event) => onFuelChange(event.target.value)}><MenuItem value="">Barchasi</MenuItem>{fuels.map(([key, name]) => <MenuItem key={key} value={key}>{name}</MenuItem>)}</TextField>
      <Button className="search-submit" type="submit" variant="contained" color="secondary" startIcon={<Search />}>Qidirish</Button>
    </Box>
    <Box className="popular-searches"><Typography variant="caption">Ommabop:</Typography>{['Chevrolet Cobalt', 'BYD Song Plus', 'Kia K5', 'Hyundai Tucson'].map((item) => <Button size="small" key={item} onClick={() => { onQueryChange(item); scrollToCatalog(); }}>{item}</Button>)}</Box>
  </Paper>;
}
