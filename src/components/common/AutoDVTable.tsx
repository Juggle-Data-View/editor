/**
 * 表格组件
 */

import styled from 'styled-components';
import React from 'react';

export interface Column<D = any> {
  /** 列头显示文字 */
  title: React.ReactNode;
  /** React 需要的 key，如果已经设置了唯一的 dataIndex，可以忽略这个属性 */
  key?: string;
  /** 列宽度 */
  width?: string | number;
  /** 列数据在数据项中对应的key */
  dataIndex?: string;
  /**
   * 生成复杂数据的渲染函数，参数分别为当前行的值，当前行数据，行索引
   * @param val 当前行的值
   * @param record 当前行数 据
   * @param index 行索引
   */
  render?: (val: any, record: D, index: number) => any;
  style?: React.CSSProperties;
  //单行展示cell
  isSigleRow?: boolean;
}

export type ColumnsType<D = any> = Column<D>[];

interface IProps<D = any> {
  columns: ColumnsType<D>;
  dataSource: any[];
  rowKey?: string;
}

const Container = styled.table`
  width: 100%;
  background: ${(props) => props.theme.gray5};
  border-radius: 5px;
  border-spacing: 5px;
  th {
    height: 26px;
    text-align: center;
    background: ${(props) => props.theme.gray3};
    border-radius: 5px;
  }
  td {
    padding: 3px 0;
    text-align: center;
    word-break: break-all;
    line-height: 1.2;
    vertical-align: top;
  }
  tr:last-child {
    td {
      border-bottom: none;
    }
  }
`;

function AutoDVTable<T extends unknown>(props: IProps<T>) {
  const { columns, dataSource, rowKey } = props;
  return (
    <Container>
      <thead>
        <tr>
          {columns.map((column, index) => {
            /**
             * 如果 dataIndex 在 columns 中是唯一字符串，则可以使用 dataIndex
             * 如果列中出现了相同的 dataIndex，则建议使用 key
             */
            const columnKey = column.key || column.dataIndex || index;
            return !column.isSigleRow ? (
              <th key={columnKey} style={{ width: column.width }}>
                {column.title}
              </th>
            ) : null;
          })}
        </tr>
      </thead>
      <tbody>
        {dataSource.map((data, index) => {
          const _rowKey = data.key ? data.key : rowKey ? data[rowKey] : '';
          const columnStruct = columns.filter((item) => !item.isSigleRow);
          const rowStruct = columns.filter((item) => item.isSigleRow);
          return (
            <React.Fragment key={index}>
              <tr key={_rowKey}>
                {columnStruct.map((column, idx) => {
                  const columnKey = column.key || column.dataIndex || idx; // 同上
                  const record = column.dataIndex ? data[column.dataIndex] : null;
                  return (
                    <td key={columnKey} style={{ ...column.style, width: column.width }}>
                      {column.render ? column.render(record, data, index) : record}
                    </td>
                  );
                })}
              </tr>
              {rowStruct.map((row, idx) => {
                const columnKey = row.key || row.dataIndex || idx; // 同上
                const record = row.dataIndex ? data[row.dataIndex] : null;
                return (
                  <tr key={columnKey}>
                    <td colSpan={columnStruct.length}>{row.render ? row.render(record, data, index) : record}</td>
                  </tr>
                );
              })}
            </React.Fragment>
          );
        })}
      </tbody>
    </Container>
  );
}

export default AutoDVTable;
