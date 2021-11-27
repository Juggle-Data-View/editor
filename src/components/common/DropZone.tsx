import React, { useState, useEffect } from 'react';
import { useDropzone, DropzoneState } from 'react-dropzone';
import styled from 'styled-components';
import { Button, Classes, Position, Spinner, ControlGroup } from '@blueprintjs/core';
import { Popover2 } from '@blueprintjs/popover2';
import { FieldConfig, useField, useFormikContext } from 'formik';
import * as Api from 'utils/api';
import notice from 'utils/notice';

const DropZoneStyled = styled.section<{ hasUrl: boolean; isDragActive: boolean }>`
  .dropzone {
    position: relative;
    height: 0;
    padding-bottom: 45%;
    border-width: 1px;
    border-style: dashed;
    border-color: ${(props) => {
      const primary = props.theme.primary;
      if (props.isDragActive) {
        return primary;
      }
      if (props.hasUrl) {
        return 'rgba(255, 255, 255, 0.2)';
      }
      return props.theme.hoverPrimary;
    }};
    border-radius: 3px;
    background-color: ${(props) => props.theme.gray2};
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
      border-color: ${(props) => props.theme.primary};
    }
  }

  .loading {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: ${(props) => props.theme.gray2};
  }
`;

const PopoverContentStyled = styled.div`
  width: 200px;
  padding: 10px;
  line-height: 1.5;
  .btns {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
    button {
      margin-left: 5px;
    }
  }
`;

type IDropZone = FieldConfig;

const DropZone: React.FC<IDropZone> = (props) => {
  const [{ name, value }] = useField(props);
  const form = useFormikContext();
  const [url, setUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const _DEV_ = false; // true时使用blob地址

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
          notice.toast({ message: '图片超过500k，会导致页面加载变慢', intent: 'warning' });
        }

        /**
         * 注意：
         * dev模式下，没有使用`URL.revokeObjectURL`释放内存，如果在组件卸载时释放内存，再次载入组件，会找不到对应的图片。
         * 正式环境使用线上url，不存在此问题。
         */
        const imgUrl = _DEV_ ? URL.createObjectURL(file) : await Api.fetchImgUrl(file);

        change(imgUrl);
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
          {isLoading ? <Spinner className="loading" /> : null}
        </div>
      </div>
      <ControlGroup fill={true} style={{ marginTop: 5 }}>
        <input
          style={{ width: '100%' }}
          className={Classes.INPUT}
          defaultValue={url}
          onBlur={(e: React.ChangeEvent<HTMLInputElement>) => {
            const val = e.target.value;
            if (val !== value) {
              // 有值 & 值发生变化
              change(e.target.value);
            }
          }}
        />
        <Popover2
          position={Position.BOTTOM_RIGHT}
          minimal={true}
          content={
            <PopoverContentStyled>
              <p>确认要清空图片吗？清空后的图片不可恢复，只能重新上传哦~</p>
              <div className="btns">
                <Button small={true} className={Classes.POPOVER_DISMISS} text="取消" />
                <Button
                  small={true}
                  intent="danger"
                  className={Classes.POPOVER_DISMISS}
                  text="确认"
                  onClick={() => {
                    change('');
                  }}
                />
              </div>
            </PopoverContentStyled>
          }
        >
          <Button style={{ width: 36 }} icon="delete" disabled={!url} />
        </Popover2>
      </ControlGroup>
    </DropZoneStyled>
  );
};

export default DropZone;
