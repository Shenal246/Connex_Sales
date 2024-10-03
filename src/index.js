// src/index.js or src/App.js
import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import App from './App';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      dark: '#1565c0',
    },
    secondary: {
      main: '#dc004e',
      dark: '#c51162',
    },
    error: {
      main: '#f44336',
      dark: '#c62828',
    },
    success: {
      main: '#4caf50',
      dark: '#388e3c',
    },
    common: {
      white: '#ffffff',
    },
  },
  typography: {
    // Define typography settings here if needed
  },
});

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>,
  document.getElementById('root')
);
