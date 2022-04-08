import { JuggleDV } from '@juggle-data-view/types';

const unSelectComp: JuggleDV.ReducerCase = (state) => {
  const { selectedCompCodes } = state;
  if (selectedCompCodes.length) {
    state.selectedCompCodes = [];
  }
};

export default unSelectComp;
