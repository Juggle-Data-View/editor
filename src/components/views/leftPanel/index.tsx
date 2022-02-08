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
import { editorAction } from 'store/features/editorSlice';
import { selectEditorPanel } from 'store/selectors';

const LeftPanel: React.FC = () => {
  const [activeKey, setActiveKey] = useState('layer');

  const handleChange = (event: React.SyntheticEvent, val: string) => {
    setActiveKey(val);
  };

  const dispatch = useDispatch();
  const panel = useSelector(selectEditorPanel);

  return (
    <LeftPannelContainer visible={panel.compList}>
      <TabContext value={activeKey}>
        <div className="dashbroadController">
          <TabList orientation="vertical" onChange={handleChange}>
            <Tab label="新建组件" icon={<AddCircle />} />
            <Tab label="图层列表" value="layer" icon={<LayersIcon />} />
          </TabList>
          <div className="operations" onClick={() => dispatch(editorAction.togglePanel('compList'))}>
            <SkipPreviousOutlinedIcon />
          </div>
        </div>

        <TabPanel value="layer">
          <ComponentsLayers />
        </TabPanel>
      </TabContext>
    </LeftPannelContainer>
  );
};

export default LeftPanel;
