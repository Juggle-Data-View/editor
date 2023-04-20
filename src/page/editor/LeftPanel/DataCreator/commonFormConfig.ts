import { INodeConfig } from '@juggle-data-view/types/src/form';

import { DataSourceType, HttpMethod } from '@configurableComponents/const';
import checkCustomerData from './checkCustomerData';

function isValidHttpUrl(url: string) {
  try {
    return !! new URL(url);
  } catch (_) {
    return false;
  }
}

const APIFormConfig: INodeConfig[] = [
  {
    name: 'url',
    type: 'text',
    label: {
      en: 'Request URL',
      zh: '请求地址'
    },
    validate: (value) => {
      if (!value) {
        return 'Url is required';
      }
      if(!isValidHttpUrl(value)){
        return 'Url is invalid';
      }
    },
  },
  {
    name: 'method',
    type: 'select',
    label: 'Request Method',
    props: {
      options: [
        {
          value: HttpMethod.GET,
          label: 'GET',
        },
        {
          value: HttpMethod.PATCH,
          label: 'PATCH',
        },
        {
          value: HttpMethod.POST,
          label: 'POST',
        },
        {
          value: HttpMethod.PUT,
          label: 'PUT',
        },
        {
          value: HttpMethod.DELETE,
          label: 'DELETE',
        },
      ],
    },
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

    props: () => {
      return {
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
      };
    },
  },
  {
    name: 'isProxy',
    type: 'switch',
    label: 'server proxy',
    labelProps: {
      help: 'It will be pass our serve if swith is opened',
    },
    show: ({ parentValue }) => {
      return parentValue.dataSourceType === DataSourceType.API;
    },
  },
  {
    name: '',
    type: 'fragment',
    children: APIFormConfig,
    show: ({ parentValue }) => {
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
    props: ()=>( {
      codeType: 'javascript',
      height: 300,
    }),
    validate: (values) => {
      if (values.dataSourceType === DataSourceType.Static) {
        const err = checkCustomerData(values.body);
        if (err) {
          return err.msg;
        }
      }
      return undefined;
    },
  },
];

export default commonFormConfig;
