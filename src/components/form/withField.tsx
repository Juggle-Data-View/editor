/**
 * 高阶组件，用于二次封装 formik 表单控件
 * --------------------------
 * 使用方法:
 * ```
 * interface InputTextProps {
 *   icon: React.ReactNode;
 * }
 * const InputText = withField<InputTextProps>((props) => {
 *   const { field, form, icon } = props; // props包含的属性
 *   // 自定义组件内容...
 * });
 * ```
 */

/**
 * ⚠️ 使用高阶组件而不使用 useField hooks 的原因：
 *  useField 目前没有提供类似 FastField 的能力，需要手动使用 useMemo 做性能优化。
 *  当二次封装的表单控件被应用于大型表单中时，会出现多次无效 rerender，为了避免性能消耗，才使用 FastField。
 */

import React, { ComponentType, FC } from 'react';
import { FastField, Field, FieldProps, FieldConfig } from 'formik';

export type InjectProps = Pick<FieldConfig, 'name' | 'validate'> & {
  /**
   * 是否使用 FastField 组件，默认开启。
   * 关于此组件的使用问题，见 Formik 官网：@see https://formik.org/docs/api/fastfield#when-to-use-fastfield-
   */
  useFastField?: boolean;
};

type Other = Pick<InjectProps, 'validate' | 'useFastField'>;

/**
 * 当自定义组件有特定的 校验 要求时，可以通过这个传递
 */
type OtherFieldProps<P = any> = ((props: P) => Other) | Other;

const has = (v: any) => typeof v !== 'undefined';

export function withField<P>(
  /**
   * 关于 Omit<FieldProps, 'meta'>
   * Field/FastField 组件向下传递的props中均没有meta,所以这里忽略掉
   * 如果需要使用meta，可以这样用：
   * ```
   * const { field, form, ...rest } = props;
   * const meta = form.getFieldMeta(field.name);
   * ```
   */
  Comp: ComponentType<P & Omit<FieldProps, 'meta'>>,
  otherProps?: OtherFieldProps<InjectProps & P>
): FC<InjectProps & P> {
  return (props) => {
    const other = typeof otherProps === 'function' ? otherProps(props) : otherProps;
    const { useFastField = true, ...rest } = props;
    const fast = other && has(other.useFastField) ? other.useFastField : useFastField;
    const F = fast ? FastField : Field;
    const fieldProps: FieldConfig = {
      ...rest,
    };
    if (other && has(other.validate)) {
      fieldProps.validate = other.validate;
    }
    return <F {...fieldProps} component={Comp} />;
  };
}
