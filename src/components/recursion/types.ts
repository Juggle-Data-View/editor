import { FieldValidator, ArrayHelpers, FieldConfig, FormikContextType, FormikConfig, FormikHelpers } from 'formik';
import { nodeMapping } from './fields';
import { IFieldLabel } from 'components/form/FieldLabel';

interface IBaseNodeConfig<P = any> {
  /**
   * 节点数据标识，数据定义类似路径：
   * - `'a'`，普通文本，没有任何其他标识符
   * - `''`，空值，节点在数据上不需要有层级，仅UI有变化时使用，如：`Fragment`
   * - `'../a'`，相对路径，数据与UI异构时使用频繁
   * - `'#/a/b/c'`，绝对路径
   */
  name: string;
  /** 表单左侧文本，如果不设置，表单控件组件会顶到左侧 */
  label?: React.ReactNode | ((fieldProps: INodeParams) => React.ReactNode) | { [key in AutoDV.Editor['lang']]: string };
  /** 左侧文本属性，有传递给子组件的功能 */
  labelProps?: Omit<IFieldLabel, 'label'>;
  /** 节点默认值，使用 utils.getDefaultValues 时需要使用 */
  default?: unknown;
  /** 节点其他属性，具体请参考组件的定义 */
  props?: P | ((fieldProps: INodeParams) => P);
  /** 校验函数 */
  validate?: FieldValidator[] | ((value: any, fieldProps: INodeParams) => ReturnType<FieldValidator>);
  /** 返回新的节点数据 */
  getValue?: (value: any) => unknown;
  /** 数据发生变更时触发的事件 */
  onChange?: (fieldProps: INodeParams) => void;
  /** 当前节点在表单的视图是否展示，返回true时展示 */
  show?: (showProps: INodeParams) => boolean;

  /**
   * [废弃: 与 shouldRender 逻辑冲突]
   * 如果返回true，删除当前节点的数据，返回true时移除数据。
   */
  // remove?: (fieldProps: INodeParams) => boolean;
}

/**
 * 配置项中函数参数的类型
 */
export interface INodeParams {
  /** 当前节点的完整`name` */
  name: string;
  /** 父节点的name，通过父节点可以获取节点结构上的值 */
  parentName: string;
  /** 当前节点数据 */
  value: any;
  /** 数据结构上的父数据 */
  parentValue: any;
  /** 表单数据，传入的values */
  rootValue: any;

  oldValue: any;

  setValue: FormikHelpers<any>['setFieldValue'];
  /**
   * 根据name获取数据，path的解析方式如 resolveName 函数
   */
  getValue: (name: string, path?: string) => any;
}

// `T`：额外的自定义组件类型，`nodeMapping`的自定义扩展
export type INodeConfig<T = unknown> = Expand<typeof nodeMapping & T>;

/**
 * 系统内部节点组件的props
 */
export interface INodeProps {
  node: INodeConfig;
  parentName: string;
  i18n?: 'zh' | 'en';
}

/**
 * 自定义组件的props类型
 */
export type INodeCompProps = Pick<FieldConfig, 'name' | 'validate'> & {
  defaultValues: any;
  arrayHelpers?: ArrayHelpers;
  children?: React.ReactNode;
};

export interface IFormikStatus {
  defaultValues: any;
  mapping: Record<string, React.ReactElement>;
  requiredText?: React.ReactNode;
  submitSuccess: boolean;
}

// 传入组件类型（T），返回组件props类型
type GetCompProps<T> = T extends React.ComponentType<infer P> | React.Component<infer P> ? P : never;

/**
 * 声明`IBaseNodeConfig`中`props`需要的类型
 * 1.取出`nodeMapping`的值（组件，如：`Control.InputText`）的`props`类型
 * 2.忽略掉递归逻辑中定义的类型，这样可以保证`config`中只能看到组件自身的`props`
 */
type IBaseNodeConfigProps<T> = Omit<GetCompProps<T>, keyof INodeCompProps>;

// node mapping to node type
type M2N<K, T> = K extends keyof T
  ? IBaseNodeConfig<IBaseNodeConfigProps<T[K]>> & {
      /** 节点类型 */
      type: K;
      /** 子节点 */
      children?: Expand<T>[];
    }
  : never;

type Expand<T> = M2N<keyof T, T>;

export interface ChildProps {
  render: () => React.ReactNode;
  formik: FormikContextType<any>;
}

export interface IGenerator {
  /** 配置项 */
  config: INodeConfig | INodeConfig[];
  /** 配置项对应的数据 */
  values: any;
  /** 默认数据，区别于 values，这份数据在表单内部是不可变的 */

  /**
   * 默认数据
   * 区别于 values，这份数据在表单内部是不可变的
   * 一般情况下不需要，如果有数组组件需要做新增操作，可以使用此配置
   */
  defaultValues?: any;
  /** 表单数据经过修改、验证通过后的回调函数 */
  onSubmit: FormikConfig<any>['onSubmit'];

  /**
   * 自定义组件映射表
   * key对应着配置项中的 type 字段
   * value对应着一个自定义的组件
   */
  mapping?: IFormikStatus['mapping'];
  /**
   * 是否自动提交，默认开启。
   * 如果需要手动提交，可以关闭此项。
   */
  autoSubmit?: boolean;

  /**
   * Formik表单库的其他配置
   * 这里可以覆盖 enableReinitialize
   */
  formikProps?: FormikConfig<any>;

  /**
   * 自定义起始路径
   */
  parentName?: string;

  onVaildate?: (isValid: boolean) => void;

  children?: (props: ChildProps) => React.ReactNode;

  i18n?: 'zh' | 'en';
}

export interface INodeLabel {
  node: INodeProps['node'];
  params: INodeParams;
  i18n?: 'zh' | 'en';
}
