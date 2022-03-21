import { INodeConfig } from 'auto-dv-type/src/form';

import tooltip from '../common/tooltip';
import axisLabel from '../common/axisLabel';
import * as font from 'config/form/font';
// import * as echartsConfig from 'config/echarts';
import classNames from 'classnames';

import { ReactSVG } from 'react-svg';
import svgs, { svgItems, SVGDropDownStyled, IItem } from '../common/icons/icons';
import DropDown from 'components/common/DropDown';

const options = [
  { label: '实线', value: 'solid' },
  { label: '虚线', value: 'dashed' },
  { label: '点线', value: 'dotted' },
];

const radar: INodeConfig[] = [
  ...tooltip,
  // {
  //   name: 'backgroundColor',
  //   type: 'color',
  //   label: '图表背景色',
  // },
  {
    name: 'radar',
    type: 'collapse',
    props: {
      label: '全局配置',
    },
    children: [
      {
        name: 'radius[0]',
        type: 'text',
        label: '内径占比',
      },
      {
        name: 'radius[1]',
        type: 'text',
        label: '外径占比',
      },
      {
        name: 'center[0]',
        type: 'text',
        label: '圆心X坐标',
      },
      {
        name: 'center[1]',
        type: 'text',
        label: '圆心Y坐标',
      },
      { name: 'textStyle', type: 'fragment', children: [font.fontFamily] },
      {
        name: 'shape',
        type: 'select',
        label: '分割线形状',
        props: {
          options: [
            { value: '', label: '多边形' },
            { value: 'circle', label: '圆形' },
          ],
        },
      },
      {
        name: 'axisLine',
        type: 'fragment',
        children: [
          {
            name: 'lineStyle',
            type: 'fragment',
            children: [
              {
                name: 'color',
                type: 'color',
                label: '分割线颜色',
                props: {
                  useGradient: true,
                },
              },
              {
                name: 'width',
                type: 'number',
                label: '分割线宽度',
                props: {
                  muiProps: {
                    min: 0,
                  },
                },
              },
              {
                name: 'type',
                type: 'select',
                label: '分割线样式',
                props: {
                  options: options,
                },
              },
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'radar',
    type: 'collapse',
    props: {
      label: '极轴',
    },
    children: [
      {
        name: 'splitLine',
        type: 'fragment',
        children: [
          {
            name: 'lineStyle',
            type: 'fragment',
            children: [
              {
                name: 'color',
                type: 'color',
                label: '分割线颜色',
              },
              {
                name: 'width',
                type: 'number',
                label: '分割线宽度',
                props: {
                  muiProps: {
                    min: 0,
                  },
                },
              },
              {
                name: 'type',
                type: 'select',
                label: '分割线样式',
                props: {
                  options: options,
                },
              },
            ],
          },
        ],
      },
      {
        name: 'startAngle',
        type: 'range',
        label: '旋转角度',
        props: {
          sliderProps: {
            step: 1,
          },
          range: [0, 360],
        },
      },
      {
        name: 'max',
        type: 'number',
        label: '最大值',
        props: {
          muiProps: {
            step: 1,
            min: 0,
            max: 360,
          },
        },
      },
      {
        name: 'min',
        type: 'number',
        label: '最小值',
        props: {
          muiProps: {
            step: 1,
            min: 0,
            max: 360,
          },
        },
      },

      {
        name: 'axisLabel',
        type: 'collapse',
        props: {
          label: '轴标签',
        },
        children: axisLabel,
      },
    ],
  },
  {
    name: 'radar',
    type: 'collapse',
    props: {
      label: '轴名称设置',
    },
    children: [
      {
        name: 'name.textStyle',
        type: 'fragment',
        children: axisLabel,
      },
      {
        name: 'indicator[]',
        type: 'dynamciMultiField',
        label: '轴名称',
        labelProps: {
          vertical: true,
        },
        props: {
          childrenOperations: [
            {
              icon: 'add',
              value: 'add',
            },
            {
              icon: 'delete',
              value: 'delete',
            },
          ],
        },
        children: [
          {
            name: 'name',
            type: 'text',
          },
        ],
      },
    ],
  },
  {
    name: 'series[0].label',
    type: 'collapse',
    props: {
      label: '值标签',
    },
    children: axisLabel,
  },

  {
    name: 'series[]',
    type: 'array',
    // label: (obj, path) => '系列-' + getRealName(obj, path),
    props: ({ getValue, setValue }) => {
      const fieldMapPath = 'dataConfig.fieldMap';
      const fieldMap: any[] = getValue(fieldMapPath);

      const fieldName = 'y' + (fieldMap.length + 1);
      return {
        itemTitle: (item) => `系列-${item.name}`,
        label: '系列',
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
        onDelete: (deleteData) => {
          const result = fieldMap.filter((item) => {
            return item.compFieldName !== deleteData.FieldName;
          });
          setValue(fieldMapPath, result);
        },
      };
    },
    children: [
      {
        name: 'name',
        type: 'text',
        label: '系列名',
      },
      {
        name: 'areaStyle.color',
        type: 'color',
        label: '填充颜色',
      },
      {
        name: 'lineStyle',
        type: 'fragment',
        children: [
          {
            name: 'color',
            type: 'color',
            label: '线条颜色',
          },
          {
            name: 'width',
            type: 'number',
            label: '线条宽度',
            props: {
              muiProps: {
                min: 0,
              },
            },
          },
          {
            name: 'type',
            type: 'select',
            label: '线条样式',
            props: {
              options: options,
            },
          },
        ],
      },
      {
        name: '',
        type: 'collapse',
        props: {
          label: '数据点样式',
        },
        children: [
          {
            name: 'showSymbol',
            type: 'switch',
            label: '显示数据点',
          },
          {
            type: 'component',
            name: 'symbol',
            label: '图标设置',
            props: ({ name, value, setValue }) => {
              const active = svgItems.find((item) => item.value === value);
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
                            key={item.value}
                            className={classNames('dropdown-list-item', { '--selected': selected })}
                            onClick={handleClick}
                          >
                            <span>{item.name}</span>
                            {item.icon && <ReactSVG className="icon" src={svgs[item.icon]} wrapper="span" />}
                          </div>
                        );
                      }}
                      onItemSelect={(item) => setValue(name, item.value)}
                      listMaxHeight={240}
                    >
                      <div className="dropdown-item">
                        <span>{active ? active.name : '下拉选择图标..'}</span>
                        {active && active.icon && <ReactSVG className="icon" src={svgs[active.icon]} wrapper="span" />}
                      </div>
                    </DropDown>
                  </SVGDropDownStyled>
                ),
              };
            },
          },
          {
            name: 'symbolSize',
            type: 'number',
            label: '数据点大小',
            props: {
              muiProps: {
                min: 0,
              },
            },
          },
          {
            name: 'itemStyle.color',
            type: 'color',
            label: '数据点颜色',
          },
        ],
      },
    ],
  },

  {
    name: 'legend',
    type: 'collapse',
    props: {
      label: '图例配置',
    },
    children: [
      {
        name: 'show',
        type: 'switch',
        label: '显示图例',
      },
      {
        name: 'textStyle',
        type: 'fragment',
        children: [
          font.fontSize,
          font.lineHeight,
          font.color,
          font.fontFamily,
          font.fontWeight,
          font.textShadow,
          font.writingMode,
        ],
      },
      {
        name: 'top',
        type: 'text',
        label: '上边距',
      },
      {
        name: 'bottom',
        type: 'text',
        label: '下边距',
      },
      {
        name: 'left',
        type: 'text',
        label: '左边距',
      },
      {
        name: 'right',
        type: 'text',
        label: '右边距',
      },
    ],
  },
];

export default radar;
