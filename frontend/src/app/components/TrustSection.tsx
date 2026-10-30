import { ArrowOutward } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';

const benefits = [
  ['01', 'Tekshirilgan e’lonlar', 'Har bir e’lon platformaga chiqishidan oldin moderatsiyadan o‘tadi.'],
  ['02', 'Bevosita muloqot', 'Sotuvchi bilan to‘g‘ridan-to‘g‘ri bog‘laning — qaror o‘zingizniki.'],
  ['03', 'Oson qidiruv', 'Marka, hudud va yoqilg‘i turi bo‘yicha saralab, tezroq tanlang.']
];

export default function TrustSection() {
  return <Box component="section" className="trust-section section-wrap" id="about">
    <Box className="trust-intro"><Typography className="eyebrow" variant="overline"><span className="eyebrow-line" /> AVTO.UZ AFZALLIKLARI</Typography><Typography component="h2" variant="h2">Tanlash oson.<br /><em>Ko‘ngil xotirjam.</em></Typography><Typography component="p">Avtomobil topish jarayonini shaffof, sodda va insonlarga yaqin qilish uchun yaratildik.</Typography></Box>
    <Box className="trust-points">{benefits.map(([number, title, description]) => <Box key={number}><span className="trust-number">{number}</span><Box><Typography component="h3" variant="h3">{title}</Typography><Typography component="p">{description}</Typography></Box><ArrowOutward fontSize="small" /></Box>)}</Box>
  </Box>;
}
