import styled from 'styled-components';
import AutoDVIcon from 'components/common/AutoDVIcon';
import { useField } from 'formik';
import { Button } from '@mui/material';

const Container = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  button {
    margin-right: 5px;
  }
`;

interface IProps {
  name: string;
}

const AttrScale: React.FC<IProps> = ({ name }) => {
  const [field, , helpers] = useField(name);
  const value = field.value || [1, 1];

  const Icon = ({ index }: { index: 0 | 1 }) => {
    return (
      <Button
        size="small"
        onClick={() => {
          const newValue = [...value];
          newValue[index] *= -1;
          helpers.setValue(newValue);
        }}
      >
        <AutoDVIcon icon={index === 0 ? 'autoDV-flip-horizontal' : 'autoDV-flip-vertical'} size={20} />
      </Button>
    );
  };

  return (
    <Container>
      <Icon index={0} />
      <Icon index={1} />
    </Container>
  );
};

export default AttrScale;
