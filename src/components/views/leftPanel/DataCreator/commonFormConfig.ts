import { INodeConfig } from 'auto-dv-type/src/form';

import { DataSourceType, HttpMethod } from 'config/const';

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
