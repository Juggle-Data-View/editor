import React from 'react';
import { TagInput, TagInputProps } from '@blueprintjs/core';
import { withField } from './withField';

interface MultiTextProps {
  bp?: Pick<TagInputProps, 'placeholder' | 'separator'>;
}

export const MultiText = withField<MultiTextProps>((props) => {
  const { field, form, bp } = props;

  return (
    <TagInput
      {...bp}
      values={field.value}
      addOnBlur
      onChange={(values) => {
        form.setFieldValue(field.name, values);
      }}
    />
  );
});
