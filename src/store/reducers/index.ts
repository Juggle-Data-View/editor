import { Reducer, AnyAction, combineReducers } from '@reduxjs/toolkit';
import editorReducer from '../features/editorSlice';
import appReducer from '../features/appSlice';
import dataReducer from '../features/dataSlice';
import undoable from 'assets/lib/redux-undo';
import undoReducer, { undoFilter } from './undo';

const compWithUndoReducer = undoReducer(
  undoable(appReducer, {
    limit: 50,
    debug: false,
    ignoreInitialState: true,
    filter: undoFilter,
  })
) as Reducer<AutoDV.UndoState, AnyAction>;

export default combineReducers({
  autoDV: compWithUndoReducer,
  editor: editorReducer,
  data: dataReducer,
});
