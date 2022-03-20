import { INodeConfig } from 'components/recursion';
import { DataSourceType } from 'config/const';

const APIFormConfig: INodeConfig[] = [
  {
    name: 'url',
    type: 'text',
    label: 'Request URL',
    validate: (value) => {
      if (!value) {
        return 'Url is required';
      }
    },
  },
  {
    name: 'method',
    type: 'select',
    label: 'Request Method',
  },
  {
    name: 'header[]',
    type: 'dynamciMultiField',
    props: {
      childrenOperations: [
        {
          value: 'add',
        },
        {
          value: 'delete',
        },
      ],
    },
    label: 'Request Headers',

    children: [
      {
        name: 'key',
        type: 'text',
        props: {
          muiProps: {
            placeholder: 'Header key',
          },
        },
      },
      {
        name: 'value',
        type: 'text',
        props: {
          muiProps: {
            placeholder: 'Header value',
          },
        },
      },
    ],
  },
];

const commonFormConfig: INodeConfig[] = [
  {
    name: 'name',
    type: 'text',
    label: 'Datasource name',
    validate: (value) => (value ? undefined : 'Name is required'),
  },
  {
    name: 'dataSourceType',
    type: 'select',
    label: 'Datasource type',
    props: {
      options: [
        {
          label: 'Static',
          value: 0,
        },
        {
          label: 'API',
          value: 1,
        },
      ],
    },
  },

  {
    name: '',
    type: 'fragment',
    children: APIFormConfig,
    show: ({ parentValue }) => {
      console.log(parentValue, parentValue.dataSourceType === DataSourceType.API);
      return parentValue.dataSourceType === DataSourceType.API;
    },
  },
  {
    name: '',
    type: 'fragment',
    children: [],
    show: ({ parentValue }) => parentValue.dataSourceType === DataSourceType.CSV,
  },
  {
    name: 'body',
    type: 'formatter',
    labelProps: {
      vertical: true,
    },
    props: {
      codeType: 'javascript',
    },
  },
];

export default commonFormConfig;
