/**
 * 源代码展示组件
 */

import ReactJson, { ReactJsonViewProps } from 'react-json-view';

type IProps = ReactJsonViewProps;

const FormCode = (props: IProps) => {
  const ReactJsonStyle: React.CSSProperties = {
    padding: 10,
    wordBreak: 'break-all',
    whiteSpace: 'pre-wrap',
    lineHeight: 1.25,
    fontFamily: `"FiraCode-Retina"`,
    width: '100%',
  };

  const mockSrc = { test: 'autoDV5' };

  const defaultProps: IProps = {
    src: mockSrc,
    style: ReactJsonStyle,
    theme: 'bright:inverted',
    iconStyle: 'square',
    displayDataTypes: false,
  };

  return <ReactJson {...defaultProps} {...props} />;
};

export default FormCode;
