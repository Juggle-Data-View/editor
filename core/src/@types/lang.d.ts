declare interface ALang {
  //component operation
  createComp: string;
  deleteComp: string;
  updateComp: string;
  renameComp: string;
  moveComp: string;
  sortComp: string;
  refreshComp: string;
  copy: string;
  lock: string;
  hidden: string;
  downOne: string;
  upOne: string;
  goTop: string;
  goBottom: string;
  group: string;
  unGroup: string;

  //datasource operation
  createDatasource: string;
  updateDatasource: string;
  deleteDatasource: string;
  previewDatasource: string;
  fieldMap: string;

  //system operation
  export: string;
  exportAll: string;
  import: string;
  globalSetting: string;
  preview: string;
  scale: string;
  suit: string;
  suitWidth: string;
  suitHeight: stirng;
  cover: string;
  history: string;
  undo: string;
  redo: string;
  clearAuxLine: string;
  showAuxLIne: string;

  //UI label
  layerList: string;
  datasourcesList: string;
  user: string;
}
