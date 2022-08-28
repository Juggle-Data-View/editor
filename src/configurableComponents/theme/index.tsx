import React from 'react';
import { createTheme, StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import { ThemeProvider as StyleThemeProvider } from 'styled-components';
import shape from './shape';
import palette from './palette';
import typography from './typography';
import shadows from './shadows';
import { CssBaseline } from '@mui/material';

export const theme = createTheme({
  palette,
  shape,
  typography,
  shadows,
});

const ThemeConfig: React.FC<any> = ({ children }) => {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <StyleThemeProvider theme={theme}>{children}</StyleThemeProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};
export default ThemeConfig;
