/**
 * High Order Reducer with undo.
 * -----------------------------
 * 1. 处理undo历史记录列表中的中文别名
 * 2. 处理Ctrl+Z功能
 */

import { createNextState as produce } from '@reduxjs/toolkit';
import { UNDO_RESTORE } from '@configurableComponents/const';
import { AnyAction } from '@reduxjs/toolkit';
import { appAction, appSlice } from '@store/features/appSlice';
import { JuggleDV } from '@juggle-data-view/types';
import { localStorageKey } from '@helpers/fetchAppConfig';

const isAlias = (action: AnyAction) => {
  return action.payload && action.payload._alias;
};

const isJuggleDV = (action: AnyAction) => {
  return Object.keys(appAction)
    .map((action) => [appSlice.name, action].join('/'))
    .includes(action.type);
};

export const undoFilter = (action: AnyAction) => {
  return isJuggleDV(action) && isAlias(action);
};

// 定义undo中每个action的中文别名
const aliasReducer = produce((draft: JuggleDV.UndoState, action: AnyAction) => {
  if (draft.present) {
    const { type, payload } = action;
    draft.present.actionAlias = (payload && payload._alias) || type;
  }
});

type JuggleDVReducer = (state: JuggleDV.UndoState, action: AnyAction) => JuggleDV.UndoState;

const updateLocalVersion = (newState: JuggleDV.UndoState) => {
  const remoteVersion = Number(localStorage.getItem(localStorageKey.REMOTE_VERSION));
  if (!newState.present) {
    return newState;
  }
  if (isNaN(remoteVersion)) {
    return newState;
  }
  if (newState.present.version > remoteVersion) {
    return newState;
  }

  return {
    ...newState,
    present: {
      ...newState.present,
      version: remoteVersion + 1,
    },
  };
};

/**
 * 保存最后一次的历史记录的`state`。
 * 作用是使用`ctrl+z`时可以与当前`state`进行切换。
 */
let prevState: JuggleDV.UndoState | null = null;

/**
 * @param reducer undo源码中`undoable`函数的返回值(函数).
 * 见: `src/assets/lib/redux-undo/reducer.js`中的`undoable`函数
 */
export default function undoReducer(reducer: JuggleDVReducer) {
  return (state: JuggleDV.UndoState, action: AnyAction) => {
    if (!state) {
      return reducer(state, action);
    }

    // ctrl+z
    if (prevState && prevState._latestUnfiltered && action.type === UNDO_RESTORE) {
      [state, prevState] = [prevState, state];
    }

    const currState = aliasReducer(state, action);
    const nextState = reducer(currState, action);

    /**
     * 即将发生变化的`State`和之前的`State`进行比较，如果数据发生变化，才保存上一次的操作
     * 作用是保证`ctrl+z`时有回退效果，可以过滤掉一些触发了action但没有对数据进行变更的操作
     */
    if (currState.present !== nextState.present) {
      const notAliasJuggleDVAction = !isAlias(action) && isJuggleDV(action);
      if (!notAliasJuggleDVAction) {
        prevState = state;
      }
    }

    return updateLocalVersion(nextState);
  };
}
