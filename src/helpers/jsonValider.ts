/**
 * 校验数据是否符合组件配置的规范.
 */

import Ajv, { ErrorObject } from 'ajv';

/**
 * 描述组件配置的`JSON Schema`描述文件.
 * 用于导入json时配合ajv做json格式校验
 *  - ajv: https://github.com/ajv-validator/ajv
 *  - jsonToSchema工具: https://techbrij.com/brijpad/#json
 */
const COMP_JSON_SCHEMA = {
  required: ['title', 'attr', 'config', 'code', 'compTempCode', 'compCode', 'alias'],
  properties: {
    title: {
      $id: '#/properties/title',
      type: 'string',
    },
    subComponents: {
      $id: '#/properties/subComponents',
      type: 'array',
      properties: {},
    },
    attr: {
      required: ['left', 'top', 'width', 'height'],
      properties: {
        left: {
          $id: '#/properties/attr/properties/left',
          type: 'integer',
        },
        top: {
          $id: '#/properties/attr/properties/top',
          type: 'integer',
        },
        width: {
          $id: '#/properties/attr/properties/width',
          type: 'integer',
        },
        height: {
          $id: '#/properties/attr/properties/height',
          type: 'integer',
        },
      },
      $id: '#/properties/attr',
      type: 'object',
    },
    config: {
      required: [],
      properties: {},
      $id: '#/properties/config',
      type: 'object',
    },
    code: {
      $id: '#/properties/code',
      type: 'string',
    },
    compTempCode: {
      $id: '#/properties/compTempCode',
      type: 'string',
    },
    compCode: {
      $id: '#/properties/compCode',
      type: 'string',
    },
    alias: {
      $id: '#/properties/alias',
      type: 'string',
    },
  },
  $id: 'http://example.org/root.json#',
  type: 'object',
  definitions: {},
  $schema: 'http://json-schema.org/draft-07/schema#',
};

const APP_JSON_SCHEMA = {
  required: ['name', 'spaceId', 'components', 'exportTime'],
  properties: {
    name: {
      $id: '#/properties/name',
      type: 'string',
    },
    spaceId: {
      $id: '#/properties/spaceId',
      type: 'integer',
    },
    components: {
      $id: '#/properties/components',
      type: 'array',
    },
    exportTime: {
      $id: '#/properties/exportTime',
      type: 'string',
    },
    canvas: {
      required: ['backgroundColor', 'backgroundImg', 'height', 'thumbnail', 'width', 'zoomType'],
      properties: {
        backgroundColor: {
          $id: '#/properties/canvas/properties/backgroundColor',
          type: 'string',
        },
        backgroundImg: {
          $id: '#/properties/canvas/properties/backgroundImg',
          type: 'string',
        },
        height: {
          $id: '#/properties/canvas/properties/height',
          type: 'integer',
        },
        thumbnail: {
          $id: '#/properties/canvas/properties/thumbnail',
          type: 'string',
        },
        width: {
          $id: '#/properties/canvas/properties/width',
          type: 'integer',
        },
        zoomType: {
          $id: '#/properties/canvas/properties/zoomType',
          type: 'integer',
        },
      },
      $id: '#/properties/canvas',
      type: 'object',
    },
  },
  $id: 'http://example.org/root.json#',
  type: 'object',
  definitions: {},
  $schema: 'http://json-schema.org/draft-07/schema#',
};

interface IValider {
  success: boolean;
  message: string;
  error: null | Array<ErrorObject>;
}

export const valider = (schema: any, data: unknown): IValider => {
  // options can be passed, e.g. {allErrors: true}
  const ajv = new Ajv({ allErrors: true });
  // 开始校验
  const valid = ajv.validate(schema, data);
  // 判定校验结果
  if (valid) {
    return {
      success: true,
      message: '校验通过',
      error: null,
    };
  }
  return {
    success: false,
    message: '校验失败',
    error: ajv.errors as Array<ErrorObject>,
  };
};

// 校验组件
export const validComp = (data: unknown) => valider(COMP_JSON_SCHEMA, data);

// 校验 appConfig
export const validApp = (data: unknown) => valider(APP_JSON_SCHEMA, data);
