/**
 * 业务组件 - 预览组件
 * @创建时间 2020-05-14 15:40:36
 */

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { IIndex, TableHeader, Global, Column } from './type';
import Marquee from 'components/common/Marquee';
import Trend from './trend';
import { getNotificationContent, getTriggerCondition } from 'utils/limitNotification';
import { triggerNotification } from 'utils/api';
import notice from 'utils/notice';
import numeral from 'numeral';

interface IStyle {
  autoSuitable?: boolean;
}

const IndexStyled = styled.div<IStyle>`
  // 预览组件的样式
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  .row {
    display: flex;
    height: 100%;
    width: 100%;
    overflow: hidden;
  }
  .cell {
    display: flex;
    ${(props) => (props.autoSuitable ? 'flex: 1' : '')};
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .column {
    display: inline-block;
    font-size: 24px;
    height: 100%;
  }
  .cell-scroll {
    &-auto {
      white-space: nowrap;
    }
    &-nowrap {
      white-space: nowrap;
    }
    &-normal {
      display: inline-block;
      white-space: normal;
      word-break: break-all;
    }
  }
`;

const getCellScroll = (type: string) => {
  switch (type) {
    case 'nowrap':
      return '-nowrap';
    case 'normal':
      return '-normal';
    case 'autoscroll':
      return '-auto';
  }
};

/**
 * 获取source包含keys中所有项的一个新对象
 * @param keys 不过滤的key
 * @param source 要过滤对象
 */
function pickValue<T>(keys: (keyof T)[], source: T) {
  const result: any = {};
  for (let index = 0; index < keys.length; index++) {
    const element = keys[index];
    if (source) {
      result[element] = source[element];
    }
  }
  return result;
}

