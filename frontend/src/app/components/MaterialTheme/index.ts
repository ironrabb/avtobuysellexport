import { createTheme } from '@mui/material/styles';
import { typography } from './typography';
import { componentStyles } from './components';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#354c3c', dark: '#263c30', light: '#718c68', contrastText: '#ffffff' },
    secondary: { main: '#ed6b42', dark: '#d95d37', light: '#f0ae76', contrastText: '#ffffff' },
    background: { default: '#f6f6f3', paper: '#ffffff' },
    text: { primary: '#20221f', secondary: '#858781' },
    divider: '#e7e8e2',
    success: { main: '#43845d' },
    error: { main: '#b64b3b' }
  },
  typography,
  shape: { borderRadius: 4 },
  components: componentStyles
});

export default theme;
