import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider } from '@mui/material';
import useLang from 'components/base/useLang';
import React, { useMemo, useState } from 'react';
import ReactDOM from 'react-dom';
import Providers from 'components/base/Providers';
import { useDispatch, useSelector } from 'react-redux';
import { appAction } from 'store/features/appSlice';
import { selectDatasources } from 'store/selectors';
import { Generator } from 'components/recursion';
import commonFormConfig from './commonFormConfig';
import { CommonErrorBoundy, HandleCatch } from 'components/base/CompErrorBoundary';
import ThemeConfig from 'config/theme';
import getFormatBody from './getFormatBody';
import { nanocode } from 'utils';
import { DataSourceType, HttpMethod } from 'config/const';

interface Props {
  containerDiv: HTMLDivElement;
  options?: AutoDV.MixinDatasource;
}

const defaultDatasourceConfig = {
  name: 'default name',
  dataSourceId: nanocode('default'),
  dataSourceType: DataSourceType.Static,
  url: '',
  method: HttpMethod.GET,
  header: [
    {
      key: '',
      value: '',
    },
  ],
  dataParams: [
    {
      name: '',
      value: '',
    },
  ],
  body: '',
  frequency: 1000,
  operator: ['normal'],
};

const Container: React.FC<Props> = ({ containerDiv, options }) => {
  const [isOpen, setOpen] = useState(true);
  const [isVaild, setVaild] = useState(false);
  const lang = useLang();

  const defualtValues = useMemo(() => options || (defaultDatasourceConfig as any), [options]);

  const [sourceContent, setSourceContent] = useState(defualtValues);

  const dispatch = useDispatch();

  const datasources = useSelector(selectDatasources);

  const handleClose = () => {
    if (containerDiv && isOpen) {
      // It will be run twice, if `isOpen` is not in condition
      document.body.removeChild(containerDiv);
    }
    setOpen(false);
  };

  const handleSubmit = () => {
    const { dataSourceId, body } = sourceContent;
    if (!isVaild) {
      return;
    }

    if (dataSourceId in datasources) {
      dispatch(appAction.updateDatasource({ datasource: { ...sourceContent, body: getFormatBody(body) } }));
    } else {
      dispatch(appAction.addDatasource({ datasource: { ...sourceContent, body: getFormatBody(body) } }));
    }
    handleClose();
  };

  const handleCatch: HandleCatch = (err, info) => {
    if (err) {
      console.log(info);
    }
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle id="alert-dialog-title">
        {options ? lang.updateDatasource + ': ' + options.name : lang.createDatasource}
      </DialogTitle>
      <Divider />

      <DialogContent>
        <CommonErrorBoundy handleCatch={handleCatch}>
          <Generator
            values={defualtValues}
            config={commonFormConfig}
            defaultValues={defualtValues}
            onVaildate={setVaild}
            onSubmit={(value) => {
              setSourceContent(value);
            }}
          >
            {({ render }) => {
              return <>{render()}</>;
            }}
          </Generator>
        </CommonErrorBoundy>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit} type="submit">
          confirm
        </Button>
        <Button onClick={handleClose}>cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

const dataCreator = (options?: AutoDV.MixinDatasource) => {
  const tempDiv = document.createElement('div');
  ReactDOM.render(
    <Providers>
      <ThemeConfig>
        <Container containerDiv={tempDiv} options={options} />
      </ThemeConfig>
    </Providers>,
    tempDiv
  );
  document.body.appendChild(tempDiv);
};

export default dataCreator;
