import Alignment from 'components/common/Alignment';
// import AttrScale from 'components/common/AttrScale';
import { Row, Col } from 'react-simple-flex-grid';
import FieldSize from 'components/common/FieldSize';
import { FieldLabel, Control, Field } from 'components/form/index';
import { JuggleDV } from '@juggle-data-view/types';

const CompPropsAttr: React.FC<JuggleDV.PropsCompProps> = () => {
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
              <Control.InputNumber name="attr.left" prefix="X" />
            </Col>
            <Col span={2} />
            <Col span={5}>
              <Control.InputNumber name="attr.top" prefix="Y" />
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
        {/* <FieldLabel label="组件旋转" {...labelProps}>
          <Row style={{ height: '100%' }}>
            <Col span={5}>
              <Control.InputNumber name="attr.angle" />
            </Col>
            <Col span={2} style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Control.Angle name="attr.angle" size={24} />
            </Col>
            <Col span={5} style={{ height: '100%' }}>
              <AttrScale name="attr.scale" />
            </Col>
          </Row>
        </FieldLabel> */}
        <Field.Range
          label="透明度"
          labelProps={labelProps}
          name="attr.opacity"
          range={[0, 2]}
          sliderProps={{ step: 0.01 }}
          format="0.[00]"
        />
      </div>
    </div>
  );
};

export default CompPropsAttr;
