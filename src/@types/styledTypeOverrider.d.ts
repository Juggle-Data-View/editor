import 'styled-components';
import { theme } from 'config/theme';

type DefaultThemeOverrider = typeof theme;

declare module 'styled-components' {
  export type DefaultTheme = DefaultThemeOverrider;
}
