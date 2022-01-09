import { useState, useEffect, useRef } from 'react';
import { Button, Icon } from '@blueprintjs/core';
import styled from 'styled-components';
import { Row, Col } from 'react-simple-flex-grid';
import { useField } from 'formik';
import { withFieldLabel } from 'components/form/index';
import { NumberStyled } from 'components/form/InputNumber';
import { InputBaseComponentProps } from '@mui/material';

interface IAspectWrap {
  lock: boolean;
}

const AspectWrap = styled.div.attrs<IAspectWrap>((props) => {
  return {
    className: props.lock ? '--lock' : '',
  };
})<IAspectWrap>`
  position: relative;
  margin-top: 3px;
  min-width: 30px;
  flex: none;
  text-align: center;
  &.--lock {
    &:before,
    &:after {
      position: absolute;
      content: '';
      top: 50%;
      width: 30%;
      height: 2px;
    }
    &:before {
      left: 0;
    }
    &:after {
      right: 0;
    }
  }
`;

interface IFieldSize {
  widthName: string;
  heightName: string;
  lockName?: string;
}

const Size = ({ widthName, heightName, lockName }: IFieldSize) => {
  const [isLock, setIsLock] = useState(false);
  const [widthField, , widthHelpers] = useField(widthName);
  const [heightField, , heightHelpers] = useField(heightName);
  const [lockField, , lockHelpers] = useField(lockName || '#');
  const [widthValue, setWidthValue] = useState(widthField.value);
  const [heightValue, setHeightValue] = useState(heightField.value);
  const debounceRef = useRef<any>(-1);
  const ratioRef = useRef(1);

  useEffect(() => {
    if (isLock) {
      ratioRef.current = widthField.value / heightField.value;
    }
  }, [isLock]); // eslint-disable-line

  // 根据field value，初始化组件内部状态
  useEffect(() => {
    setWidthValue(widthField.value);
    setHeightValue(heightField.value);
    if (lockName) {
      setIsLock(lockField.value);
    }
  }, [widthField.value, heightField.value, lockName, lockField.value]);

  const commonProps: InputBaseComponentProps = {
    asyncControl: true,
    fill: true,
  };

  return (
    <Row>
      <Col span={5}>
        <NumberStyled
          prefix="宽"
          inputProps={commonProps}
          size="small"
          value={widthValue}
          onChange={(e) => {
            const val = Number(e.target.value);
            setWidthValue(val);
            const _heightValue = Math.round(val / ratioRef.current);
            if (isLock) {
              setHeightValue(_heightValue);
            }
            // 连续点击时有200ms的延迟
            clearTimeout(debounceRef.current);
            debounceRef.current = setTimeout(() => {
              widthHelpers.setValue(val);
              if (isLock) {
                heightHelpers.setValue(_heightValue);
              }
            }, 200);
          }}
          onBlur={(e) => {
            const val = +e.currentTarget.value;
            widthHelpers.setValue(val);
            if (isLock) {
              heightHelpers.setValue(Math.round(val / ratioRef.current));
            }
          }}
        />
      </Col>
      <Col span={2}>
        <AspectWrap lock={isLock}>
          <Button
            minimal={true}
            style={{ width: 24, height: 24, padding: 0, minWidth: 20, minHeight: 20 }}
            icon={<Icon icon={isLock ? 'lock' : 'unlock'} iconSize={12} />}
            intent={isLock ? 'primary' : 'none'}
            onClick={() => {
              setIsLock(!isLock);
              if (lockName) {
                lockHelpers.setValue(!isLock);
              }
            }}
          />
        </AspectWrap>
      </Col>
      <Col span={5}>
        <NumberStyled
          inputProps={commonProps}
          size="small"
          value={heightValue}
          onChange={(e) => {
            const val = Number(e.target.value);
            const _widthValue = Math.round(val * ratioRef.current);
            if (isLock) {
              setWidthValue(_widthValue);
            }
            // 连续点击时有200ms的延迟
            clearTimeout(debounceRef.current);
            debounceRef.current = setTimeout(() => {
              heightHelpers.setValue(val);
              if (isLock) {
                widthHelpers.setValue(_widthValue);
              }
            }, 200);
          }}
          onBlur={(e) => {
            const val = +e.currentTarget.value;
            heightHelpers.setValue(val);
            if (isLock) {
              widthHelpers.setValue(Math.round(val * ratioRef.current));
            }
          }}
        />
      </Col>
    </Row>
  );
};

export default withFieldLabel(Size);
