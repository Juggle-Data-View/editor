import styled from 'styled-components';
import { Colors, Classes } from '@blueprintjs/core';
import AutoDVTable, { ColumnsType } from 'components/common/AutoDVTable';
import { Control } from 'components/form';

const FieldTextStyled = styled.div`
  padding: 0 5px;
  min-height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

interface IProps {
  name: string; // "dataConfig"
  fieldMap: AutoDV.Field[];
  originData: any[];

  /** "映射" 列只读时只显示文本 */
  readonly?: boolean;
}

const FieldMapTable: React.FC<IProps> = (props) => {
  const { fieldMap, originData, readonly, name } = props;
  const fieldMapName = [name, 'fieldMap'].join('.');

  // 取mockData下每个对象的并集key
  const fields = originData.reduce((pre, cur) => [...Array.from(new Set([...pre, ...Object.keys(cur)]))], []).sort();

  // 获取mockdata下的key的集合
  const mockDataKeys = originData.reduce((acc, cur) => {
    for (const k in cur) acc.push(k);
    return acc;
  }, []);

  const columns: ColumnsType = [
    {
      title: '字段',
      width: '33%',
      dataIndex: 'compFieldName',
      render: (compFieldName) => {
        return (
          <FieldTextStyled>
            <div title={compFieldName} className={Classes.TEXT_OVERFLOW_ELLIPSIS} style={{ width: 90 }}>
              {compFieldName}
            </div>
          </FieldTextStyled>
        );
      },
    },
    {
      title: '映射',
      width: '33%',
      dataIndex: 'sourceFieldName',
      render: (sourceFieldName, data, index) => {
        const options = [...Array.from(new Set(['', sourceFieldName, ...fields]))];
        const name = `${fieldMapName}[${index}].sourceFieldName`;
        return readonly ? (
          <FieldTextStyled>{sourceFieldName || '无'}</FieldTextStyled>
        ) : (
          <div style={{ maxWidth: 100 }}>
            <Control.Select
              name={name}
              buttonProps={{ fill: true, small: true }}
              popoverProps={{ fill: true }}
              useFastField={false} // 如果没有，会出现fieldMap下拉数据渲染不同步的bug
            >
              {options.map((field) => (
                <option key={field} value={field}>
                  {field || '无'}
                </option>
              ))}
            </Control.Select>
          </div>
        );
      },
    },
    {
      title: '状态',
      render: (val, data) => {
        const isMatch = mockDataKeys.includes(data.sourceFieldName);
        return (
          <FieldTextStyled>
            <span style={{ color: isMatch ? Colors.GREEN5 : Colors.ORANGE5 }}>{isMatch ? '已匹配' : '未匹配'}</span>
          </FieldTextStyled>
        );
      },
    },
  ];

  const tableData = fieldMap.map((field, index) => {
    return {
      compFieldName: field.compFieldName,
      sourceFieldName: field.sourceFieldName,
    };
  });

  return (
    <div className="block">
      <AutoDVTable rowKey="compFieldName" columns={columns} dataSource={tableData} />
    </div>
  );
};

export default FieldMapTable;
