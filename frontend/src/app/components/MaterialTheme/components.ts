import type { Components, Theme } from '@mui/material/styles';
import { cardShadow } from './shadow';

export const componentStyles: Components<Theme> = {
  MuiCssBaseline: { styleOverrides: { body: { minWidth: 320, backgroundColor: '#f6f6f3' }, '::selection': { backgroundColor: '#f4b6a1' } } },
  MuiButton: { styleOverrides: { root: { borderRadius: 3, boxShadow: 'none', textTransform: 'none', fontWeight: 700 }, containedPrimary: { '&:hover': { boxShadow: 'none' } } } },
  MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
  MuiCard: { styleOverrides: { root: { border: '1px solid #e9eae5', borderRadius: 4, boxShadow: 'none', transition: 'box-shadow 180ms ease, transform 180ms ease', '&:hover': { boxShadow: cardShadow, transform: 'translateY(-3px)' } } } },
  MuiOutlinedInput: { styleOverrides: { root: { borderRadius: 3, backgroundColor: '#fff' }, notchedOutline: { borderColor: '#dedfd8' } } },
  MuiDialog: { styleOverrides: { paper: { borderRadius: 4, backgroundImage: 'none' } } },
  MuiChip: { styleOverrides: { root: { borderRadius: 3, fontWeight: 600 } } }
};
