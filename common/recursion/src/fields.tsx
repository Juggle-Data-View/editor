import React, { FC } from "react";
import { INodeCompProps } from "./types";
import { Control } from "@forms/index";
import CustomArray from "./widget/CustomArray";
import DynamicMultiField from "./widget/DynamicMultiField";
import DropZone from "@components/common/DropZone";

/**
 * 使用高阶函数包裹自定义组件
 * T：自定义组件的props
 */
export function withNode<T>(Comp: FC<T & INodeCompProps>): FC<INodeCompProps & T> {
	/** 此时，node的类型为 INodeCompProps & T */
	return (node) => <Comp {...node} />;
}

/**
 * 如果组件不想被包裹，可以直接声明 INodeCompProps & <组件类型> 即可
 */
const Fragment = (node: INodeCompProps) => {
	return <>{node.children}</>;
};

const Node: React.FC<
	React.PropsWithChildren<
		INodeCompProps & {
			render: React.ReactNode | ((props: INodeCompProps) => React.ReactNode);
		}
	>
> = (node) => {
	const { render, ...nodeCompProps } = node;
	return <>{typeof node.render === "function" ? node.render(nodeCompProps) : node.render}</>;
};

const CustomComponent = withNode(Node);

export const nodeMapping = {
	text: withNode(Control.InputText),
	number: withNode(Control.InputNumber),
	textarea: withNode(Control.Textarea),
	color: withNode(Control.Color),
	collapse: withNode(Control.Collapse),
	fragment: Fragment,
	switch: withNode(Control.Switch),
	select: withNode(Control.Select),
	radio: withNode(Control.Radio),
	// checkbox: withNode(Control.Checkbox),
	range: withNode(Control.Range),
	component: CustomComponent,
	array: CustomArray,
	dynamciMultiField: DynamicMultiField,
	angle: withNode(Control.Angle),
	formatter: withNode(Control.Formatter),
	uploadImage: DropZone,
	datePicker: withNode(Control.DatePicker),
};
