import { createTheme } from '@material-ui/core/styles';
export const lightTheme = createTheme({
  palette: {
    type: 'light',
  },
});

export const darkHeaderTheme = createTheme({
  palette: {
    text: {
      primary: '#ffffff',
    },
  },
});

export const luma = (colorString) => {
  let color = colorString.substring(1); // strip #
  let rgb = parseInt(color, 16); // convert rrggbb to decimal
  let r = (rgb >> 16) & 0xff; // extract red
  let g = (rgb >> 8) & 0xff; // extract green
  let b = (rgb >> 0) & 0xff; // extract blue

  return 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709
};

export default lightTheme;
