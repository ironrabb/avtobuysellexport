import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Container, Link, Stack, Typography } from '@mui/material';
import { ExpandMore, HelpOutline, MailOutline, PhoneInTalk } from '@mui/icons-material';

const questions = [
  ['Avtomobil e’lonini qanday joylayman?', 'Sotuvchi hisobini yarating, “E’lon berish” bo‘limida avtomobil ma’lumotlarini kiriting va tekshiruvga yuboring. Admin tasdiqlagach e’lon katalogda chiqadi.'],
  ['E’lon qachon ko‘rinadi?', 'E’lon yuborilgach moderatsiya navbatiga tushadi. Tasdiqlangan e’lonlar ochiq katalogda ko‘rinadi.'],
  ['Sotuvchi bilan qanday bog‘lanaman?', 'E’lon tafsilotlari sahifasida sotuvchining telefon raqami ko‘rsatiladi. Qo‘ng‘iroq tugmasi orqali bevosita bog‘lanishingiz mumkin.'],
  ['Qanday to‘lov usullari bor?', 'Avto.uz e’lon va sotuvchini bog‘laydi; xaridor va sotuvchi to‘lov shartlarini o‘zaro kelishib oladi.']
];

export default function HelpPage() {
  return <Container maxWidth="md" sx={{ py: { xs: 5, md: 8 } }}>
    <Stack direction="row" spacing={1} alignItems="center" color="secondary.main"><HelpOutline /><Typography variant="overline">YORDAM MARKAZI</Typography></Stack>
    <Typography variant="h1" sx={{ fontSize: { xs: 34, md: 46 }, mt: 1, mb: 1 }}>Sizga qanday yordam beramiz?</Typography><Typography color="text.secondary" mb={4}>Avto.uz’dan foydalanish bo‘yicha ko‘p so‘raladigan savollar.</Typography>
    <Box>{questions.map(([question, answer]) => <Accordion key={question} disableGutters elevation={0} sx={{ borderBottom: 1, borderColor: 'divider', '&:before': { display: 'none' } }}><AccordionSummary expandIcon={<ExpandMore />}><Typography fontWeight={600}>{question}</Typography></AccordionSummary><AccordionDetails><Typography color="text.secondary" lineHeight={1.8}>{answer}</Typography></AccordionDetails></Accordion>)}</Box>
    <Box sx={{ mt: 5, p: { xs: 2.5, sm: 3 }, bgcolor: 'primary.main', color: 'primary.contrastText', borderRadius: 1 }}><Typography variant="h3" fontSize={20} mb={1}>Yana savolingiz bormi?</Typography><Typography variant="body2" sx={{ opacity: .8, mb: 2 }}>Jamoamiz bilan bog‘laning — yordam berishdan mamnunmiz.</Typography><Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}><Button color="secondary" variant="contained" startIcon={<MailOutline />} component={Link} href="mailto:help@avto.uz">help@avto.uz</Button><Button color="inherit" variant="outlined" startIcon={<PhoneInTalk />} component={Link} href="tel:+998712000000">+998 71 200 00 00</Button></Stack></Box>
  </Container>;
}
