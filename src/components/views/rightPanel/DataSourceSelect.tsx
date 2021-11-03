/**
 * 数据源下拉列表（带搜索版）
 */

import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Button } from '@blueprintjs/core';
import * as Api from 'utils/api';
import { useRequest } from 'ahooks';
import { selectCompDatas } from 'store/selectors';
import SearchSelect, { Item, SearchSelectProps } from 'components/common/SearchSelect';
import { LoadingIcon } from 'components/common/AutoDVIcon';

export interface DataSourceItem {
  dataSourceId: AutoDV.DataSourceId;
  dataSourceName: string;
}

interface IProps {
  dataSourceId: AutoDV.DataSourceId;
  dataSourceType: AutoDV.DataSourceType;
  onItemSelect: SearchSelectProps['onItemSelect'];
}

const DataSourceSelect: React.FC<IProps> = (props) => {
  const { dataSourceType, dataSourceId, onItemSelect } = props;
  const compDatas = useSelector(selectCompDatas);
  const { data, run, loading } = useRequest(() => Api.fetchDataSourceList(dataSourceType), {
    formatResult: (res) => {
      const _items = res.content.map((data) => {
        return {
          value: data.id,
          label: data.name,
        } as Item;
      });
      return _items;
    },
    refreshDeps: [dataSourceType],
  });

  const items = useMemo(() => {
    if (dataSourceType === 4) {
      return Object.keys(compDatas)
        .filter((code) => compDatas[code].compCode === 'datasource')
        .map((code) => {
          return {
            value: code,
            label: compDatas[code].title || compDatas[code].alias,
          };
        });
    }
    return data ? data : [];
  }, [data, compDatas, dataSourceType]);

  const activeItem = items.find((item) => item.value === dataSourceId);

  return (
    <SearchSelect
      placeholder={`请选择数据源`}
      activeItem={activeItem}
      items={loading ? [] : items}
      onItemSelect={onItemSelect}
      extraRefresh={<Button small minimal icon={<LoadingIcon duration={loading ? 3 : 0} />} onClick={run} />}
    />
  );
};

export default DataSourceSelect;
