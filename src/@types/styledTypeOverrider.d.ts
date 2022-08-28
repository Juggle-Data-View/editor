import 'styled-components';
import { theme } from '@configurableComponents/theme';

type DefaultThemeOverrider = typeof theme;

declare module 'styled-components' {
  // export type DefaultTheme = DefaultThemeOverrider;
  export interface DefaultTheme extends DefaultThemeOverrider {} //eslint-disable-line
}
