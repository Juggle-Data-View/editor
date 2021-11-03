/**
 * 导出包含label的表单控件组件
 */

import { withFieldLabel } from './FieldLabel';
import * as Control from './Control';

export const Text = withFieldLabel(Control.InputText);
export const MultiText = withFieldLabel(Control.MultiText);
export const Textarea = withFieldLabel(Control.Textarea);
export const Number = withFieldLabel(Control.InputNumber);
export const Switch = withFieldLabel(Control.Switch);
export const Radio = withFieldLabel(Control.Radio);
export const Select = withFieldLabel(Control.Select);
export const Checkbox = withFieldLabel(Control.Checkbox);
export const Color = withFieldLabel(Control.Color);
export const Range = withFieldLabel(Control.Range);
export const MultiRange = withFieldLabel(Control.MultiRange);
export const Angle = withFieldLabel(Control.Angle);
