import { useState } from 'react';
import { AppBar, Avatar, Box, Button, Drawer, IconButton, Stack, Toolbar, Typography } from '@mui/material';
import { Add, Close, Menu } from '@mui/icons-material';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSession } from '../context/SessionContext';

export default function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { member, signOut } = useSession();
  const navigate = useNavigate();
  const closeMenu = () => setMobileOpen(false);
  const navItems = <>
    <Button component={NavLink} to="/" onClick={closeMenu}>Bosh sahifa</Button>
    <Button component={NavLink} to="/cars" onClick={closeMenu}>Avtomobillar</Button>
    <Button component={NavLink} to="/help" onClick={closeMenu}>Yordam</Button>
  </>;
  return <AppBar position="sticky" color="transparent" elevation={0} className="site-header">
    <Toolbar className="site-toolbar" disableGutters>
      <Typography component={NavLink} to="/" className="wordmark" aria-label="Avto.uz bosh sahifa">avto<span>.</span>uz</Typography>
      <Box className="desktop-navigation"><Stack direction="row" spacing={1} className="main-nav">{navItems}</Stack></Box>
      <Stack className="header-actions" direction="row" alignItems="center" spacing={1.5}>
        {member ? <>
          <Button component={NavLink} to="/account" startIcon={<Avatar className="header-avatar">{member.name.slice(0, 1).toUpperCase()}</Avatar>} className="account-link">{member.name}</Button>
          <Button color="inherit" onClick={() => void signOut()}>Chiqish</Button>
        </> : <Button color="inherit" component={NavLink} to="/login">Kirish</Button>}
        <Button variant="contained" color="primary" startIcon={<Add />} onClick={() => navigate('/sell')}>E’lon berish</Button>
        <IconButton className="mobile-menu" aria-label="Menyuni ochish" onClick={() => setMobileOpen(!mobileOpen)}>{mobileOpen ? <Close /> : <Menu />}</IconButton>
      </Stack>
    </Toolbar>
    <Drawer anchor="right" open={mobileOpen} onClose={closeMenu}><Stack className="mobile-drawer-nav" sx={{ width: 260, p: 3 }} spacing={1}>{navItems}</Stack></Drawer>
  </AppBar>;
}
