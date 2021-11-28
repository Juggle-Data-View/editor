import { Tabs, Tab, Button, ControlGroup, Classes } from '@blueprintjs/core';
import DatasetSelect from 'components/common/DatasetSelect';
import { JSONEditor } from 'components/common/CodeEditor';

import showAlert from 'components/common/AutoDVAlert';

const Alerts = () => {
  return (
    <>
      <Button text="显示代码预览抽屉组件" />
      <Button
        text="显示Alert组件"
        onClick={() => {
          showAlert(<p>自定义内容</p>, {
            icon: 'trash',
            intent: 'danger',
            onClose: (confirmed: boolean) => {
              alert(confirmed);
            },
          });
        }}
      />
    </>
  );
};

const DatasetGroup = () => {
  return (
    <ControlGroup fill={true} vertical={false}>
      <Button className={Classes.TEXT_OVERFLOW_ELLIPSIS} style={{ minWidth: 100 }}>
        数据集
      </Button>
      <DatasetSelect />
    </ControlGroup>
  );
};

const Coder = () => {
  return (
    <div style={{ height: 350 }}>
      <JSONEditor value={'{ test: "sair" }'} />
    </div>
  );
};

export default function Demos() {
  return (
    <Tabs id="demosExample">
      <Tab id="alert" title="弹出层" panel={<Alerts />} />
      <Tab id="dataset" title="数据集下拉" panel={<DatasetGroup />} />
      <Tab id="coder" title="代码编辑" panel={<Coder />} />
    </Tabs>
  );
}
