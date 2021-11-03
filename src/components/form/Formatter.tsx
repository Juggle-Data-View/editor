import React from 'react';
import { withField } from './withField';
import CodeEditor, { ModeName } from 'components/common/CodeEditor';

export interface IFormatter {
  codeType: ModeName;
  onSubmit?: (value: string) => void;
}

export const Formatter = withField<IFormatter>((props) => {
  const { field, form, codeType, onSubmit } = props;

  return (
    <CodeEditor
      value={field.value}
      options={{
        mode: codeType,
        lint: false, // TODO: JS的Lint校验先用`new Function`，后期换成JSHint
      }}
      onSubmit={(value) => {
        form.setFieldValue(field.name, value);
        form.setFieldTouched(field.name, true);
        onSubmit && onSubmit(value);
      }}
      height={120}
    />
  );
});
