import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { TextField } from '@mui/material';
import Alignment from 'components/common/Alignment';
import { selectedRectSelector } from 'helpers/selectors';
import { FieldLabel } from 'components/form';
import { appAction } from 'store/features/appSlice';
import { selectJuggleDV } from 'store/selectors';
import { JuggleDV } from '@juggle-data-view/types';

const InputContainer = styled.div`
  position: relative;
  .prefix {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 1px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
  }
  input {
    padding-left: 24px;
  }
`;

interface InputProps {
  rectKey: keyof Omit<JuggleDV.Rect, 'rotation'>;
  selectedRect: JuggleDV.Rect;
  prefix?: string;
}

const Input = (props: InputProps) => {
  const { rectKey, selectedRect, prefix } = props;
  const value = selectedRect[rectKey];
  const [inputValue, setInputValue] = useState(value);
  const debounceRef = useRef<any>(-1);
  const dispatch = useDispatch();

  const handleChange = (key: keyof JuggleDV.Rect, val: number) => {
    const offset = {
      left: 0,
      top: 0,
      width: 0,
      height: 0,
      [key]: val,
    };
    dispatch(appAction.updateCompRect({ offset }));
  };

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  return (
    <InputContainer>
      {prefix && <span className="prefix">{prefix}</span>}
      <TextField
        fullWidth
        type="number"
        value={inputValue}
        onChange={(e) => {
          const val = Number(e.target.value);
          setInputValue(val);
          clearTimeout(debounceRef.current);
          debounceRef.current = setTimeout(() => {
            handleChange(rectKey, val - value);
          }, 300);
        }}
        onBlur={(e) => handleChange(rectKey, +e.target.value - value)}
      />
    </InputContainer>
  );
};

const MultiProps = () => {
  const state = useSelector(selectJuggleDV);
  const selectedRect = selectedRectSelector(state);
  return (
    <>
      <div className="panel-head">多选设置</div>
      <div className="panel-body">
        <div style={{ padding: '10px 10px 5px 10px' }}>
          <h5 style={{ marginBottom: 5 }}>组件与组件对齐</h5>
          <Alignment />
        </div>
        <FieldLabel label="组件位置">
          <div style={{ display: 'flex' }}>
            <Input prefix="X" selectedRect={selectedRect} rectKey="left" />
            <span style={{ width: 20 }} />
            <Input prefix="Y" selectedRect={selectedRect} rectKey="top" />
          </div>
        </FieldLabel>
        <FieldLabel label="组件宽高">
          <div style={{ display: 'flex' }}>
            <Input prefix="宽" selectedRect={selectedRect} rectKey="width" />
            <span style={{ width: 20 }} />
            <Input prefix="高" selectedRect={selectedRect} rectKey="height" />
          </div>
        </FieldLabel>
      </div>
    </>
  );
};

export default MultiProps;
