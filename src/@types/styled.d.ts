/**
 * 给`styled-components`的`props`指定`theme`属性
 * 当我们在styled中使用props时可以这样使用：
 *
 * ``` tsx
 * const ContainerStyled = styled.div`
 *   // `ptIntentPrimary`的值来自`@/config/const`的theme
 *   color: ${props => props.theme.primary}
 * `;
 * ```
 * 其中，theme 和 theme.ptIntentPrimary 都可以被自动提示
 */

import 'styled-components';

type AutoDVTheme = import('config/theme').AutoDVTheme;

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends AutoDVTheme {}
}

declare module 'react' {
  interface DOMAttributes<T = any> {
    css?: InterpolationWithTheme<T>;
  }
}
