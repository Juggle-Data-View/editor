import { TagInput, TagInputProps } from '@blueprintjs/core';
import { withField } from './withField';

interface MultiTextProps {
  muiProps?: Pick<TagInputProps, 'placeholder' | 'separator'>;
}

export const MultiText = withField<MultiTextProps>((props) => {
  const { field, form, muiProps } = props;

  return (
    <TagInput
      {...muiProps}
      values={field.value}
      addOnBlur
      onChange={(values) => {
        form.setFieldValue(field.name, values);
      }}
    />
  );
});
