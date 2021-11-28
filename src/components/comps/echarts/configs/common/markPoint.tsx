/*
 * @Author: ashes
 * @Date: 2021-09-02 11:31:50
 * @LastEditTime: 2021-09-02 16:57:05
 * @LastEditors: your name
 * @Description:
 * @FilePath: /autoDV5-react/src/components/comps/echarts/configs/common/markPoint.tsx
 * 可以输入预定的版权声明、个性签名、空行等
 */

import DropZone from 'components/common/DropZone';
import { INodeConfig } from 'components/recursion';
import * as style from 'config/style';
const markPoint: INodeConfig[] = [
  {
    type: 'select',
    name: 'type',
    labelProps: {
      help: (
        <div>
          Canvas模式:不支持动态图
          <br />
          DOM模式：支持动态图
        </div>
      ),
      width: 100,
    },
    label: '关键点类型',
    props: {
      options: [
        { label: 'DOM模式', value: 'dom' },
        { label: 'Canvas模式', value: 'canvas' },
      ],
    },
  },
  {
    type: 'component',
    name: 'symbol',
    label: '上传图片',
    labelProps: { vertical: true, help: '文字在图片上层' },
    props: ({ name }) => ({
      render: <DropZone name={name} />,
    }),
  },
  {
    name: 'symbolSize',
    type: 'number',
    label: '大小',
  },
  {
    name: 'symbolOffset[0]',
    type: 'number',
    label: '图片左边距',
  },
  {
    name: 'symbolOffset[1]',
    type: 'number',
    label: '图片上边距',
  },

  {
    name: 'label.show',
    type: 'switch',
    label: '文本标签',
  },
  {
    name: 'label.formatter',
    type: 'formatter',
    label: '格式化函数',
    labelProps: {
      help: (
        <div style={{ width: '150px' }}>
          参数data为echarts提供
          <br />
          DOM模式下需要提供dom节点内容,
          <br />
          参数data为 value: data
        </div>
      ),
      width: 200,
      vertical: true,
    },
    props: {
      codeType: 'javascript',
    },
    show: ({ parentValue }) => parentValue.show,
  },
  {
    name: 'label.formatter',
    type: 'formatter',
    label: '文本格式化',
    props: {
      codeType: 'javascript',
    },
    show: ({ parentValue }) => parentValue.show,
  },
  {
    name: 'markPointContent',
    type: 'text',
    label: '文本内容',
    show: ({ parentValue, name, getValue }) => {
      return parentValue.label.show && getValue(name, '../../').type === 'canvas';
    },
  },
  {
    name: 'label.position[1]',
    type: 'number',
    label: '文本上边距',
    show: ({ name, getValue }) => {
      const { label, type } = getValue(name, '../../../');
      return label.show && type === 'canvas';
    },
  },
  {
    name: 'label.position[0]',
    type: 'number',
    label: '文本左边距',
    show: ({ name, getValue }) => {
      const { label, type } = getValue(name, '../../../');
      return label.show && type === 'canvas';
    },
  },
  {
    name: 'label.fontSize',
    type: 'number',
    label: '字体大小',
    show: ({ parentValue, name, getValue }) => {
      return parentValue.show && getValue(name, '../../').type === 'canvas';
    },
  },
  {
    name: 'label.color',
    type: 'color',
    label: '字体颜色',
    props: {
      useGradient: true,
    },
    show: ({ parentValue, name, getValue }) => {
      return parentValue.show && getValue(name, '../../').type === 'canvas';
    },
  },
  {
    name: 'label.fontWeight',
    type: 'select',
    label: '字体粗细',
    props: { options: style.fontWeight },
    show: ({ parentValue, name, getValue }) => {
      return parentValue.show && getValue(name, '../../').type === 'canvas';
    },
  },
];

export default markPoint;
