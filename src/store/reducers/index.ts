import { Reducer, AnyAction, combineReducers } from '@reduxjs/toolkit';
import editorReducer from '../features/editorSlice';
import appReducer from '../features/appSlice';
import dataReducer from '../features/dataSlice';

// 处理 历史记录
import undoable from 'assets/lib/redux-undo';
import undoReducer, { undoFilter } from './undo';

const compWithUndoReducer = undoReducer(
  undoable(appReducer, {
    limit: 50,
    debug: false,
    /**
     * 忽略初始状态，防止其出现在历史记录列表中。
     * 历史记录的列表中使用了 _latestUnfiltered 作为当前状态。
     */
    ignoreInitialState: true,
    filter: undoFilter,
  })
) as Reducer<AutoDV.UndoState, AnyAction>;

export default combineReducers({
  autoDV: compWithUndoReducer,
  editor: editorReducer,
  data: dataReducer,
});
