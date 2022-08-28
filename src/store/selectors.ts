import type { RootState } from '@store/index';

/** undo */

export const selectUndo = (state: RootState) => state.autoDV;

/** app */

export const selectJuggleDV = (state: RootState) => state.autoDV.present;

export const selectApp = (state: RootState) => state.autoDV.present.app;

export const selectCanvas = (state: RootState) => state.autoDV.present.canvas;

export const selectKeyPress = (state: RootState) => state.autoDV.present.keyPressed;

export const selectDatasources = (state: RootState) => state.autoDV.present.app.datasources;

/** comp */

export const selectCompCodes = (state: RootState) => state.autoDV.present.compCodes;

export const selectCompDatas = (state: RootState) => state.autoDV.present.compDatas;

/** editor */

export const selectEditor = (state: RootState) => state.editor;

export const selectEditorPanel = (state: RootState) => state.editor.panel;

export const selectHoverIndex = (state: RootState) => state.editor.hoverIndex;

export const selectIsSelecto = (state: RootState) => state.editor.isSelecto;

export const selectTheme = (state: RootState) => state.editor.theme;

export const selectGuideLines = (state: RootState) => state.editor.guideLines;

export const selectRightPannelType = (state: RootState) => state.editor.rightPannelType;

export const selectLang = (state: RootState) => state.editor.lang;

/** data */

export const selectOriginDatas = (state: RootState) => state.data.originDatas;

export const selectMenu = (state: RootState) => state.data.menu;
