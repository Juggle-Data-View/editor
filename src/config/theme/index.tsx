import React from 'react';
import { createTheme, StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import shape from './shape';
import palette from './palette';
import typography from './typography';
import shadows from './shadows';
import { CssBaseline } from '@mui/material';

// ----------------------------------------------------------------------

// ThemeConfig.propTypes = {
//   children: PropTypes.node
// };

export const theme = createTheme({
  palette,
  shape,
  typography,
  shadows,
});

const ThemeConfig: React.FC = ({ children }) => {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  );
};
export default ThemeConfig;
