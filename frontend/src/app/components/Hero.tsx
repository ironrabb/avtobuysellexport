import { ArrowDownward } from '@mui/icons-material';
import { Box, Link, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function Hero() {
  return <Box component="section" className="hero">
    <Box className="hero-copy">
      <Typography className="eyebrow" variant="overline"><span className="eyebrow-line" /> YANGI AVLOD AVTO BOZORI</Typography>
      <Typography component="h1" variant="h1">Keyingi manzilingiz<br />shu yerdan <em>boshlanadi.</em></Typography>
      <Typography component="p">O‘zingizga mos avtomobilni toping. Ishonchli e’lonlar, to‘g‘ridan-to‘g‘ri sotuvchilar va ortiqcha shovqinsiz tanlov.</Typography>
      <Link className="hero-link" component={RouterLink} to="/cars">Avtomobillarni ko‘rish <ArrowDownward fontSize="small" /></Link>
    </Box>
    <Box className="hero-visual">
      <img src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=90" alt="Tog‘ yo‘lida turgan zamonaviy avtomobil" />
      <div className="hero-image-shade" />
      <div className="hero-image-caption"><span>01 / 03</span><span>Har bir yo‘l — yangi imkoniyat</span></div>
      <div className="hero-sticker"><span className="sticker-spark">✳</span><span>Tanlovingiz.<br />Sizning yo‘lingiz.</span></div>
    </Box>
    <div className="hero-index">01 <span /> 03</div>
  </Box>;
}
