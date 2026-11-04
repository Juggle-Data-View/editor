import React, { Suspense, lazy, memo, useMemo } from 'react';
import CompErrorBoundary from '@components/base/CompErrorBoundary';
import CompLoader from '@components/common/CompLoader';
import withSourceData from './withSourceData';
import { JuggleDV } from '@juggle-data-view/types';
import { findRemote } from 'runtime/registry';
import { loadRemoteComponent } from 'runtime/loadRemoteComponent';
import RemotePlaceholder from 'runtime/RemotePlaceholder';

/**
 * memo: Optimizing components by reducing `withSourceData` props pass
 */
const Comp: React.FC<JuggleDV.CompIndex> = memo((props) => {
  const { compData } = props;
  const { compCode, version } = compData;
  const LazyIndex = useMemo(() => {
    return lazy(async () => {
      let remote: Awaited<ReturnType<typeof findRemote>> = undefined;
      try {
        remote = await findRemote(compCode, version);
      } catch (error) {
        console.error(error);
      }
      if (remote) {
        try {
          const RemoteComp = await loadRemoteComponent(remote);
          return { default: RemoteComp as unknown as React.ComponentType<JuggleDV.CompIndex> };
        } catch (error) {
          console.error(error);
          const message = error instanceof Error ? error.message : '组件加载失败';
          const Failed: React.FC = () => <RemotePlaceholder kind="load" message={message} />;
          return { default: Failed as unknown as React.ComponentType<JuggleDV.CompIndex> };
        }
      }
      return import(`@components/comps/${compCode}/Index`);
    });
  }, [compCode, version]);

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
