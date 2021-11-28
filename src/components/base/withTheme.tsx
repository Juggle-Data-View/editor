import { ThemeProvider } from 'styled-components';
import useTheme from 'components/base/useTheme';

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
