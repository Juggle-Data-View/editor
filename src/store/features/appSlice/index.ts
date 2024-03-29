import { JuggleDV } from '@juggle-data-view/types';
import { createSlice } from '@reduxjs/toolkit';
import addComp from './addComp';
import selectComp from './selectComp';
import deleteComp from './deleteComp';
import init from './init';
import { pasteComp, copyComp } from './stickComp';
import moveComp from './moveComp';
import toggleCompStatus from './toggleCompStatus';
import resortComp from './resortComp';
import importJSON from './importJSON';
import updateCompRect from './updateCompRect';
import unSelectComp from './unSelectComp';
import createGroupComp from './createGroupComp';
import updateCanvas from './updateCanvas';
import cancelGroup from './cancelGroup';
import setCompAlignment from './setCompAlignment';
import updateComp from './updateComp';
import { addDatasource } from './addDatasource';
import deleteDatasource from './deleteDatasource';
import updateDatasource from './updateDatasource';
import updateAppInfo from './updateAppInfo';

const initialState: JuggleDV.State = {
  version: 0,
  app: {
    createTime: 0,
    createUser: '',
    id: null,
    modifyTime: 0,
    modifyUser: '',
    name: '',
    userId: -1,
    datasources: {},
  },
  canvas: {
    id: null,
    appId: 0,
    thumbnail: '',
    backgroundColor: '',
    backgroundImg: '',
    width: 1920,
    height: 1080,
    zoomType: 0,
    mountComp: {},
  },
  compCodes: [],
  compDatas: {},
  selectedCompCodes: [],
  copyComps: [],
  keyPressed: null,
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    init,
    addComp,
    deleteComp,
    selectComp,
    unSelectComp,
    copyComp,
    pasteComp,
    moveComp,
    toggleCompStatus,
    updateComp,
    resortComp,
    importJSON,
    updateCanvas,
    updateCompRect,
    createGroupComp,
    cancelGroup,
    setCompAlignment,
    addDatasource,
    deleteDatasource,
    updateDatasource,
    updateAppInfo,
    setKeypress(state, action) {
      state.keyPressed = action.payload;
    },
  },
});
export const appAction = appSlice.actions;

export default appSlice.reducer;
