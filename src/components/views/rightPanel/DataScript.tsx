/**
 * 代码片段组件
 */

import React, { useState, useEffect } from 'react';
import { TextArea, Button, Menu, MenuItem, Intent, Icon } from '@blueprintjs/core';
import { Popover2 } from '@blueprintjs/popover2';
import * as Api from 'utils/api';
import { FieldLabel } from 'components/form';
import { AutoDVStatus } from 'helpers/intent';
import { useRequest } from 'ahooks';
import SearchSelect, { Item } from 'components/common/SearchSelect';
import { LoadingIcon } from 'components/common/AutoDVIcon';

interface Segment extends Item {
  params?: string[];
}

const noneItem: Segment = {
  value: null,
  label: '无',
  params: [],
};

interface Props {
  specScript: string;
  dataSourceId: AutoDV.DataSourceId;
  scriptId: AutoDV.DataConfig['scriptId'];
  onChange: (item: Segment) => void;
  onBlur: (value: string) => void;
  children: (params: string[]) => JSX.Element;
}

type ScriptIntent = Extract<Intent, 'danger' | 'success' | 'none'>;

const CheckeSQLMessage: Record<ScriptIntent, string> = {
  none: '',
  danger: 'SQL语法错误！',
  success: 'SQL语法校验通过！',
};

const checkSQL = async (content: string) => {
  return Api.checkDataScript({ dataSourceType: 2, content });
};

const SQLTextArea = (props: { sql: string; onBlur: (sql: string) => void }) => {
  const { sql, onBlur } = props;
  const [sqlStatus, setSqlStatus] = useState<ScriptIntent>('none');
  const { run } = useRequest(checkSQL, {
    manual: true,
    onSuccess(data, params) {
      setSqlStatus('success');
      onBlur(params[0]); // sql语句
    },
    onError() {
      setSqlStatus('danger');
    },
  });

  return (
    <div style={{ marginTop: 10 }}>
      <TextArea
        fill={true}
        intent={sqlStatus}
        growVertically={false}
        style={{ height: 60 }}
        defaultValue={sql}
        onBlur={async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
          const value = e.currentTarget.value;
          if (!value) {
            setSqlStatus('none');
          } else {
            value && run(value);
          }
        }}
      />
      <div
        style={{
          marginTop: 5,
          color: AutoDVStatus[sqlStatus].color,
          display: 'flex',
          lineHeight: 1.3,
          maxHeight: 100,
          overflow: 'auto',
        }}
      >
        <Icon style={{ margin: '1px 5px 0 0' }} icon={AutoDVStatus[sqlStatus].icon} iconSize={12} />
        {CheckeSQLMessage[sqlStatus]}
      </div>
    </div>
  );
};

type SelectItem = {
  label: string;
  value: string;
};

const fetchSegments = async (dataSourceId: AutoDV.DataSourceId): Promise<Segment[]> => {
  try {
    if (!dataSourceId) return [];
    const res = await Api.fetchDataScriptList({ dataSourceId });
    return res.content.map((item) => ({
      value: item.id,
      label: item.name || `empty-${item.id}`,
      params: item.paramNames,
    }));
  } catch (error) {
    throw error;
  }
};

const ScriptTypes: SelectItem[] = [
  { label: '无', value: 'none' },
  { label: '键入SQL', value: 'code' },
  { label: 'SQL片段', value: 'segment' },
];

export const DataScript: React.FC<Props> = (props) => {
  const { specScript, dataSourceId, scriptId, onChange, onBlur } = props;
  const [activeType, setActiveType] = useState<SelectItem>(ScriptTypes[0]);
  const {
    data: segments,
    run,
    loading,
  } = useRequest(() => fetchSegments(dataSourceId), {
    initialData: [],
    refreshDeps: [dataSourceId],
    formatResult: (res) => [noneItem].concat(res),
    ready: activeType.value === 'segment',
  });

  const activeSegment = segments?.find((segment) => segment.value === scriptId);

  useEffect(() => {
    setActiveType(ScriptTypes[0]);
  }, [dataSourceId]);

  useEffect(() => {
    if (scriptId) {
      // 优先使用 scriptId
      setActiveType(ScriptTypes[2]);
    } else {
      if (specScript) {
        setActiveType(ScriptTypes[1]);
      }
    }
  }, [scriptId, specScript]);

  return (
    <>
      <FieldLabel label="SQL方式" help="如果同时设置了键入sql和代码片段，会优先使用代码片段数据。">
        <Popover2
          disabled={!dataSourceId}
          position="bottom-left"
          minimal={true}
          content={
            <Menu style={{ maxHeight: 244, overflow: 'auto' }}>
              {ScriptTypes.map((item) => {
                const { label, value } = item;
                return (
                  <MenuItem
                    key={value}
                    text={label}
                    active={activeType ? activeType.value === value : false}
                    onClick={() => setActiveType(item)}
                  />
                );
              })}
            </Menu>
          }
        >
          <Button
            disabled={!dataSourceId}
            text={activeType ? activeType.label : '请选择下拉项..'}
            rightIcon="double-caret-vertical"
          />
        </Popover2>
        {activeType.value === 'code' ? <SQLTextArea sql={specScript} onBlur={onBlur} /> : null}
        {activeType.value === 'segment' ? (
          <div style={{ marginTop: 10 }}>
            <SearchSelect
              showEmpty={false}
              activeItem={activeSegment}
              items={loading ? [] : segments || []}
              onItemSelect={onChange}
              placeholder="请选择代码片段"
              extraRefresh={<Button small minimal icon={<LoadingIcon duration={loading ? 3 : 0} />} onClick={run} />}
            />
          </div>
        ) : null}
      </FieldLabel>
      {activeType.value === 'segment' && activeSegment && activeSegment.params?.length
        ? props.children(activeSegment.params)
        : null}
    </>
  );
};

export default DataScript;
