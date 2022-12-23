import styled from "styled-components";
import TextTip, { ITextTip } from "../TextTip";
import React from "react";

const Container = styled.div.attrs<Partial<IFieldLabel>>(({ vertical }) => {
	return {
		// field-wrap 名称不要随便更换，在 Collapse 组件中有嵌套使用
		className: vertical ? "--vertical" : "field-wrap",
	};
})<Partial<IFieldLabel>>`
	display: flex;
	flex-flow: row wrap;
	margin: 10px 0;
	padding: 0 10px;
	.item-label {
		width: 30%;
		flex: none;
		padding-right: 10px;
		overflow: hidden;

		label {
			display: inline-flex;
			align-items: center;
			height: 30px; // 30px来源：右侧inputText控件的高度普遍都是30px
			line-height: 1.25;
		}
	}
	.item-control {
		flex: 1;

		// 校验错误信息样式
		.error {
			margin-top: 3px;
			line-height: 1.25;
		}
	}

	&.--vertical {
		flex-direction: column;
		.item-control {
			margin-top: 3px;
			width: 100%;
		}
	}
`;

export interface IFieldLabel {
	label: React.ReactNode;
	vertical?: boolean; // 是否上下布局，默认左右
	help?: ITextTip["text"];
	width?: React.CSSProperties["width"];
	className?: string;
	tipWidth?: React.CSSProperties["width"];
}

export const FieldLabel: React.FC<React.PropsWithChildren<IFieldLabel>> = (props) => {
	const { label, vertical, help, width, children, className, tipWidth } = props;
	return (
		<Container className={className} vertical={!!vertical}>
			<div className="item-label" style={{ width: vertical ? "100%" : width }}>
				<label>
					{label}
					{help ? <TextTip text={help} tipWidth={tipWidth} /> : null}
				</label>
			</div>
			<div className="item-control">{children}</div>
		</Container>
	);
};

interface IField {
	/** 表单字段名称 */
	label: IFieldLabel["label"];
	/** 表单字段组件属性 */
	labelProps?: Omit<IFieldLabel, "label">;
}

/**
 * 返回被`FieldLabel`包裹的组件
 * @param P `Comp`组件的`props`
 * @param IField `FieldLabelProps`
 */
export function withFieldLabel<P>(Comp: React.FunctionComponent<React.PropsWithChildren<P>>): React.FC<React.PropsWithChildren<P & IField>> {
	return (props) => {
		const { label, labelProps, ...controlProps } = props;
		return (
			<FieldLabel label={label} {...labelProps}>
				<Comp {...(controlProps as P)} />
			</FieldLabel>
		);
	};
}
