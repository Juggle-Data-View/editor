import { AutoDV } from 'auto-dv-type';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: AutoDV.Editor = {
  canvasRatio: 1,
  canvasPadding: 50,
  panel: {
    compList: true,
    compProps: true,
    history: false,
  },
  theme: 'dark',
  hoverIndex: [],
  guideLines: {
    visible: false,
    h: [],
    v: [],
  },
  adaptiveScale: 1,
  isSelecto: false,
  rightPannelType: 'hidden',
  lang: 'en',
};

const systemSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    zoomCanvas(state, action: PayloadAction<number | 'auto'>) {
      if (action.payload === 'auto') {
        state.canvasRatio = state.adaptiveScale;
      } else {
        state.canvasRatio = action.payload;
      }
    },
    togglePanel(state, action: PayloadAction<keyof AutoDV.Editor['panel']>) {
      const name = action.payload; // 面板名称
      state.panel[name] = !state.panel[name];
    },
    compHover(state, action: PayloadAction<number[]>) {
      state.hoverIndex = action.payload;
    },
    updateEditor(state, action: PayloadAction<AutoDV.Editor>) {
      return action.payload;
    },
    setGuideLines(state, action: PayloadAction<AutoDV.Editor['guideLines']>) {
      state.guideLines = action.payload;
    },
    setAdaptiveScale(state, action: PayloadAction<number>) {
      state.adaptiveScale = action.payload;
    },
    setSelecto(state, action: PayloadAction<boolean>) {
      state.isSelecto = action.payload;
    },
    setRightPannelType(state, action: PayloadAction<AutoDV.Editor['rightPannelType']>) {
      state.rightPannelType = action.payload;
    },
  },
});

export const editorAction = systemSlice.actions;

export default systemSlice.reducer;
