/**
 * 业务组件的包装组件
 * 让组件有交互事件
 */

import React, { Suspense, lazy, memo, useMemo } from 'react';
import CompErrorBoundary from 'components/base/CompErrorBoundary';
import CompLoader from 'components/common/CompLoader';
import withSourceData from './withSourceData';
import { AutoDV } from 'auto-dv-type';

/**
 * memo: 阻止上层hoc组件withSourceData内部触发的一些rerender
 */
const Comp: React.FC<AutoDV.CompIndex> = memo((props) => {
  const { compData, isInEditor } = props;
  const { compCode } = compData;
  const LazyIndex = useMemo(() => {
    return lazy(() => import(`components/comps/${compCode}/Index`));
  }, [compCode]);

  return (
    <CompErrorBoundary compData={compData} isInEditor={isInEditor}>
      <Suspense fallback={<CompLoader />}>
        <LazyIndex {...props} />
      </Suspense>
    </CompErrorBoundary>
  );
});

/**
 * 组装了服务端数据的组件
 */
export default withSourceData(Comp);
