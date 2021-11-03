import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div<{ visible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: ${(props) => (props.visible ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background: rgba(0, 0, 0, 0.9);
  color: #fff;
  font-size: 14px;
  > .icon {
    margin-top: -70px;
    width: 40px;
    height: 48px;
  }
  > .inputWrap {
    margin: 1.6em 0 0;
    input,
    button {
      height: 2.8em;
      border: none;
      vertical-align: top;
    }
    input {
      width: 12em;
      text-indent: 0.5em;
      border-radius: 3px 0 0 3px;
    }
    button {
      width: 4.2em;
      background-color: ${(props) => props.theme.primary};
      color: #fff;
      font-weight: bold;
      border-radius: 0 3px 3px 0;
      cursor: pointer;
      &:hover {
        opacity: 0.9;
      }
    }
  }
`;

interface IProps {
  visible: boolean;
  onSubmit: (inputValue: string) => void;
}

const PasswordMask = (props: IProps) => {
  const { visible, onSubmit } = props;
  const [inputValue, setInputValue] = useState<string>('');
  return (
    <Container visible={visible}>
      <div className="icon" />
      <div className="inputWrap">
        <input
          type="password"
          value={inputValue}
          placeholder="请输入访问密码"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setInputValue(e.currentTarget.value);
          }}
        />
        <button onClick={() => onSubmit(inputValue)}>确定</button>
      </div>
    </Container>
  );
};

export default PasswordMask;
