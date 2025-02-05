import { createTheme } from '@mui/material/styles';

// Define the light theme palette
const lightPalette = {
  primary: {
    main: '#1976d2', // blue
  },
  secondary: {
    main: '#dc004e', // pink
  },
  background: {
    default: '#fafafa', // light background
    paper: '#ffffff', // paper background
  },
  text: {
    primary: '#000000', // black text
    secondary: '#555555', // gray text
  },
};

// Define the dark theme palette (slightly lighter dark colors)
const darkPalette = {
  primary: {
    main: '#90caf9', // light blue
  },
  secondary: {
    main: '#f50057', // pink
  },
  background: {
    default: '#1a1a1a', // slightly lighter than #121212
    paper: '#2c2c2c', // lighter paper background
  },
  text: {
    primary: '#e0e0e0', // light white text (instead of pure white)
    secondary: '#a0a0a0', // lighter gray text
  },
};

// Create the theme
export const lightTheme = createTheme({
  palette: {
    mode: 'light', // Set the mode to 'light'
    ...lightPalette, // Add light palette colors
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark', // Set the mode to 'dark'
    ...darkPalette, // Add dark palette colors
  },
});
