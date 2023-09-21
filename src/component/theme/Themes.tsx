import { createTheme } from '@mui/material/styles';
export const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
  typography: {
    fontFamily: "'Nunito Sans', sans-serif !important",
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 1200,
      lg: 1536,
      xl: 1920,
    },
  },
});

export const darkHeaderTheme = createTheme({
  palette: {
    text: {
      primary: '#ffffff',
      secondary: '#ffffff',
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 1200,
      lg: 1536,
      xl: 1920,
    },
  },
});

export const luma = (colorString) => {
  // TODO - we are not able to handle color strings that do not start with '#'.
  // If we encouter such a color, for now, assume it's always light.
  if (colorString[0] !== '#') {
    return 100;
  }

  let color = colorString.substring(1); // strip #
  let rgb = parseInt(color, 16); // convert rrggbb to decimal
  let r = (rgb >> 16) & 0xff; // extract red
  let g = (rgb >> 8) & 0xff; // extract green
  let b = (rgb >> 0) & 0xff; // extract blue
  return 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709
};

export default lightTheme;
