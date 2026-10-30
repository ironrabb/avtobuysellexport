import { useState, type FormEvent } from 'react';
import { Alert, Box, Button, Container, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { fuels, makes } from '../../../constants';
import { api } from '../../../lib/api';
import { regions } from '../../../types';
import { useSession } from '../../context/SessionContext';

export default function SellPage() {
  const { member } = useSession();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setError(''); setSuccess('');
    if (!member) { navigate('/login', { state: { message: 'E’lon berish uchun avval tizimga kiring.' } }); return; }
    if (member.type !== 'SELLER' && member.type !== 'ADMIN') { setError('E’lon joylash uchun sotuvchi hisobi kerak. Hisob turini o‘zgartirish uchun yangi sotuvchi hisobini yarating.'); return; }
    setBusy(true);
    const form = event.currentTarget;
    const data = new FormData(form);
    const body = new FormData();
    for (const field of ['title', 'make', 'model', 'year', 'price', 'mileage', 'transmission', 'fuel', 'region', 'description']) body.append(field, String(data.get(field) ?? ''));
    for (const file of data.getAll('images')) if (file instanceof File && file.size) body.append('images', file);
    try { await api('/api/cars', { method: 'POST', body }); setSuccess('E’lon tekshiruvga yuborildi. Admin tasdiqlagach katalogda ko‘rinadi.'); form.reset(); }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'E’lon yuborilmadi.'); }
    finally { setBusy(false); }
  };

  return <Container maxWidth="md" sx={{ py: { xs: 5, md: 8 } }}>
    <Typography variant="overline" color="secondary.main">SOTUVCHILAR UCHUN</Typography><Typography variant="h1" sx={{ fontSize: { xs: 34, md: 44 }, mb: 1 }}>Avtomobil e’loni</Typography>
    <Typography color="text.secondary" mb={4}>To‘liq va aniq ma’lumot xaridorga to‘g‘ri tanlov qilishga yordam beradi.</Typography>
    {!member && <Alert severity="info" sx={{ mb: 2 }}>E’lon berish uchun <Button size="small" onClick={() => navigate('/login')}>hisobingizga kiring</Button>.</Alert>}
    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}{success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
    <Paper component="form" onSubmit={(event) => void submit(event)} sx={{ p: { xs: 2, sm: 4 } }}>
      <Stack spacing={2.5}>
        <Typography variant="h3" fontSize={19}>Asosiy ma’lumotlar</Typography>
        <TextField name="title" label="E’lon sarlavhasi" placeholder="Chevrolet Cobalt 2022" inputProps={{ maxLength: 160 }} required fullWidth />
        <Box className="form-grid-two"><TextField name="make" label="Marka" select required defaultValue=""><MenuItem value="" disabled>Tanlang</MenuItem>{makes.map((name) => <MenuItem key={name} value={name}>{name}</MenuItem>)}</TextField><TextField name="model" label="Model" placeholder="Cobalt" required /></Box>
        <Box className="form-grid-two"><TextField name="year" label="Ishlab chiqarilgan yil" type="number" defaultValue={2022} inputProps={{ min: 1900, max: new Date().getFullYear() + 1 }} required /><TextField name="price" label="Narxi (so‘m)" type="number" inputProps={{ min: 0 }} required /></Box>
        <Box className="form-grid-two"><TextField name="mileage" label="Yurgani (km)" type="number" inputProps={{ min: 0 }} required /><TextField name="region" label="Hudud" select required defaultValue=""><MenuItem value="" disabled>Tanlang</MenuItem>{regions.map(([key, name]) => <MenuItem key={key} value={key}>{name}</MenuItem>)}</TextField></Box>
        <Box className="form-grid-two"><TextField name="transmission" label="Uzatma qutisi" select defaultValue="MANUAL"><MenuItem value="MANUAL">Mexanika</MenuItem><MenuItem value="AUTOMATIC">Avtomat</MenuItem><MenuItem value="ROBOT">Robot</MenuItem><MenuItem value="CVT">Variator</MenuItem></TextField><TextField name="fuel" label="Yoqilg‘i turi" select defaultValue="PETROL">{fuels.map(([key, label]) => <MenuItem key={key} value={key}>{label}</MenuItem>)}</TextField></Box>
        <TextField name="description" label="Batafsil tavsif" multiline minRows={4} inputProps={{ maxLength: 5000 }} placeholder="Avtomobil holati, komplektatsiyasi va boshqa ma’lumotlar" />
        <Button component="label" variant="outlined" color="inherit" startIcon={<CloudUpload />} sx={{ alignSelf: 'flex-start' }}>Rasmlarni tanlash<input name="images" type="file" hidden multiple accept="image/jpeg,image/png,image/webp" /></Button>
        <Typography variant="caption" color="text.secondary">JPEG, PNG yoki WebP. Har biri 5 MB gacha, ko‘pi bilan 10 ta rasm.</Typography>
        <Button type="submit" variant="contained" size="large" disabled={busy}>{busy ? 'Yuborilmoqda…' : 'E’lonni yuborish'}</Button>
      </Stack>
    </Paper>
  </Container>;
}
