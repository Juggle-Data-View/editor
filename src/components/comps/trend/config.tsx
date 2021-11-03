/**
 * 组件配置信息
 */
import React from 'react';
import { Colors } from '@blueprintjs/core';
import styled from 'styled-components';
import { IConfig } from './type';
import * as font from 'config/form/font';
import DropDown from 'components/common/DropDown';
import svgs from './icons/index';
import { ReactSVG } from 'react-svg';
import classNames from 'classnames';
import { nanoid } from 'utils';
import limitTrigger from 'config/form/limitTrigger';

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
  { name: '图标12', icon: './icon12.svg' },
];

const config: IConfig = {
  version: '1.0.0',
  tab: {
    config: true,
    dataset: true,
  },
  template: {
    title: '指标趋势',
    attr: {
      left: 0,
      top: 0,
      width: 300,
      height: 80,
      angle: 0,
      scale: [1, 1],
    },
    config: {
      global: {
        align: 'flex-start',
        layout: 'row',
        gap: 10,
      },
      number: {
        isIconColor: true,
        textStyle: {
          fontFamily: 'FZLTTHJW',
          color: '#ccf807',
          fontSize: 36,
          fontWeight: 'bold',
          textShadow: '',
        },
        prefix: '',
        suffix: '元',
        isThousands: true,
        base: 0,
        formatter: '',
      },
      color: {
        equal: '#ff0',
        up: 'red',
        down: '#06fc2c',
      },
      icon: {
        size: 48,
        name: './icon05.svg',
      },
      limitOption: {
        isShow: true,
        limitTrigger: [
          {
            conditionCode: `trend-${nanoid(6)}`,
            intervalType: 'close',
            left: 1,
            right: 3,
            color: '#222',
            isTrigger: false,
            time: 10000,
            timeUnit: 'sec',
          },
        ],
      },
    },
    dataConfig: {
      fieldMap: [
        {
          compFieldName: 'value',
          sourceFieldName: 'svalue1',
        },
        {
          compFieldName: 'base',
          sourceFieldName: '',
        },
      ],
    },
  },
  forms: {
    type: 'fragment',
    name: 'config',
    children: [
      {
        type: 'collapse',
        name: 'global',
        props: { label: '全局设置' },
        children: [
          {
            type: 'select',
            name: 'layout',
            label: '布局样式',
            labelProps: { help: '影响图标前后位置' },
            props: {
              options: [
                { label: '正常', value: 'row' },
                { label: '反转', value: 'row-reverse' },
              ],
            },
          },
          {
            type: 'select',
            name: 'align',
            label: '对齐方式',
            props: ({ parentValue }) => {
              const isReverse = parentValue.layout === 'row-reverse';
              return {
                options: [
                  { label: isReverse ? '右对齐' : '左对齐', value: 'flex-start' },
                  { label: '居中', value: 'center' },
                  { label: isReverse ? '左对齐' : '右对齐', value: 'flex-end' },
                ],
              };
            },
          },
          { type: 'number', name: 'gap', label: '图标与数值间隔' },
        ],
      },
      {
        type: 'collapse',
        name: 'icon',
        props: { label: '图标' },
        children: [
          {
            type: 'component',
            name: 'name',
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
                        {active && active.icon && <ReactSVG className="icon" src={svgs[active.icon]} wrapper="span" />}
                      </div>
                    </DropDown>
                  </SVGDropDownStyled>
                ),
              };
            },
          },
          {
            type: 'number',
            name: 'size',
            label: '图标大小',
            props: { unit: 'px', bp: { min: 0 } },
          },
        ],
      },
      {
        type: 'collapse',
        name: 'color',
        props: { label: '颜色设置' },
        children: [
          { type: 'color', name: 'up', label: '上升' },
          { type: 'color', name: 'equal', label: '持平' },
          { type: 'color', name: 'down', label: '下降' },
        ],
      },
      {
        type: 'collapse',
        name: 'number',
        props: { label: '数值设置' },
        children: [
          { type: 'number', name: 'base', label: '基础值', labelProps: { help: '优先使用数据中base字段进行比较。' } },
          { type: 'text', name: 'prefix', label: '数值前缀' },
          { type: 'text', name: 'suffix', label: '数值后缀' },
          { type: 'switch', name: 'isThousands', label: '显示千分位' },
          { type: 'switch', name: 'isIconColor', label: '与图标颜色一致' },
          {
            type: 'fragment',
            name: 'textStyle',
            children: [font.fontSize, font.color, font.fontFamily, font.fontWeight, font.textShadow],
          },
          {
            type: 'textarea',
            name: 'formatter',
            label: '格式化函数',
            labelProps: {
              help: (
                <div style={{ width: 180 }}>
                  <h4>语法：</h4>
                  <code dangerouslySetInnerHTML={{ __html: `(value, numeral) => newValue` }} />
                  <p>
                    <code>value</code>：单元格数据。
                  </p>
                  <p>
                    <code>numeral</code>：numeral.js库，可对数据进行格式化处理。
                  </p>
                  <p>
                    <code>newValue</code>：最终显示的数据。
                  </p>
                  <h4 style={{ marginTop: 3 }}>注意：</h4>
                  <p>如果定义了函数，千分位配置项将失效，最终数据只受函数影响。</p>
                </div>
              ),
            },
          },
        ],
      },
      {
        name: 'limitOption',
        type: 'fragment',
        children: limitTrigger,
      },
    ],
  },
  staticData: [
    {
      svalue1: 77,
      svalue2: 50,
    },
  ],
};

export default config;
