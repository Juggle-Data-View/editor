/**
 * 合并多个 Provider，防止多层嵌套
 */

import store from '@store/index';
import { Provider } from 'react-redux';

const Composer: React.FC<{ providers: Array<React.JSXElementConstructor<React.PropsWithChildren<any>>> }> = ({
  providers,
  children,
}) => {
  return (
    <>
      {providers.reduceRight(
        (children, Parent: any) => (
          <Parent>{children}</Parent>
        ),
        children
      )}
    </>
  );
};

const ReduxProvider: React.FC = (props) => {
  return <Provider store={store}>{props.children as any}</Provider>;
};

const Providers: React.FC = (props) => {
  return <Composer providers={[ReduxProvider]}>{props.children}</Composer>;
};

export default Providers;
