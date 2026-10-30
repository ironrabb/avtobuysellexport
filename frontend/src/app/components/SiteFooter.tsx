import { Box, Container, Link, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function SiteFooter() {
  return <Box component="footer" className="footer"><Container maxWidth="lg" className="footer-inner">
    <Link component={RouterLink} to="/" underline="none" className="wordmark">avto<span>.</span>uz</Link>
    <Typography variant="body2" color="text.secondary">O‘z yo‘lingizni toping.</Typography>
    <Stack direction="row" spacing={2}><Link component={RouterLink} to="/cars" color="text.secondary" underline="hover">Avtomobillar</Link><Link component={RouterLink} to="/help" color="text.secondary" underline="hover">Yordam</Link><Typography variant="caption" color="text.secondary">© 2026 Avto.uz</Typography></Stack>
  </Container></Box>;
}
