import { JuggleDV } from '@juggle-data-view/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: JuggleDV.Editor = {
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
    togglePanel(state, action: PayloadAction<keyof JuggleDV.Editor['panel']>) {
      const name = action.payload; // 面板名称
      state.panel[name] = !state.panel[name];
    },
    controlPanel(state, action: PayloadAction<Partial<JuggleDV.Editor['panel']>>) {
      state.panel = {
        ...state.panel,
        ...action.payload,
      };
    },
    compHover(state, action: PayloadAction<number[]>) {
      state.hoverIndex = action.payload;
    },
    updateEditor(state, action: PayloadAction<JuggleDV.Editor>) {
      return action.payload;
    },
    setGuideLines(state, action: PayloadAction<JuggleDV.Editor['guideLines']>) {
      state.guideLines = action.payload;
    },
    setAdaptiveScale(state, action: PayloadAction<number>) {
      state.adaptiveScale = action.payload;
    },
    setSelecto(state, action: PayloadAction<boolean>) {
      state.isSelecto = action.payload;
    },
    setRightPannelType(state, action: PayloadAction<JuggleDV.Editor['rightPannelType']>) {
      state.rightPannelType = action.payload;
    },
  },
});

export const editorAction = systemSlice.actions;

export default systemSlice.reducer;
