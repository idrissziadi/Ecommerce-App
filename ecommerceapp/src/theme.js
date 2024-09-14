import { createTheme } from '@mui/material/styles';

// Définition du thème personnalisé
const theme = createTheme({
  palette: {
    primary: {
      main: '#facc15',
    },
    secondary: {
      main: '#520c10',
    },
    color3: {
      main: '#ce7d31',
    },
    error: {
      main: '#de3b40',
    },
    warning: {
      main: '#efb034',
    },
    success: {
      main: '#1dd75b',
    },
    info: {
      main: '#379ae6',
    },
    grey: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#eeeeee',
      300: '#e0e0e0',
      400: '#bdbdbd',
      500: '#9e9e9e',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    },
    text: {
      primary: '#000000', // Couleur du texte principal
    },
  },
  typography: {
    fontFamily: 'Manrope, sans-serif',
    h1: {
      fontFamily: 'Lexend, sans-serif',
    },
    h2: {
      fontFamily: 'Lexend, sans-serif',
    },
    h3: {
      fontFamily: 'Lexend, sans-serif',
    },
    h4: {
      fontFamily: 'Lexend, sans-serif',
    },
    h5: {
      fontFamily: 'Lexend, sans-serif',
    },
    h6: {
      fontFamily: 'Lexend, sans-serif',
    },
  },
  shape: {
    borderRadius: 6,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          textTransform: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          borderRadius: 6,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          backgroundColor: '#facc15',
        },
      },
    },
    // Ajoutez d'autres composants MUI avec des styles personnalisés ici
  },
});

export default theme;
