import * as echartsConfig from 'config/echarts';
import { INodeConfig } from 'components/recursion';
import * as font from 'config/form/font';
import { Colors } from '@blueprintjs/core';
import classNames from 'classnames';

import styled from 'styled-components';
import DropDown from 'components/common/DropDown';
import { ReactSVG } from 'react-svg';
import svgs from './icons/index';

const SVGDropDownStyled = styled.div`
  .dropdown-item,
  .dropdown-list-item {
    padding: 0 30px 0 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 30px;
  }
  .dropdown-list-item {
    padding: 0 22px 0 10px;
    &.--selected,
    &:hover {
      background-color: ${Colors.DARK_GRAY3};
    }
  }
  .icon svg {
    fill: currentColor;
    width: 16px;
    height: 16px;
  }
`;

interface IItem {
  /** 名称 */
  name: string;
  /** icon的路径是相对于icon当前目录下index文件 */
  icon: string;
}

// svg下拉素材，忽略 ./icon11.svg 的等号图标
const svgItems: IItem[] = [
  { name: '无', icon: '' },
  { name: '图标1', icon: './icon01.svg' },
  { name: '图标2', icon: './icon02.svg' },
  { name: '图标3', icon: './icon03.svg' },
  { name: '图标4', icon: './icon04.svg' },
  { name: '图标5', icon: './icon05.svg' },
  { name: '图标6', icon: './icon06.svg' },
  { name: '图标7', icon: './icon07.svg' },
  { name: '图标8', icon: './icon08.svg' },
  { name: '图标9', icon: './icon09.svg' },
  { name: '图标10', icon: './icon10.svg' },
];

