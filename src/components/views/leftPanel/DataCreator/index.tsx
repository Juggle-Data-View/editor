import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider } from '@mui/material';
import useLang from 'components/base/useLang';
import React, { useMemo, useState } from 'react';
import ReactDOM from 'react-dom';
import { Formik } from 'formik';
import getDefaultValues from './getDefaultValue';
import CommonForm from './CommonForm';

interface Props {
  containerDiv: HTMLDivElement;
  options?: AutoDV.MixinDatasource;
}

const Container: React.FC<Props> = ({ containerDiv, options }) => {
  const [isOpen, setOpen] = useState(false);

  const lang = useLang();

  const defualtValues = useMemo(() => getDefaultValues(options?.dataSourceType), []); //eslint-disable-line

  const handleClose = () => {
    if (containerDiv && isOpen) {
      // It will be run twice, if `isOpen` is not in condition
      document.body.removeChild(containerDiv);
    }
    setOpen(false);
  };

  const handleConfirm = () => {
    handleClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle id="alert-dialog-title">
        {options ? lang.updateDatasource + options.name : lang.createDatasource}
      </DialogTitle>
      <Divider />
      <Formik onSubmit={console.log} initialValues={defualtValues}>
        <>
          <DialogContent>
            <CommonForm />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleConfirm}>confirm</Button>
            <Button onClick={handleClose}>cancel</Button>
          </DialogActions>
        </>
      </Formik>
    </Dialog>
  );
};

const DataCreator = (options?: AutoDV.MixinDatasource) => {
  const tempDiv = document.createElement('div');
  document.body.appendChild(tempDiv);
  ReactDOM.render(<Container containerDiv={tempDiv} options={options} />, tempDiv);
};

export default DataCreator;
