import React from 'react';
import styled from 'styled-components';
import { Colors } from '@blueprintjs/core';
import TextTip, { ITextTip } from 'components/common/TextTip';

const Container = styled.div.attrs<Partial<IFieldLabel>>(({ vertical }) => {
  return {
    // field-wrap 名称不要随便更换，在 Collapse 组件中有嵌套使用
    className: vertical ? '--vertical' : 'field-wrap',
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
      color: ${(props) => props.theme.danger || Colors.RED3};
      line-height: 1.25;
    }

    // 使控件与左侧文字始终保持对齐
    .bp3-switch,
    .bp3-checkbox,
    .bp3-radio {
      min-height: 30px;
      display: flex;
      align-items: center;
      .bp3-control-indicator {
        margin-top: 1px; // 解决控件与文字上下不对齐的问题
      }
      &.bp3-inline {
        display: inline-flex;
        margin: 0 10px 0 0;
      }
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
  help?: ITextTip['text'];
  width?: React.CSSProperties['width'];
  className?: string;
  tipWidth?: React.CSSProperties['width'];
}

export const FieldLabel: React.FC<IFieldLabel> = (props) => {
  const { label, vertical, help, width, children, className, tipWidth } = props;
  return (
    <Container className={className} vertical={!!vertical}>
      <div className="item-label" style={{ width: vertical ? '100%' : width }}>
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
  label: IFieldLabel['label'];
  /** 表单字段组件属性 */
  labelProps?: Omit<IFieldLabel, 'label'>;
}

/**
 * 返回被`FieldLabel`包裹的组件
 * @param P `Comp`组件的`props`
 * @param IField `FieldLabelProps`
 */
export function withFieldLabel<P>(Comp: React.ComponentType<P>): React.FC<P & IField> {
  return (props) => {
    const { label, labelProps, ...controlProps } = props;
    return (
      <FieldLabel label={label} {...labelProps}>
        <Comp {...(controlProps as P)} />
      </FieldLabel>
    );
  };
}
