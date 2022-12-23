// 引入 Field 组件的 props 类型
type FieldConfig = import('formik').FieldConfig;

/**
 * 表单控件组件基础props
 */
interface ControlProps {
  name: FieldConfig['name'];
  validate?: FieldConfig['validate'];
}
