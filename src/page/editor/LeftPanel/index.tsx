import { AddCircle } from '@mui/icons-material';
import LayersIcon from '@mui/icons-material/Layers';
import { Tab } from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import React, { useState } from 'react';
import ComponentsLayers from './ComponentsLayers';
import { LeftPannelContainer } from './style';
import SkipPreviousOutlinedIcon from '@mui/icons-material/SkipPreviousOutlined';
import { useDispatch, useSelector } from 'react-redux';
import { editorAction } from '@store/features/editorSlice';
import { selectEditorPanel } from '@store/selectors';
import ComponentsStore from './ComponentsStore';
import StorageIcon from '@mui/icons-material/Storage';
import DatasourceList from './DatasourceList';
import useLang from '@components/base/useLang';

const LeftPanel: React.FC = () => {
  const [activeKey, setActiveKey] = useState('create');

  const handleChange = (event: React.SyntheticEvent, val: string) => {
    setActiveKey(val);
  };

  const dispatch = useDispatch();
  const panel = useSelector(selectEditorPanel);

  const lang = useLang();
  // TODO: add user tab to switch route
  return (
    <LeftPannelContainer visible={panel.compList}>
      <TabContext value={activeKey}>
        <div className="dashbroadController">
          <TabList orientation="vertical" onChange={handleChange}>
            <Tab label={lang.createComp} value="create" icon={<AddCircle />} />
            <Tab label={lang.layerList} value="layer" icon={<LayersIcon />} />
            <Tab label={lang.datasourcesList} value="datasource" icon={<StorageIcon />} />
          </TabList>
          <div className="operations" onClick={() => dispatch(editorAction.togglePanel('compList'))}>
            <SkipPreviousOutlinedIcon />
          </div>
        </div>

        <TabPanel value="layer">
          <ComponentsLayers />
        </TabPanel>
        <TabPanel value="create">
          <ComponentsStore />
        </TabPanel>
        <TabPanel value="datasource">
          <DatasourceList />
        </TabPanel>
      </TabContext>
    </LeftPannelContainer>
  );
};

export default LeftPanel;
