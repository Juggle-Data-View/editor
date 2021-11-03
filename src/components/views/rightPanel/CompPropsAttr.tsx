/**
 * 右侧面板-选中组件-公共配置
 */
import React from 'react';
import Alignment from 'components/common/Alignment';
import AttrScale from 'components/common/AttrScale';
import { Row, Col } from 'react-simple-flex-grid';
import FieldSize from 'components/common/FieldSize';
import { FieldLabel, Control, Field } from 'components/form/index';

// 新版组件公共配置
const CompPropsAttr: React.FC<AutoDV.PropsCompProps> = (props) => {
  const labelProps = {
    width: 80,
  };
  return (
    <div className="comp-attr">
      <Alignment />
      <div className="mt10">
        <FieldLabel label="组件位置" {...labelProps}>
          <Row>
            <Col span={5}>
              <Control.InputNumber name="attr.left" bp={{ fill: true }} prefix="X" />
            </Col>
            <Col span={2} />
            <Col span={5}>
              <Control.InputNumber name="attr.top" bp={{ fill: true }} prefix="Y" />
            </Col>
          </Row>
        </FieldLabel>
        <FieldSize
          label="组件宽高"
          labelProps={labelProps}
          widthName="attr.width"
          heightName="attr.height"
          lockName="attr.lock"
        />
        <FieldLabel label="组件旋转" {...labelProps}>
          <Row style={{ height: '100%' }}>
            <Col span={5}>
              <Control.InputNumber name="attr.angle" bp={{ fill: true }} />
            </Col>
            <Col span={2} style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Control.Angle name="attr.angle" size={24} />
            </Col>
            <Col span={5} style={{ height: '100%' }}>
              <AttrScale name="attr.scale" />
            </Col>
          </Row>
        </FieldLabel>
        <Field.Range
          label="透明度"
          labelProps={labelProps}
          name="attr.opacity"
          range={[0, 1]}
          sliderProps={{ stepSize: 0.1 }}
          format="0.[00]"
        />
      </div>
    </div>
  );
};

export default CompPropsAttr;
