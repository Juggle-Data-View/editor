import { withField } from './withField';
import { TextField, Box, Stack, Typography, InputBaseComponentProps } from '@mui/material';
import Cancel from '@mui/icons-material/CancelSharp';
import React, { useState } from 'react';
interface MultiTextProps {
  muiProps?: InputBaseComponentProps;
}

const Tag: React.FC<{ label: string }> = ({ label }) => {
  return (
    <Box
      sx={{
        background: '#ccc',
        height: '100%',
        display: 'flex',
        padding: '0.4rem',
        margin: '0 0.5rem 0 0',
        justifyContent: 'center',
        alignContent: 'center',
        color: '#ffffff',
      }}
    >
      <Stack direction="row" gap={1}>
        <Typography>{label}</Typography>
        <Cancel sx={{ cursor: 'pointer' }} />
      </Stack>
    </Box>
  );
};

export const MultiText = withField<MultiTextProps>((props) => {
  const { field, form, muiProps } = props;
  const [result, setResult] = useState<string[]>(field.value);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { key, currentTarget } = e;
    if (key !== 'Enter') {
      return;
    }
    const values = [...result, currentTarget.value];
    setResult(values);
    form.setFieldValue(field.name, values);
  };

  return (
    <TextField
      fullWidth
      variant="outlined"
      size="small"
      onKeyPress={handleKeyPress}
      inputProps={muiProps}
      InputProps={{
        startAdornment: (
          <Box sx={{ margin: '0 0.2rem 0 0', display: 'flex' }}>
            {result.map((data, index) => {
              return <Tag label={data} key={index} />;
            })}
          </Box>
        ),
      }}
    />
  );
});
