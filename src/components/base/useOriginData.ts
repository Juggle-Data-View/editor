import { AutoDV } from 'auto-dv-type';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectDatasources } from 'store/selectors';

const useOriginData = (comps: AutoDV.Comp[]) => {
  const dataConfigs = useMemo(
    () => comps.map((item) => item.dataConfig).filter((item) => item) as AutoDV.CompDataConfig[],
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
