import { alpha, Theme } from '@mui/material/styles';

// SETUP COLORS
const GREY: any = {
  A100: '#FFFFFF',
  100: '#F9FAFB',
  200: '#F4F6F8',
  300: '#DFE3E8',
  400: '#C4CDD5',
  500: '#919EAB',
  600: '#637381',
  700: '#454F5B',
  800: '#212B36',
  900: '#161C24',
  500_8: alpha('#919EAB', 0.08),
  500_12: alpha('#919EAB', 0.12),
  500_16: alpha('#919EAB', 0.16),
  500_24: alpha('#919EAB', 0.24),
  500_32: alpha('#919EAB', 0.32),
  500_48: alpha('#919EAB', 0.48),
  500_56: alpha('#919EAB', 0.56),
  500_80: alpha('#919EAB', 0.8),
};

const PRIMARY: any = {
  lighter: '#C8FACD',
  light: '#5BE584',
  main: '#00AB55',
  dark: '#007B55',
  darker: '#005249',
  contrastText: '#fff',
};
const SECONDARY: any = {
  lighter: '#D6E4FF',
  light: '#84A9FF',
  main: '#3366FF',
  dark: '#1939B7',
  darker: '#091A7A',
  contrastText: '#fff',
};
const INFO: any = {
  lighter: '#D0F2FF',
  light: '#74CAFF',
  main: '#1890FF',
  dark: '#0C53B7',
  darker: '#04297A',
  contrastText: '#fff',
};
const SUCCESS: any = {
  lighter: '#E9FCD4',
  light: '#AAF27F',
  main: '#54D62C',
  dark: '#229A16',
  darker: '#08660D',
  contrastText: GREY[800],
};
const WARNING: any = {
  lighter: '#FFF7CD',
  light: '#FFE16A',
  main: '#FFC107',
  dark: '#B78103',
  darker: '#7A4F01',
  contrastText: GREY[800],
};
const ERROR: any = {
  lighter: '#FFE7D9',
  light: '#FFA48D',
  main: '#FF4842',
  dark: '#B72136',
  darker: '#7A0C2E',
  contrastText: '#fff',
};

// const CHART_COLORS: any = {
//   violet: ['#826AF9', '#9E86FF', '#D0AEFF', '#F7D2FF'],
//   blue: ['#2D99FF', '#83CFFF', '#A5F3FF', '#CCFAFF'],
//   green: ['#2CD9C5', '#60F1C8', '#A4F7CC', '#C0F2DC'],
//   yellow: ['#FFE700', '#FFEF5A', '#FFF7AE', '#FFF3D6'],
//   red: ['#FF6C40', '#FF8F6D', '#FFBD98', '#FFF2D4'],
// };

const palette: Theme['palette'] = {
  common: { black: '#000', white: '#fff' },
  primary: { ...PRIMARY },
  secondary: { ...SECONDARY },
  info: { ...INFO },
  success: { ...SUCCESS },
  warning: { ...WARNING },
  error: { ...ERROR },
  grey: GREY,
  mode: 'light',
  contrastThreshold: 0,
  tonalOffset: 0,
  getContrastText: (color: string) => {
    return color;
  },
  augmentColor: () => {
    return {
      light: '#fff',
      main: '#CCC',
      dark: '#222',
      contrastText: '#222',
    };
  },
  divider: GREY[500_24],
  text: { primary: GREY[800], secondary: GREY[600], disabled: GREY[500] },
  background: { paper: '#eee', default: '#fff' },
  action: {
    active: GREY[600],
    hover: GREY[500_8],
    selected: GREY[500_16],
    disabled: GREY[500_80],
    disabledBackground: GREY[500_24],
    focus: GREY[500_24],
    hoverOpacity: 0.08,
    disabledOpacity: 0.48,
    selectedOpacity: 0,
    focusOpacity: 0.8,
    activatedOpacity: 1,
  },
};

export default palette;
