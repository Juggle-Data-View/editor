const unSelectComp: AutoDV.ReducerCase = (state) => {
  const { selectedCompCodes } = state;
  if (selectedCompCodes.length) {
    state.selectedCompCodes = [];
  }
};

export default unSelectComp;
