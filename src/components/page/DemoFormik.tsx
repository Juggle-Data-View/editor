import styled from 'styled-components';
import { Colors, Pre } from '@blueprintjs/core';
import { Formik } from 'formik';
import { AutoSubmit, Field, validator } from 'components/form/index';
import { EditorGlobalStyle } from 'assets/style';
import withTheme from 'components/base/withTheme';

const fontWeight = [
  { label: '汉仪力量', value: 'HYLiLiangHeiJ' },
  { label: '方正兰亭', value: 'FZLTTHJW' },
  { label: '汉仪中简黑', value: 'HYZJHJ' },
];

const Container = styled.div`
  background-color: ${Colors.DARK_GRAY3};
  font-size: 12px;
  display: flex;
  padding: 10px;
  overflow: auto;
  height: 100%;
  > div {
    flex: 1;
  }
`;

const initState = {
  text: 'testName',
  number: 6,
  fontWeight: 'bold',
  checkbox: [],
  switch: true,
  color: {
    type: 'linear',
    colorStops: [
      {
        offset: 0,
        color: '#ca375b',
      },
      {
        offset: 0.403,
        color: '#ca375b',
      },
      {
        offset: 1,
        color: '#7e20cf',
      },
    ],
    angle: 90,
  },
  range: [30, 79],
  angle: 0,
  items: [],
};

const Options = fontWeight.map((item) => (
  <option key={item.label} value={item.value}>
    {item.label}
  </option>
));

function DemoFormik() {
  return (
    <Formik
      initialValues={initState}
      onSubmit={(values) => {
        console.log('submit success', values);
        // 通过验证了
        // 更改state compDatas
        // 发起请求 改服务端数据
      }}
    >
      {(formik) => {
        return (
          <Container className="bp3-dark">
            <div className="forms">
              <AutoSubmit />
              <Field.Text name="text" label="FieldText" validate={validator.required} />
              <Field.Textarea name="text" label="FieldTextarea" validate={validator.required} bp={{ fill: true }} />
              <Field.Number name="number" label="FieldNumber" validate={validator.positive} />
              <Field.Switch name="switch" label="FieldSwitch" />
              <Field.Switch name="switch" label="FieldSwitch" useCheckbox />
              <Field.Radio name="fontWeight" label="FieldRadio">
                {Options}
              </Field.Radio>
              <Field.Select name="fontWeight" label="FieldSelect">
                {fontWeight.map((item, index) => (
                  <option disabled={index === 0} key={item.label} value={item.value} label={item.label}>
                    {item.label}
                  </option>
                ))}
              </Field.Select>
              <Field.Checkbox name="checkbox" label="FieldCheckbox">
                {Options}
              </Field.Checkbox>
              <Field.Color name="color" label="FieldColor" useGradient />
              <Field.Range name="number" label="FieldSlider" range={[0, 20]} />
              <Field.MultiRange
                name="range"
                label="FieldMultiRange"
                sliderProps={{ min: 0, max: 100, labelStepSize: 50 }}
              />
              <Field.Angle name="angle" label="FieldAngle" />
            </div>
            <div className="debug">
              <Pre>{JSON.stringify(formik, null, 2)}</Pre>
            </div>
            <EditorGlobalStyle />
          </Container>
        );
      }}
    </Formik>
  );
}

export default withTheme(DemoFormik);
