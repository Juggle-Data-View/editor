import styled from 'styled-components';
import { Pre } from '@blueprintjs/core';
import { validator } from 'components/form/index';
import { utils, INodeConfig, Generator } from './index';

// import echartsConfig from 'components/comps/echarts/configs/config_line_bar';
// const config: INodeConfig | INodeConfig[] = echartsConfig.forms;
// const defaultValues = echartsConfig.template;

const CustomComp = ({ value, onClick }: { value?: string; onClick?: () => void }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', minHeight: 30 }}>
      <button onClick={onClick} style={{ padding: '3px 7px', marginRight: 10 }}>
        Increment: {value}
      </button>
    </div>
  );
};

// const config: INodeConfig<typeof mapping> = {
//   type: 'number',
//   name: 'test',
//   label: 'Test',
//   validate: (val) => (val < 5 ? undefined : 'sss'),
// };

const config: INodeConfig = {
  type: 'fragment',
  name: '',
  children: [
    {
      type: 'text',
      name: 'firstName',
      validate: [validator.maxLength(5), validator.required],
    },
    {
      type: 'number',
      name: 'number',
      label: ({ value }) => (
        <div>
          Age <small>({value})</small>
        </div>
      ),
      default: 1,
      validate: validator.positive,
      onChange: ({ value, oldValue }) => {
        console.log('onChange:', `当前值: ${value}`, `上个值: ${oldValue}`);
      },
    },
    {
      type: 'switch',
      name: 'switch',
      label: 'Switch',
      default: false,
    },
    {
      type: 'select',
      label: '币种',
      name: 'currency',
      default: 'dollar',
      props: {
        options: [
          { label: 'None', value: '' },
          { label: '美元', value: 'dollar' },
          { label: '欧元', value: 'euro' },
        ],
      },
    },
    {
      type: 'number',
      label: '金额',
      name: 'money',
      props: ({ parentValue }) => {
        return {
          bp: { leftIcon: parentValue.currency },
        };
      },
    },
    {
      type: 'fragment',
      name: '',
      children: [
        {
          type: 'number',
          name: 'nnn',
          label: '其他数字',
          default: 5,
        },
        {
          type: 'checkbox',
          name: 'cb',
          label: '多选',
          default: [1, 2],
          props: {
            options: [
              { label: 'a', value: 1 },
              { label: 'b', value: 2 },
              { label: 'c', value: 3 },
            ],
          },
        },
      ],
    },
    {
      type: 'text',
      name: 'echarts.option.sss',
      label: 'test',
      default: 'sssa',
    },
    {
      type: 'collapse',
      name: 'a',
      props: { label: 'A' },
      children: [
        {
          type: 'fragment',
          name: 'b',
          children: [
            {
              type: 'number',
              name: 'e',
              label: 'E',
              default: 2,
            },
            {
              type: 'component',
              name: '../c',
              label: '自定义组件',
              default: 10,
              props: ({ name, parentName, value, parentValue, setValue, getValue }) => {
                const parentNodeValue = getValue(parentName);
                return {
                  render: () => (
                    <CustomComp
                      value={value}
                      onClick={() => {
                        console.log('父节点（结构上）的数据：', parentNodeValue);
                        console.log('父节点（数据上）的数据：', parentValue);
                        setValue(name, Number(value) + 1);
                      }}
                    />
                  ),
                };
              },
            },
          ],
        },
      ],
    },
    {
      type: 'fragment',
      name: 'echarts.option',
      children: [
        {
          type: 'collapse',
          name: '',
          props: {
            label: '图表',
          },
          children: [
            { type: 'color', name: 'backgroundColor', label: '纯色', default: 'red' },
            { type: 'color', name: 'backgroundColor2', label: '渐变色', default: 'red', props: { useGradient: true } },
          ],
        },
        {
          type: 'collapse',
          name: '',
          props: {
            label: '坐标轴',
          },
          children: [
            {
              type: 'collapse',
              name: 'xAxis',
              props: {
                label: 'x轴',
              },
              children: [
                {
                  type: 'switch',
                  name: 'show',
                  label: '显示x轴',
                  default: true,
                },
              ],
            },
            {
              type: 'collapse',
              name: 'yAxis',
              props: {
                label: 'y轴',
              },
              children: [{ type: 'number', label: '字号', name: 'fontSize', default: 12 }],
            },
          ],
        },
        {
          type: 'collapse',
          name: '',
          props: {
            label: '系列',
          },
          labelProps: {
            vertical: false,
          },
          children: [
            {
              type: 'switch',
              label: '显示',
              name: 'show',
              default: true,
            },
            {
              type: 'fragment',
              name: '',
              // 因为name为空，所以value指向的是echarts.option
              show: ({ value }) => value.show,
              children: [
                {
                  type: 'select',
                  label: '文本字体',
                  name: 'fontFamily',
                  default: 'HeiTi',
                  props: {
                    options: [
                      { label: '黑体', value: 'HeiTi' },
                      { label: '微软雅黑', value: 'YaHei' },
                    ],
                  },
                },
                {
                  type: 'number',
                  label: '柱条宽度',
                  name: 'series[0].barWidth',
                  default: 1,
                  onChange: ({ name, value, getValue, setValue }) => {
                    const itemKey = name.split('.').pop() as string; // 获取需要修改的key=barWidth
                    const seriesPath = utils.resolveName(name, '../../'); // 根据当前路径，回退2次，得到的name=series
                    const seriesFieldValue = getValue(name, '../../');
                    if (Array.isArray(seriesFieldValue)) {
                      seriesFieldValue.forEach((_item: any, index: number) => {
                        const name = [seriesPath, index, itemKey].join('.');
                        setValue(name, value);
                      });
                    }
                  },
                },
                {
                  type: 'array',
                  name: 'series[]',
                  props: {
                    label: 'Tabs',
                    itemTitle: (item, index) => `系列${index + 1}${item.tabName}`,
                    onBeforeAdd(old) {
                      return {
                        ...old,
                        id: +new Date(),
                      };
                    },
                    onDelete(index) {
                      console.log('delete:', index);
                    },
                  },
                  children: [
                    {
                      type: 'text',
                      name: 'tabName',
                      label: '名称',
                    },
                    {
                      type: 'switch',
                      label: '显示',
                      name: 'show',
                      default: false,
                    },
                    {
                      type: 'select',
                      label: '类型',
                      name: 'type',
                      default: 'bar',
                      props: {
                        options: [
                          { label: '条形图', value: 'bar' },
                          { label: '折线图', value: 'line' },
                        ],
                      },
                    },
                    {
                      type: 'number',
                      label: '柱条间隙',
                      name: 'barGap',
                      show: ({ parentValue }) => {
                        return parentValue.type === 'bar' ? true : false;
                      },
                      default: 12,
                    },
                    {
                      type: 'color',
                      label: '区域填充',
                      name: 'areaStyle.color',
                      default: 'blue',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

const Container = styled.div`
  display: flex;
  height: 100%;
  overflow: auto;
  > div {
    flex: 1;
    height: 100%;
    overflow: auto;
  }
`;

const Demo = () => {
  const defaultValues = utils.getDefaultValues(config);
  return (
    <Generator
      config={config}
      values={defaultValues}
      defaultValues={defaultValues}
      onSubmit={(values) => {
        console.log('submit success', values);
      }}
    >
      {({ render, formik }) => {
        return (
          <Container>
            <div style={{ padding: 10 }}>{render()}</div>
            <div style={{ paddingRight: 10 }}>
              <Pre>{JSON.stringify(formik, null, 2)}</Pre>
            </div>
          </Container>
        );
      }}
    </Generator>
  );
};

export default Demo;
