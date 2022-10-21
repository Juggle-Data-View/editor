import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider } from '@mui/material';
import useLang from '@components/base/useLang';
import React, { useEffect, useMemo, useState } from 'react';
import Providers from '@components/base/Providers';
import { useDispatch, useSelector } from 'react-redux';
import { appAction } from '@store/features/appSlice';
import { selectDatasources } from '@store/selectors';
import { Generator } from '@components/recursion';
import commonFormConfig from './commonFormConfig';
import { CommonErrorBoundy, HandleCatch } from '@components/base/CompErrorBoundary';
import ThemeConfig from '@configurableComponents/theme';
import getFormatBody from './getFormatBody';
import { nanocode } from 'utils';
import { DataSourceType, HttpMethod } from '@configurableComponents/const';
import { JuggleDV } from '@juggle-data-view/types';
import { createRoot } from 'react-dom/client';
import getOriginData from '@utils/getOriginData';

interface Props {
  containerDiv: HTMLDivElement;
  options?: JuggleDV.MixinDatasource;
}

const defaultDatasourceConfig = () => ({
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
  isProxy: false,
  frequency: 1000,
  operator: ['normal'],
});

const Container: React.FC<Props> = ({ containerDiv, options }) => {
  const [isOpen, setOpen] = useState(true);
  const [isVaild, setVaild] = useState(false);
  const lang = useLang();

  const defualtValues = useMemo(() => options || (defaultDatasourceConfig() as any), [options]);

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

  const handleSubmit = (values: JuggleDV.MixinDatasource) => {
    if (!isVaild) {
      return;
    }
    const { dataSourceId, body } = values;

    if (dataSourceId in datasources) {
      dispatch(appAction.updateDatasource({ datasource: { ...values, body: getFormatBody(body) } }));
    } else {
      dispatch(appAction.addDatasource({ datasource: { ...values, body: getFormatBody(body) } }));
    }
    handleClose();
  };

  const handleCatch: HandleCatch = (err, info) => {
    if (err) {
      console.log(info);
    }
  };

  useEffect(() => {
    if (sourceContent.type === DataSourceType.Static || !sourceContent.url) {
      return;
    }

    getOriginData(sourceContent, {} as any).then((body) => {
      setSourceContent({
        ...sourceContent,
        body,
      });
    });
    // reset datasource config while `source.url` is changed
  }, [sourceContent.url]); //eslint-disable-line
  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle id="alert-dialog-title">
        {options ? lang.updateDatasource + ': ' + options.name : lang.createDatasource}
      </DialogTitle>
      <Divider />

      <DialogContent>
        <CommonErrorBoundy handleCatch={handleCatch}>
          <Generator
            values={sourceContent}
            config={commonFormConfig}
            defaultValues={defualtValues}
            onVaildate={setVaild}
            onSubmit={(value) => {
              setSourceContent(value);
            }}
          >
            {({ render, formik }) => {
              return (
                <>
                  {render}
                  <DialogActions>
                    <Button onClick={() => handleSubmit(formik.values)} type="submit">
                      confirm
                    </Button>
                    <Button onClick={handleClose}>cancel</Button>
                  </DialogActions>
                </>
              );
            }}
          </Generator>
        </CommonErrorBoundy>
      </DialogContent>
    </Dialog>
  );
};

const dataCreator = (options?: JuggleDV.MixinDatasource) => {
  const tempDiv = document.createElement('div');
  const container = createRoot(tempDiv);
  container.render(
    <Providers>
      <ThemeConfig>
        <Container containerDiv={tempDiv} options={options} />
      </ThemeConfig>
    </Providers>
  );
  document.body.appendChild(tempDiv);
};

export default dataCreator;
