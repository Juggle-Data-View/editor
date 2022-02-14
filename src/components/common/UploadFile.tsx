import React, { useState } from 'react';
import { useDropzone, DropzoneState } from 'react-dropzone';
import styled, { DefaultTheme } from 'styled-components';
import notice from 'utils/notice';
import * as Api from 'utils/api';

interface IContainer extends Partial<DropzoneState> {
  theme: DefaultTheme;
}

interface IProps {
  onUploaded: (path: string) => void;
}

const Container = styled.div<IContainer>`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 25px 20px;
  border-width: 1px;
  border-radius: 3px;
  border-style: dashed;
  background-color: #eee;
  color: #bdbdbd;
  outline: none;
  transition: border 0.24s ease-in-out;
  line-height: 1.25;

  &:hover {
  }
`;

const UploadFile: React.FC<IProps> = (props) => {
  const { onUploaded } = props;
  const [file, setFile] = useState<File | null>(null);
  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject, isFocused } = useDropzone({
    accept: '.csv',
    multiple: false,
    onDropAccepted: async (acceptedFiles: File[]) => {
      try {
        const file = acceptedFiles[0];
        const res = await Api.uploadCSV(file);
        onUploaded(res.downloadUrl);
        setFile(file);
      } catch (error) {
        if (error instanceof Error) notice.error(error.message);
      }
    },
    onDropRejected(files, event) {
      notice.warn('Drop Error: onDropRejected');
    },
    ...props,
  });

  return (
    <Container {...getRootProps({ isDragActive, isDragAccept, isDragReject, isFocused })}>
      <input {...getInputProps()} />
      <p>{file ? `${file.name} - ${file.size} bytes` : '将文件拖到此处，或点击上传'}</p>
    </Container>
  );
};

export default UploadFile;
