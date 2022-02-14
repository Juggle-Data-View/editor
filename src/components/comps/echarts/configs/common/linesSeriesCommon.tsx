import { INodeConfig } from 'components/recursion';
import areaStyle from './areaStyle';
import axisLabel from './axisLabel';

import classNames from 'classnames';
import DropDown from 'components/common/DropDown';
import { ReactSVG } from 'react-svg';
import svgs, { svgItems, SVGDropDownStyled, IItem } from './icons/icons';
import markPoint from './markPoint';

const lineSeriesCommon: INodeConfig[] = [
  {
    name: 'name',
    type: 'text',

    label: '系列名称',
  },
  {
    name: 'smooth',
    type: 'switch',
    label: '开启线条平滑',
  },
  {
    name: 'lineStyle.width',
    type: 'number',
    label: '线条宽度',
    props: {
      muiProps: {
        min: 0,
      },
    },
  },
  {
    name: 'lineStyle.color',
    type: 'color',
    label: '折线颜色',
    props: {
      useGradient: true,
    },
  },
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
    // label: 'COLOR',
    label: ({ name, getValue }) => {
      const value = getValue(name, '../../');
      if (value.type === 'line') {
        return '数据点颜色';
      } else {
        return '柱条颜色';
      }
    },
    props: {
      useGradient: true,
    },
  },
  {
    name: 'label',
    type: 'collapse',
    props: {
      label: '值标签',
    },
    children: axisLabel,
  },
  {
    name: 'areaStyle',
    type: 'collapse',
    props: {
      label: '填充区域',
    },
    children: areaStyle,
  },
  {
    name: 'showBackground',
    type: 'switch',
    label: '柱形背景',
  },
  {
    name: 'stack',
    type: 'text',
    label: '数据堆叠',
    labelProps: { help: <div style={{ maxWidth: 180 }}>同个类目轴上系列配置相同的stack值可以堆叠放置。</div> },
  },
  {
    name: 'backgroundStyle.color',
    type: 'color',
    label: '柱形背景颜色',
  },
  {
    name: 'yAxisIndex',
    type: 'select',
    label: '关联Y轴',
    props: {
      options: [
        { value: 0, label: 'Y1轴' },
        { value: 1, label: 'Y2轴' },
      ],
    },
  },
  { name: 'isShowMarkPoint', type: 'switch', label: '关键点' },
  {
    name: 'markPoint',
    type: 'fragment',
    children: markPoint,
    show: ({ parentValue }) => parentValue.isShowMarkPoint,
  },
];

export default lineSeriesCommon;
