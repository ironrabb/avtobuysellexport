import { useEffect, useState } from 'react';
import { Alert, Avatar, Box, Card, CardContent, Chip, CircularProgress, Container, Stack, Typography } from '@mui/material';
import { AccountCircle, Email, Phone } from '@mui/icons-material';
import { api } from '../../../lib/api';
import { useSession } from '../../context/SessionContext';

type Profile = { name: string; email: string; phone: string; type: 'BUYER' | 'SELLER' | 'ADMIN'; status: string; createdAt?: string };

export default function UserPage() {
  const { member } = useSession();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    api<Profile>('/api/members/me').then((result) => { if (active) setProfile(result); })
      .catch((cause: unknown) => { if (active) setError(cause instanceof Error ? cause.message : 'Profilni yuklab bo‘lmadi.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  return <Container maxWidth="md" sx={{ py: { xs: 5, md: 8 } }}>
    <Typography variant="overline" color="secondary.main">SHAXSIY KABINET</Typography><Typography variant="h1" sx={{ fontSize: { xs: 34, md: 44 }, mb: 3 }}>Profilim</Typography>
    {loading && <Box className="page-loading"><CircularProgress /></Box>}{error && <Alert severity="error">{error}</Alert>}
    {profile && <Card><CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
      <Stack direction="row" spacing={2} alignItems="center" mb={4}><Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main', fontSize: 26 }}>{profile.name.slice(0, 1).toUpperCase()}</Avatar><Box><Typography variant="h2" fontSize={25}>{profile.name}</Typography><Chip size="small" color={profile.type === 'SELLER' ? 'secondary' : 'default'} label={profile.type === 'SELLER' ? 'Sotuvchi' : profile.type === 'ADMIN' ? 'Admin' : 'Xaridor'} /></Box></Stack>
      <Stack spacing={2.5}><Stack direction="row" spacing={1.5} alignItems="center"><Email color="action" /><Typography>{profile.email}</Typography></Stack><Stack direction="row" spacing={1.5} alignItems="center"><Phone color="action" /><Typography>{profile.phone}</Typography></Stack><Stack direction="row" spacing={1.5} alignItems="center"><AccountCircle color="action" /><Typography>Hisob holati: {profile.status === 'ACTIVE' ? 'Faol' : profile.status}</Typography></Stack></Stack>
    </CardContent></Card>}
    {!member && !loading && <Alert severity="info">Profilni ko‘rish uchun tizimga kiring.</Alert>}
  </Container>;
}
