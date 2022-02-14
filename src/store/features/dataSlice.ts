import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { decorateData2array } from 'utils/dataTranslate';
import type { Menu } from 'config/menu';
import menu from 'config/menu';

export const asyncLoadMenu = createAsyncThunk('menu/load', async () => {
  try {
    const res = await import('config/menu');
    return res.default;
  } catch (error) {
    console.log(error);
  }
});

interface InitialState {
  originDatas: {
    [code: string]: any;
  };
  menu: Menu;
}

const initialState: InitialState = {
  originDatas: {},
  menu: menu,
};

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    cacheOriginData(state, action: PayloadAction<{ code: string; data?: unknown }>) {
      const { code, data } = action.payload;
      if (data) {
        // add
        state.originDatas[code] = decorateData2array(data);
      } else {
        // delete
        delete state.originDatas[code];
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(asyncLoadMenu.fulfilled, (state, action) => {
      if (action.payload) {
        state.menu = action.payload;
        // const { categories, categoryIds } = state.menu;
      }
    });
  },
});

export const { cacheOriginData } = dataSlice.actions;

export default dataSlice.reducer;
