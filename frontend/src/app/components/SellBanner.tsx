import { ArrowOutward } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';

type Props = { onSell: () => void };

export default function SellBanner({ onSell }: Props) {
  return <Box component="section" className="sell-banner" id="how"><div className="sell-banner-shape">✳</div><Box><Typography className="eyebrow light-eyebrow" variant="overline"><span className="eyebrow-line" /> SOTISH VAQTI KELMADIMI?</Typography><Typography component="h2" variant="h2">Avtomobilingizga<br />yangi egani toping.</Typography><Typography component="p">E’loningizni joylang. Qolganini biz osonlashtiramiz.</Typography></Box><Button onClick={onSell} color="secondary" variant="contained" endIcon={<ArrowOutward />}>Bepul e’lon berish</Button></Box>;
}
