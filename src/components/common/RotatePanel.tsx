import React, { useState, useRef, useEffect, SyntheticEvent } from 'react';
import { NumericInput } from '@blueprintjs/core';
import styled from 'styled-components';
import { Row, Col } from 'react-simple-flex-grid';

const Container = styled.div`
  width: 100%;
  .input {
    width: 88px;
    margin-right: 10px;
  }
  .panel {
    margin-left: 8px;
    display: block;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: linear-gradient(0, #eee 100%, #999 0);
    position: relative;
    user-select: none;
    &::after {
      content: '';
      display: block;
      width: 4px;
      height: 4px;
      border-radius: 2px;
      background: #0b0c0d;
      position: absolute;
      top: 1px;
      left: 50%;
      margin-left: -2px;
    }
  }
  .text {
    margin-left: 10px;
  }
`;

export interface IRotatePanel {
  value: number;
  onChange: (angle: number) => void;
}

const RotatePanel: React.FC<IRotatePanel> = ({ value, onChange }) => {
  const [angle, setAngle] = useState<number>(value);
  const panelRef = useRef<HTMLDivElement>(null);
  const mousedownRef = useRef<any>(false);
  const panelCenter = useRef<any>({ x: 0, y: 0 });

  useEffect(() => {
    setAngle(value);
  }, [value]);

  useEffect(() => {
    if (panelRef && panelRef.current) {
      const { left, top, width, height } = panelRef.current.getBoundingClientRect();
      panelCenter.current = {
        x: left + width / 2,
        y: top + height / 2,
      };
    }
  }, []);

  const getAngle = (mouseX: number, mouseY: number) => {
    const delta = {
      x: mouseX - panelCenter.current.x,
      y: panelCenter.current.y - mouseY,
    };

    let degree = Math.atan2(delta.y, delta.x) / (Math.PI / 180) - 90;
    degree = -degree;

    const angle = Math.round(degree < 0 ? degree + 360 : degree);
    return angle;
  };

  const handleMouseDown = (e: MouseEvent) => {
    if (e.target === panelRef.current) {
      mousedownRef.current = true;
    }
  };

  const handldMouseMove = (e: MouseEvent) => {
    if (mousedownRef.current) {
      const angle = getAngle(e.pageX, e.pageY);
      setAngle(angle);
    }
  };

  const handleMouseUp = (e: MouseEvent) => {
    if (mousedownRef.current) {
      const angle = getAngle(e.pageX, e.pageY);
      onChange(angle);
    }

    mousedownRef.current = false;
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handldMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handldMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []); // eslint-disable-line

  return (
    <Container>
      <Row align="middle">
        <Col span={5}>
          <NumericInput
            value={angle}
            onValueChange={setAngle}
            onButtonClick={onChange}
            onBlur={(e: SyntheticEvent<HTMLInputElement>) => onChange(+e.currentTarget.value)}
            min={0}
            max={360}
            fill={true}
          />
        </Col>
        <Col>
          <div className="panel" ref={panelRef} style={{ transform: `rotate(${angle}deg)` }} />
        </Col>
      </Row>
    </Container>
  );
};

export default RotatePanel;
