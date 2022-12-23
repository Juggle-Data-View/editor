import { ArrayHelpers, FieldConfig, FormikContextType, FormikConfig } from "formik";

import { IBaseNodeConfig, IBaseNodeConfigProps, INodeConfig, INodeParams } from "@juggle-data-view/types/src/form";

/**
 * 系统内部节点组件的props
 */
export interface INodeProps {
	node: INodeConfig;
	parentName: string;
	i18n?: "zh" | "en";
}

/**
 * 自定义组件的props类型
 */
export type INodeCompProps = Pick<FieldConfig, "name" | "validate"> & {
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
	render: React.ReactNode;
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
	onSubmit: FormikConfig<any>["onSubmit"];

	/**
	 * 自定义组件映射表
	 * key对应着配置项中的 type 字段
	 * value对应着一个自定义的组件
	 */
	mapping?: IFormikStatus["mapping"];
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

	i18n?: "zh" | "en";
}

export interface INodeLabel {
	node: INodeProps["node"];
	params: INodeParams;
	i18n?: "zh" | "en";
}