const Index: React.FC<IIndex> = ({ compData, sourceData }) => {
  const { code } = compData;
  const { option } = compData.config;
  const { width, height } = compData.attr;
  const { tableHeader, column, global, row } = option;
  const { maxNumberOfRow: configMaxNumberOfRow, autoSuitable } = global;

  const [limitTriggerCoords, setLimitTriggerCoords] = useState<{
    [key: string]: { flag: boolean; conditionIndex: number };
  }>({
    '0,0': { flag: false, conditionIndex: NaN },
  });

  const globalStyleKeys: (keyof Global)[] = ['fontFamily'];
  const MarqueeWithoutType: any = Marquee as any;
  const maxNumberOfRow = configMaxNumberOfRow > sourceData.length ? sourceData.length : configMaxNumberOfRow;
  const tableStyleKeys: (keyof TableHeader)[] = [
    'backgroundColor',
    'color',
    'fontFamily',
    'fontSize',
    'fontWeight',
    'lineHeight',
    'justifyContent',
  ];
  const columnStyleKeys: (keyof Column)[] = ['fontFamily', 'color', 'fontSize', 'fontWeight', 'justifyContent'];
  const isOverWidth = (columnsWidth: any[], tableWidth: number) => {
    const sumwWidth = columnsWidth.reduce((prev, next) => {
      return parseInt(prev) + parseInt(next);
    });
    if (sumwWidth > tableWidth) {
      return true;
    } else {
      return false;
    }
  };

  const getBorderStyle = (columnIndex: number) => {
    const result: React.CSSProperties = {};
    const { columnBorder, columnBorderColor, columnBorderWidth } = global.borderStyle;
    if (columnBorder) {
      result.borderLeft = `${columnBorderColor} ${columnBorderWidth}px solid`;
      result.borderRight = `${columnBorderColor} ${columnBorderWidth}px solid`;
      result.marginLeft = columnIndex > 0 ? '-1px' : '0px';
    }
    return result;
  };

  const getRowBorderStyle = () => {
    const result: React.CSSProperties = {};
    const { rowBorder, rowBorderColor, rowBorderWidth } = global.borderStyle;
    if (rowBorder) result.borderBottom = `${rowBorderColor} ${rowBorderWidth}px solid`;
    return result;
  };

  const renderTable = () => {
    const tableStyle = pickValue<TableHeader>(tableStyleKeys, tableHeader);
    const globalStyle = pickValue<Global>(globalStyleKeys, global);
    const columnsWidth = column.map((item) => item.width);
    const isOver = isOverWidth(columnsWidth, 100);
    const sumWidth = columnsWidth.reduce((prev, next) => next + prev);
    const { lineHeight, isShow } = tableHeader;
    const getBodyHeight = () => {
      if (isShow) {
        return height * (1 - lineHeight / 100);
      } else {
        return height;
      }
    };
    return (
      <div className="row">
        {column.map((item, index) => {
          const columnItems = column[index];
          const columnItemsStyle = pickValue<Column>(columnStyleKeys, columnItems);
          columnItemsStyle.width = isOver ? (item.width * width) / sumWidth : item.width + '%';

          return (
            <div
              key={index}
              style={Object.assign(getBorderStyle(index), globalStyle, columnItemsStyle)}
              className="column"
            >
              {isShow ? (
                <div
                  key={index}
                  style={Object.assign(
                    {
                      height: tableHeader.rowHeight
                        ? tableHeader.rowHeight + '%'
                        : height / (maxNumberOfRow + 1) + 'px',
                      ...getRowBorderStyle(),
                    },
                    globalStyle,
                    row,
                    tableStyle
                  )}
                  className="cell"
                >
                  {item.columnName}
                </div>
              ) : null}
              {renderTableColumn(item.name, columnItemsStyle, item, getBodyHeight(), index)}
            </div>
          );
        })}
      </div>
    );
  };
  const getColumnData = (key: string) => {
    return sourceData ? sourceData.map((item: any) => item[key]) : [];
  };

  const notification = () => {
    const rowName = getColumnData(column[0].name);

    column.forEach((item, colIndex) => {
      const { limitOption, name, columnName } = item;
      if (!limitOption) {
        //兼容线上版本
        return;
      }

      const { isShow, limitTrigger } = limitOption;
      const data = getColumnData(name);
      let triggerCoordSet: any = limitTriggerCoords;
      if (!isShow) {
        Object.keys(triggerCoordSet).forEach((item) => {
          triggerCoordSet[item] = {
            flag: false,
            conditionIndex: NaN,
          };
        });
        setLimitTriggerCoords(triggerCoordSet);
        return;
      }

      data.forEach(async (rowItem, rowIndex) => {
        const condition = getTriggerCondition(limitTrigger, rowItem);
        if (!condition) {
          triggerCoordSet = {
            ...triggerCoordSet,
            [`${rowIndex},${colIndex}`]: {
              flag: false,
              conditionIndex: NaN,
            },
          };
          setLimitTriggerCoords(triggerCoordSet);
          return;
        }
        const { conditionCode, isTrigger, index, intervalType, left, right } = condition;

        triggerCoordSet = {
          ...triggerCoordSet,
          [`${rowIndex},${colIndex}`]: {
            flag: true,
            conditionIndex: index,
          },
        };
        setLimitTriggerCoords(triggerCoordSet);
        if (!isTrigger) {
          // triggerCoordSet = {
          //   ...triggerCoordSet,
          //   [`${rowIndex},${colIndex}`]: false,
          //   conditionIndex: NaN,
          // };
          return;
        }
        try {
          await triggerNotification({
            instCode: code,
            conditionCode,
            columnId: colIndex + '',
            columnName: columnName,
            rowId: rowIndex + '',
            rowName: rowName[rowIndex],
            conditionName: getNotificationContent(intervalType, left, right),
            value: rowItem,
          });
        } catch (error) {
          console.log(error);
          notice.error('阈值条件错误');
        }
      });
    });
  };

  const getValue = (formatter: string, value: any, colIndex: number) => {
    if (!formatter) {
      return value;
    }
    let formatterFunc: ((data: any) => any) | null = null;
    try {
      formatterFunc = new Function(`return ${formatter}`) as (data: any) => any; //eslint-disable-line
    } catch (error) {
      notice.error(`第${colIndex + 1}列，格式化函数语法错误`);
    }

    try {
      return formatterFunc && formatterFunc(value)(value, numeral);
    } catch (error) {
      notice.error(`第${colIndex + 1}列，格式化函数执行错误`);
    }
  };

  const renderTableColumn = (
    headerName: string,
    columnItemsStyle: any,
    column: Column,
    bodyHeight: number,
    colIndex: number
  ) => {
    const { icon, color, number, size, hasTrend, marginRight } = column.trend;
    const className = `cell-scroll${getCellScroll(column.whiteSpace)}`;
    const { limitOption, formatter } = column;

    return getColumnData(headerName).map((item: string, index: number) => {
      if (index < maxNumberOfRow) {
        delete columnItemsStyle.width;
        const conditionItem = limitTriggerCoords[`${index},${colIndex}`];

        let backgroundColor = (index + 1) % 2 === 0 ? row.evenBackgroudColor : row.oddBackgroudColor;
        if (conditionItem) {
          const conditionIndex = conditionItem.conditionIndex;
          if (!isNaN(conditionIndex) && conditionItem.flag) {
            if (limitOption?.limitTrigger[conditionIndex]) {
              backgroundColor = limitOption?.limitTrigger[conditionIndex].color as string;
            }
          }
        }
        const data = Number(getValue(formatter, item, colIndex));
        return (
          <div
            key={index}
            style={Object.assign(
              {
                height: bodyHeight / maxNumberOfRow + 'px',
                ...getRowBorderStyle(),
                backgroundColor,
              } as React.CSSProperties,
              row,
              columnItemsStyle
            )}
            className={`cell`}
          >
            {column.whiteSpace !== 'autoscroll' ? (
              <>
                {hasTrend && !isNaN(data) ? (
                  <Trend
                    data={data}
                    icon={icon}
                    color={color}
                    textColor={column.color}
                    number={number}
                    size={size}
                    marginRight={marginRight}
                  />
                ) : (
                  <p className={className}>{getValue(formatter, item, colIndex)}</p>
                )}
              </>
            ) : (
              <MarqueeWithoutType
                speed={1}
                disabled={false}
                direction="horizontal"
                text={
                  hasTrend && !isNaN(data) ? (
                    <Trend
                      marginRight={marginRight}
                      data={data}
                      icon={icon}
                      color={color}
                      textColor={column.color}
                      number={number}
                      size={size}
                    />
                  ) : (
                    getValue(formatter, item, colIndex)
                  )
                }
              />
            )}
          </div>
        );
      } else {
        return null;
      }
    });
  };

  useEffect(() => {
    notification();
  }, [sourceData, compData]); //eslint-disable-line

  return <IndexStyled autoSuitable={autoSuitable}>{renderTable()}</IndexStyled>;
};

export default Index;
