import { ThemeProvider } from 'styled-components';
import useTheme from 'components/base/useTheme';
import React from 'react';

const withTheme = (Comp: React.ElementType) => {
  return (props: any) => {
    const { theme } = useTheme();
    return (
      <ThemeProvider theme={theme}>
        <Comp {...props} />
      </ThemeProvider>
    );
  };
};

export default withTheme;
