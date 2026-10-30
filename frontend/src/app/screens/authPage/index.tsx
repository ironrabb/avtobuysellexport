import { useState, type FormEvent } from 'react';
import { Alert, Box, Button, Card, CardContent, FormControl, FormControlLabel, Radio, RadioGroup, Stack, TextField, Typography } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSession } from '../../context/SessionContext';

export default function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { signIn, signUp } = useSession();
  const registering = location.pathname === '/register';
  const navigationState = location.state as { message?: string } | null;
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setError(''); setBusy(true);
    const data = new FormData(event.currentTarget);
    try {
      if (registering) {
        await signUp({ name: String(data.get('name')), email: String(data.get('email')), phone: String(data.get('phone')), password: String(data.get('password')), type: data.get('type') === 'SELLER' ? 'SELLER' : 'BUYER' });
        navigate('/login', { state: { message: 'Hisob yaratildi. Endi tizimga kiring.' } });
      } else {
        await signIn({ email: String(data.get('email')), password: String(data.get('password')) });
        navigate('/account');
      }
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'So‘rov bajarilmadi.'); }
    finally { setBusy(false); }
  };

  return <Box className="auth-page-wrap"><Card className="auth-page-card"><CardContent sx={{ p: { xs: 3, sm: 5 } }}>
    <Typography variant="overline" color="secondary.main">AVTO.UZ HISOBI</Typography>
    <Typography variant="h1" sx={{ fontSize: 32, mt: 1, mb: 1 }}>{registering ? 'Yangi hisob oching.' : 'Xush kelibsiz.'}</Typography>
    <Typography color="text.secondary" mb={3}>{registering ? 'Avtomobil qidirish yoki sotish uchun ro‘yxatdan o‘ting.' : 'Hisobingizga kirib, e’lonlaringizni boshqaring.'}</Typography>
    {navigationState?.message && <Alert severity="success" sx={{ mb: 2 }}>{navigationState.message}</Alert>}
    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
    <Box component="form" onSubmit={(event) => void submit(event)}><Stack spacing={2}>
      {registering && <><TextField name="name" label="Ism familiya" autoComplete="name" required /><TextField name="phone" label="Telefon raqam" autoComplete="tel" placeholder="+998 90 123 45 67" required />
        <FormControl><Typography variant="caption" color="text.secondary" mb={0.5}>Hisob turi</Typography><RadioGroup row name="type" defaultValue="BUYER"><FormControlLabel value="BUYER" control={<Radio size="small" />} label="Xaridor" /><FormControlLabel value="SELLER" control={<Radio size="small" />} label="Sotuvchi" /></RadioGroup></FormControl></>}
      <TextField name="email" type="email" label="Email" autoComplete="email" required /><TextField name="password" type="password" label="Parol" autoComplete={registering ? 'new-password' : 'current-password'} inputProps={{ minLength: 8 }} required />
      <Button type="submit" variant="contained" size="large" endIcon={<ArrowForward />} disabled={busy}>{busy ? 'Kutilmoqda…' : registering ? 'Hisob yaratish' : 'Kirish'}</Button>
    </Stack></Box>
    <Typography textAlign="center" variant="body2" color="text.secondary" mt={3}>{registering ? 'Hisobingiz bormi?' : 'Hisobingiz yo‘qmi?'} <Link className="inline-link" to={registering ? '/login' : '/register'}>{registering ? 'Kirish' : 'Ro‘yxatdan o‘tish'}</Link></Typography>
  </CardContent></Card></Box>;
}
