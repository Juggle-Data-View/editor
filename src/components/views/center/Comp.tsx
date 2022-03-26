import React, { Suspense, lazy, memo, useMemo } from 'react';
import CompErrorBoundary from 'components/base/CompErrorBoundary';
import CompLoader from 'components/common/CompLoader';
import withSourceData from './withSourceData';
import { AutoDV } from 'auto-dv-type';

/**
 * memo: Optimizing components by reducing `withSourceData` props pass
 */
const Comp: React.FC<AutoDV.CompIndex> = memo((props) => {
  const { compData } = props;
  const { compCode } = compData;
  const LazyIndex = useMemo(() => {
    return lazy(() => import(`components/comps/${compCode}/Index`));
  }, [compCode]);

  return (
    <CompErrorBoundary compData={compData}>
      <Suspense fallback={<CompLoader />}>
        <LazyIndex {...props} />
      </Suspense>
    </CompErrorBoundary>
  );
});

/**
 * Refectory origin data
 */
export default withSourceData(Comp);
