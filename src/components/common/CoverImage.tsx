import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { Button } from '@blueprintjs/core';
import notice from 'utils/notice';
import { coverImageOnServer } from 'utils/api';
import { FieldConfig, useField, useFormikContext } from 'formik';
import { selectCanvas } from 'store/selectors';

const Container = styled.div`
  margin-bottom: 5px;
  .local {
    margin-left: 10px;
  }
`;

type CoverImageProps = FieldConfig;

const CoverImage: React.FC<CoverImageProps> = (props) => {
  const [{ name }] = useField(props);
  const form = useFormikContext();
  const [isServerloading, setIsServerLoading] = useState<boolean>(false);
  const canvas = useSelector(selectCanvas);

  const serverCoverImage = () => {
    const openUrl = `${window.location.href.split('?id')[0]}view?id${window.location.href.split('?id')[1]}`;
    setIsServerLoading(true);
    const options = {
      url: openUrl,
      width: canvas.width,
      height: canvas.height,
      quality: 100,
    };
    const headers = {
      'Content-Type': 'application/json',
      mycookie: `${document.cookie}`,
    };
    coverImageOnServer(options, headers)
      .then((res: any) => {
        setIsServerLoading(false);
        form.setFieldValue(name, res.imgDomain + res.url);
      })
      .catch((err: any) => {
        setIsServerLoading(false);
        notice.error(JSON.stringify(err));
      });
  };

  return (
    <Container>
      <Button
        loading={isServerloading}
        onClick={() => {
          serverCoverImage();
        }}
        icon="cloud"
      >
        点击截图
      </Button>
    </Container>
  );
};

export default CoverImage;
