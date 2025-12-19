import { createTheme } from '@mui/material/styles';

// DakSamadhan-AI Theme
// Modern professional government UI
// Colors: Deep Indigos/Blues for trust, with vibrant accents.

const theme = createTheme({
    palette: {
        mode: 'light', // Can be toggled later
        primary: {
            main: '#1a237e', // Deep Indigo (Trust, Government)
            light: '#534bae',
            dark: '#000051',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#ff6f00', // Amber (Actionable, Indian Post link)
            light: '#ffa040',
            dark: '#c43e00',
            contrastText: '#000000',
        },
        background: {
            default: '#f4f6f8', // Light Grey for enterprise feel
            paper: '#ffffff',
        },
        text: {
            primary: '#1c1e21',
            secondary: '#5c6b7f',
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontSize: '2.5rem',
            fontWeight: 700,
            color: '#1a237e',
        },
        h2: {
            fontSize: '2rem',
            fontWeight: 600,
            color: '#1a237e',
        },
        h3: {
            fontSize: '1.75rem',
            fontWeight: 600,
        },
        button: {
            textTransform: 'none', // Modern feel
            fontWeight: 600,
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8, // Modern rounded corners
                    padding: '8px 24px',
                },
                containedPrimary: {
                    boxShadow: '0 4px 6px rgba(26, 35, 126, 0.2)',
                    '&:hover': {
                        boxShadow: '0 6px 10px rgba(26, 35, 126, 0.3)',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                elevation1: {
                    boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                },
            },
        },
    },
});

export default theme;
