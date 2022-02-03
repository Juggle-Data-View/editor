import React, { useState, useEffect } from 'react';
import { useDropzone, DropzoneState } from 'react-dropzone';
import styled from 'styled-components';
import { TextField } from '@mui/material';
import { CircularProgress } from '@mui/material';
import { FieldConfig, useField, useFormikContext } from 'formik';
import notice from 'utils/notice';

const DropZoneStyled = styled.section<{ hasUrl: boolean; isDragActive: boolean }>`
  .dropzone {
    position: relative;
    height: 0;
    padding-bottom: 45%;
    border-width: 1px;
    border-style: dashed;
    background: rgba(34, 34, 34, 0.15);
    border-radius: 3px;
    outline: none;
    transition: border 0.24s ease-in-out;
    line-height: 1.25;
    .inner {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      > img {
        max-width: 100%;
        max-height: 100%;
      }
      > p {
        padding: 0 15px;
        cursor: default;
      }
    }
    &:hover {
    }
  }

  .loading {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
`;

type IDropZone = FieldConfig;

const DropZone: React.FC<IDropZone> = (props) => {
  const [{ name, value }] = useField(props);
  const form = useFormikContext();
  const [url, setUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setUrl(value);
  }, [value]);

  const change = (val: string) => {
    setUrl(val);
    form.setFieldValue(name, val);
    form.setFieldTouched(name, true);
  };

  const { getRootProps, getInputProps, isDragActive }: DropzoneState = useDropzone({
    accept: 'image/*',
    multiple: false, // 指定单选拖拽
    onDrop: async (acceptedFiles: File[], rejectedFiles) => {
      try {
        setIsLoading(true);
        if (rejectedFiles.length) {
          throw new Error('只能拖拽1个文件');
        }
        const file = acceptedFiles[0];
        if (file.size > 1024 * 1024 * 5) {
          throw new Error('图片不能超过5M');
        }
        if (file.size > 1024 * 500) {
          notice.warn('图片超过500k，会导致页面加载变慢');
        }
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => change(fileReader.result as string);
      } catch (error) {
        if (error instanceof Error) {
          const errMsg = error.message || 'Error: DropZone onDrop invoke error';
          notice.error(errMsg);
        }
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <DropZoneStyled hasUrl={!!url} isDragActive={isDragActive}>
      <div className="dropzone" {...getRootProps()}>
        <div className="inner">
          <input {...getInputProps()} />
          {url ? <img alt="preview" src={url} /> : <p>将文件拖到此处，或点击上传</p>}
          {isLoading ? <CircularProgress /> : null}
        </div>
      </div>

      <TextField
        fullWidth
        size="small"
        style={{
          marginTop: '5px',
        }}
        defaultValue={url}
        onBlur={(e) => {
          const val = e.target.value;
          if (val !== value) {
            // 有值 & 值发生变化
            change(e.target.value);
          }
        }}
      />
    </DropZoneStyled>
  );
};

export default DropZone;
