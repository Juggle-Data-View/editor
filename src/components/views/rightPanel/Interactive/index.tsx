// import { Interactive } from '@juggle-data-view/types/src/interactive';
import { Select } from 'components/form/Fields';

const InteractiveComp: React.FunctionComponent = () => {
  return (
    <div>
      <Select
        label="组件交互类型"
        name="type"
        options={[
          { value: 'none', label: 'none' },
          { value: 'reciver', label: 'reciver' },
          { value: 'trigger', label: 'trigger' },
          { value: 'both', label: 'trigger&reciver' },
        ]}
      />
    </div>
  );
};

export default InteractiveComp;