const dictionary: INodeConfig[] = [
  {
    name: 'option',
    type: 'fragment',
    children: [
      {
        name: 'global',
        type: 'collapse',
        props: {
          label: '全局配置',
        },
        children: [
          {
            name: 'maxNumberOfRow',
            type: 'number',
            label: '表格行数',
            props: {
              muiProps: { min: 0 },
            },
          },
          {
            name: 'borderStyle',
            type: 'collapse',
            props: {
              label: '分割线样式',
            },
            children: [
              {
                name: 'columnBorder',
                type: 'switch',
                label: '显示列分割线',
              },
              {
                name: 'columnBorderColor',
                type: 'color',
                label: '列分割线颜色',
              },
              {
                name: 'columnBorderWidth',
                type: 'number',
                props: {
                  muiProps: { min: 0 },
                },
                label: '列分割线粗细',
              },
              {
                name: 'rowBorder',
                type: 'switch',
                label: '显示行分割线',
              },
              {
                name: 'rowBorderColor',
                type: 'color',
                label: '行分割线颜色',
              },
              {
                name: 'rowBorderWidth',
                type: 'number',
                props: {
                  muiProps: { min: 0 },
                },
                label: '行分割线粗细',
              },
            ],
          },
        ],
      },
      {
        name: 'tableHeader',
        type: 'collapse',
        props: {
          label: '表头',
        },
        children: [
          {
            name: 'isShow',
            type: 'switch',
            label: '显示表头',
          },
          {
            name: 'lineHeight',
            type: 'range',
            label: '文本行高',
            props: {
              sliderProps: {
                step: 1,
              },
              range: [0, 100],
            },
          },
          {
            name: 'rowHeight',
            type: 'range',
            label: '表头行高',
            props: {
              sliderProps: {
                step: 1,
              },
              range: [0, 100],
            },
          },
          {
            name: 'backgroundColor',
            type: 'color',
            label: '表头背景色',
          },
          font.fontFamily,
          font.fontSize,
          font.fontWeight,
          font.color,
          {
            name: 'justifyContent',
            type: 'select',
            label: '对齐方式',
            props: {
              options: [
                { label: '居中', value: 'center' },
                { label: '左对齐', value: 'flex-start' },
                { label: '右对齐', value: 'flex-end' },
              ],
            },
          },
        ],
      },
      {
        name: 'column[]',
        type: 'array',
        props: ({ getValue, setValue }) => {
          const fieldMapPath = 'dataConfig.fieldMap';
          const fieldMap: any[] = getValue(fieldMapPath);
          const fieldName = 'svalue' + (fieldMap.length + 1);
          return {
            itemTitle: (item, index) => `列${index + 1}`,
            label: '列配置',
            onAdd: () => {
              const result: any[] = fieldMap.concat([
                {
                  sourceFieldName: '',
                  compFieldName: fieldName,
                },
              ]);
              setValue(fieldMapPath, result);
            },
            onBeforeAdd: (item) => {
              return {
                ...item,
                name: fieldName,
                FieldName: fieldName,
              };
            },
            onDelete: (item, index) => {
              const result = fieldMap.slice();
              result.splice(index, 1);
              setValue(fieldMapPath, result);
            },
          };
        },
        children: [
          {
            name: 'columnName',
            type: 'text',
            label: '列名',
          },
          {
            name: 'width',
            type: 'range',
            label: '列宽',
            props: {
              sliderProps: {
                step: 1,
              },
              range: [0, 100],
            },
          },
          font.fontFamily,
          {
            name: 'whiteSpace',
            type: 'select',
            label: '换行方式',
            props: {
              options: echartsConfig.wrap,
            },
          },
          font.fontSize,
          font.color,
          font.fontWeight,
          {
            name: 'justifyContent',
            type: 'select',
            label: '对齐方式',
            props: {
              options: [
                { label: '居中', value: 'center' },
                { label: '左对齐', value: 'flex-start' },
                { label: '右对齐', value: 'flex-end' },
              ],
            },
          },
          {
            name: 'formatter',
            type: 'formatter',
            label: '格式化函数',
            labelProps: {
              help: (
                <div style={{ width: 180 }}>
                  <h4>函数参数：</h4>
                  <p>
                    <b>value</b>：单元格数据。
                  </p>
                </div>
              ),
              vertical: true,
            },
            props: {
              codeType: 'javascript',
            },
          },
          {
            name: 'trend',
            type: 'collapse',
            props: {
              label: '指标趋势设置',
            },
            children: [
              {
                name: 'hasTrend',
                type: 'switch',
                label: '显示指标趋势',
              },

              {
                type: 'component',
                name: 'icon',
                label: '图标设置',
                props: ({ name, value, setValue }) => {
                  const active = svgItems.find((item) => item.icon === value);
                  return {
                    render: () => (
                      <SVGDropDownStyled>
                        <DropDown<IItem>
                          // activeItem={active}
                          items={svgItems}
                          itemRenderer={({ item, handleClick }) => {
                            const selected = active && item.icon === active.icon;
                            return (
                              <div
                                key={item.icon}
                                className={classNames('dropdown-list-item', { '--selected': selected })}
                                onClick={handleClick}
                              >
                                <span>{item.name}</span>
                                {item.icon && <ReactSVG className="icon" src={svgs[item.icon]} wrapper="span" />}
                              </div>
                            );
                          }}
                          onItemSelect={(item) => setValue(name, item.icon)}
                          listMaxHeight={240}
                        >
                          <div className="dropdown-item">
                            <span>{active ? active.name : '下拉选择图标..'}</span>
                            {active && active.icon && (
                              <ReactSVG className="icon" src={svgs[active.icon]} wrapper="span" />
                            )}
                          </div>
                        </DropDown>
                      </SVGDropDownStyled>
                    ),
                  };
                },
              },
              {
                name: 'size',
                type: 'number',
                label: '图标大小',
                props: {
                  muiProps: {
                    min: 0,
                  },
                },
              },
              {
                name: 'marginRight',
                type: 'number',
                label: '间距',
                props: {
                  muiProps: {
                    min: 0,
                  },
                },
              },
              {
                name: 'number',
                type: 'collapse',
                props: {
                  label: '数值设置',
                },
                children: [
                  {
                    name: 'base',
                    type: 'number',
                    label: '基础值',
                  },
                  {
                    name: 'isIconColor',
                    type: 'switch',
                    label: '同图标颜色一致',
                  },
                  {
                    name: 'isThousands',
                    type: 'switch',
                    label: '千分位分隔符',
                  },
                  {
                    name: 'suffix',
                    type: 'text',
                    label: '后缀',
                  },
                ],
              },
              {
                name: 'color',
                type: 'collapse',
                props: {
                  label: '颜色设置',
                },
                children: [
                  {
                    name: 'equal',
                    type: 'color',
                    label: '相等',
                  },
                  {
                    name: 'up',
                    type: 'color',
                    label: '上升',
                  },
                  {
                    name: 'down',
                    type: 'color',
                    label: '下降',
                  },
                ],
              },
            ],
          },
        ],
      },

      {
        name: 'row',
        type: 'collapse',
        props: {
          label: '行配置',
        },
        children: [
          {
            name: 'oddBackgroudColor',
            type: 'color',
            label: '奇数行背景色',
          },
          {
            name: 'evenBackgroudColor',
            type: 'color',
            label: '偶数行背景色',
          },
        ],
      },
    ],
  },
];

export default dictionary;
