import styled from 'styled-components';
// import { Icon, Colors } from '@blueprintjs/core';
import CancelIcon from '@mui/icons-material/Cancel';
import { withField } from './withField';
import Picker from 'rc-picker';
import zhCN from 'rc-picker/lib/locale/zh_CN';
import generateConfig from 'rc-picker/lib/generate/dayjs';
import 'dayjs/locale/zh-cn'; // 没有这行月份和星期就不会显示中文
import 'assets/style/datePicker/index.scss';
import dayjs from 'dayjs';
// import { generate } from '@ant-design/colors';

// const getCssVar = (varName: string, mainColor: string) => {
//   return generate(mainColor)
//     .reverse()
//     .reduce((acc, cur, idx) => {
//       acc[`--${varName}-${idx + 1}`] = cur;
//       return acc;
//     }, {} as Record<string, string>);
// };

const Container = styled.div``;

interface DataPickerProps {
  /** 值的类型是否使用时间戳 */
  timeStamp?: boolean;
}

export const DatePicker = withField<DataPickerProps>((props) => {
  const { field, form, timeStamp } = props;
  const prefixCls = 'autoDV-picker';
  const styleVars: any = {
    '--fontSize': '14px',
    '--borderWidth': '1px',
    // '--background': Colors.DARK_GRAY1,
    '--fontColor': '#f5f8fa',
    // '--fontColorInverse': Colors.WHITE,
    // '--borderColor': Colors.DARK_GRAY3,
    // ...getCssVar('primary', Colors.BLUE3),
    // ...getCssVar('secondary', Colors.DARK_GRAY5),
  };

  return (
    <Container style={styleVars}>
      <Picker
        value={field.value ? dayjs(field.value) : null}
        prefixCls={prefixCls}
        picker="date"
        locale={zhCN}
        generateConfig={generateConfig}
        showTime
        showToday
        allowClear
        clearIcon={<CancelIcon />}
        popupStyle={styleVars}
        onChange={(date, dateString) => {
          const ts = date?.valueOf() || 1;
          const value = timeStamp ? ts - (ts % 1000) : dateString;
          form.setFieldValue(field.name, value);
        }}
        disabledDate={(current) => {
          return current.valueOf() <= Date.now();
        }}
      />
    </Container>
  );
});
