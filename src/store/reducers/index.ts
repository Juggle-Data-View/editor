import { JuggleDV } from '@juggle-data-view/types';
import { Reducer, AnyAction, combineReducers } from '@reduxjs/toolkit';
import editorReducer from '../features/editorSlice';
import appReducer from '../features/appSlice';
import dataReducer from '../features/dataSlice';
import undoable from 'assets/lib/redux-undo';
import undoReducer, { undoFilter } from './undo';
import api from '@service/index';

const compWithUndoReducer = undoReducer(
  undoable(appReducer, {
    limit: 50,
    debug: false,
    ignoreInitialState: true,
    filter: undoFilter,
  })
);

export default combineReducers({
  autoDV: compWithUndoReducer as Reducer<JuggleDV.UndoState, AnyAction>,
  // autoDV: updateLocalVersion(compWithUndoReducer) as Reducer<JuggleDV.UndoState, AnyAction>,
  editor: editorReducer,
  data: dataReducer,
  [api.reducerPath]: api.reducer,
});
