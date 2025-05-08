import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#003366', // Couleur principale bleu foncé
      dark: '#002244',
      light: '#335580',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#4CAF50', // Couleur secondaire verte
    },
    background: {
      default: '#f5f7fa', // Fond de page léger
      paper: '#ffffff',   // Fond des composants comme Paper
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      color: '#003366',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 'bold',
        },
      },
    },
  },
});

export default theme;