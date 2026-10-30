import React from 'react';
import ReactDOM from 'react-dom/client';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import theme from './app/components/MaterialTheme';
import { SessionProvider } from './app/context/SessionContext';
import './styles.css';
import './app/components/MaterialTheme/styled.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><ThemeProvider theme={theme}><CssBaseline /><BrowserRouter><SessionProvider><App /></SessionProvider></BrowserRouter></ThemeProvider></React.StrictMode>
);
