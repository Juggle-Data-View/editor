import { JuggleDV } from '@juggle-data-view/types';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectDatasources } from '@store/selectors';

const useOriginData = (comps: JuggleDV.Comp[]) => {
  const dataConfigs = useMemo(
    () => comps.map((item) => item.dataConfig).filter((item) => item) as JuggleDV.CompDataConfig[],
    [comps]
  );
  const datasources = useSelector(selectDatasources);

  const dataFetchSequeues = useMemo(
    () =>
      dataConfigs.reduce((result, { dataSourceId }) => {
        if (!(dataSourceId in datasources)) {
          throw new Error('Not found datasource');
        }

        return {
          ...result,
        };
      }, {}),
    [dataConfigs, datasources]
  );
  console.log(dataFetchSequeues);
};

export default useOriginData;
