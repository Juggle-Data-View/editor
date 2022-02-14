import * as font from 'config/form/font';
import { INodeConfig } from 'components/recursion';
import DynamicMultiField from 'components/recursion/widget/DynamicMultiField';
import TextTip from 'components/common/TextTip';

const activeTab: INodeConfig[] = [
  font.fontSize,
  font.color,
  {
    name: 'backgroundColor',
    type: 'color',
    label: '背景颜色',
  },
];

const widget = {
  dynamciMultiField: DynamicMultiField,
};

const dictionary: INodeConfig<typeof widget>[] = [
  {
    name: 'option',
    type: 'fragment',
    children: [
      {
        type: 'array',
        name: 'tabAddressOption.tabAddress[]',

        props: ({ getValue, setValue }) => {
          const fieldMapPath = 'dataConfig.fieldMap';
          const fieldMap: any[] = getValue(fieldMapPath);

          const fieldName = 'y' + (fieldMap.length + 1);
          return {
            itemTitle: (item, index) => `轮播-${index + 1}`,
            label: (
              <div>
                Tab标题和地址设置 <TextTip tipWidth={150} text={'根据id和releaseCode去加载页面'} />
              </div>
            ),
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
            onDelete: (index) => {
              const result = fieldMap.slice(0).splice(index, 1);
              console.log(result);

              setValue(fieldMapPath, result);
            },
          };
        },
        children: [
          {
            name: 'title',
            type: 'text',
            label: '标题',
          },
          {
            type: 'select',
            name: 'type',
            label: 'id类型',
            props: {
              options: [
                { label: 'id', value: 'id' },
                { label: 'releaseCode', value: 'releaseCode' },
              ],
            },
          },
          {
            name: 'url',
            type: 'text',
            label: 'id详情',
          },
        ], // 通用线性系列配置
      },
      // {
      //   name: 'tabAddressOption',
      //   type: 'collapse',
      //   props: {
      //     label: 'Tab标题和地址设置',
      //   },
      //   children: [
      //     // {
      //     //   name: 'tabAddress[]',
      //     //   type: 'dynamciMultiField',
      //     //   props: {
      //     //     childrenOperations: [
      //     //       {
      //     //         icon: 'add',
      //     //         value: 'add',
      //     //       },
      //     //       {
      //     //         icon: 'trash',
      //     //         value: 'delete',
      //     //       },
      //     //     ],
      //     //   },
      //     //   children: [],
      //     // },
      //   ],
      // },
      {
        name: '',
        type: 'collapse',
        props: {
          label: 'Tab标题样式设置',
        },
        children: [
          {
            name: 'tabTitleStyle',
            type: 'fragment',
            children: [
              {
                name: 'isShowTitle',
                type: 'switch',
                label: '显示标题',
              },
              {
                name: 'height',
                type: 'number',
                props: {
                  muiProps: {
                    min: 0,
                  },
                },
                label: '标题高度',
              },
              {
                name: 'margin',
                type: 'number',
                props: {
                  muiProps: {
                    min: 0,
                  },
                },
                label: '标题间隔',
              },
            ],
          },
          {
            name: 'activeTab',
            props: {
              label: '激活Tab样式',
            },
            type: 'collapse',
            children: activeTab,
          },
          {
            name: 'inactivedTab',
            type: 'collapse',
            props: {
              label: '未激活Tab样式',
            },
            children: activeTab,
          },
        ],
      },
      {
        name: 'animationType',
        type: 'select',
        label: '切换方式',
        props: {
          options: [
            { value: 'direct', label: '直接切换' },
            { value: 'carousel', label: '水平滑动' },
          ],
        },
      },
      {
        name: 'animationVelocity',
        type: 'select',
        label: '切换速度',
        props: {
          options: [
            { value: 'Linear', label: '匀速' },
            { value: 'Cubic.easeIn', label: '由慢至快' },
            { value: 'Cubic.easeOut', label: '由快至慢' },
            { value: 'Cubic.easeInOut', label: '贝塞尔曲线速度' },
          ],
        },
      },
      {
        name: 'tabAddressOption.carouselCycle',
        type: 'number',
        label: '轮播间隔',
        props: {
          unit: '毫秒',
          muiProps: {
            min: 0,
          },
        },
      },
      {
        name: 'animationDuration',
        type: 'number',
        label: '轮播动画时间',
        props: {
          unit: '毫秒',
          muiProps: {
            min: 0,
          },
        },
      },
      {
        name: 'isAutoChange',
        type: 'switch',
        label: '自动轮播',
        labelProps: {
          help: '自动轮播开启时，会和点击切换冲突',
        },
      },
    ],
  },
];

export default dictionary;
