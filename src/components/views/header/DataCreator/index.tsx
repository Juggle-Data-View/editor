import { Dialog, DialogTitle } from '@mui/material';
import React, { useState } from 'react';

interface Props {
  containerDiv?: HTMLDivElement;
}

const Container: React.FC<Props> = () => {
  const [isOpen, setOpen] = useState(false);

  return (
    <Dialog open={isOpen} onClose={() => setOpen(false)}>
      <DialogTitle>Set backup account</DialogTitle>
    </Dialog>
  );
};

const DataCreator: React.FC = () => {
  //TODO: Use ReactDOM render to template div

  return (
    <>
      <Container />
    </>
  );
};

export default DataCreator;
