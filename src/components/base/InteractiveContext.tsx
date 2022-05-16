import { GlobalInteractiveVar } from '@juggle-data-view/types/src/interactive';
import produce from 'immer';
import React, { useContext, useReducer } from 'react';

const defaultVal: GlobalInteractiveVar = {
  var: {
    timer: Date.now(),
  },
  interactiver: [],
};

type CommonActionhandler<T, P> = (payload: P) => {
  type: T;
  payload: P;
};

type AddGlobalValHandle = CommonActionhandler<
  'ADD_GLOBAL_VAL',
  {
    varName: string;
    value: string | number;
  }
>;

type AddGlobalAction = ReturnType<AddGlobalValHandle>;

type DeleteGlobalVarHandler = CommonActionhandler<
  'DELETE_GLOBAL_VAL',
  {
    varName: string;
  }
>;

type DeleteGlobalVarAction = ReturnType<DeleteGlobalVarHandler>;

type MixinActions = AddGlobalAction | DeleteGlobalVarAction;

type MixinDispatch = AddGlobalValHandle | DeleteGlobalVarHandler;

const reducer = produce((state: GlobalInteractiveVar, action: MixinActions) => {
  const { type, payload } = action;
  switch (type) {
    case 'ADD_GLOBAL_VAL': {
      const { varName, value } = payload;
      state.var[varName] = value;
      break;
    }
    case 'DELETE_GLOBAL_VAL': {
      const { varName } = payload;
      delete state.var[varName];
      break;
    }
    default:
      break;
  }
  return state;
});

const InteractiveContext = React.createContext<{
  state: GlobalInteractiveVar;
  dispatch: React.Dispatch<MixinDispatch>;
}>({
  state: defaultVal,
  dispatch: () => {
    return;
  },
});

const InteractiverProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, defaultVal);

  return (
    <InteractiveContext.Provider value={{ state, dispatch: dispatch as any }}>{children}</InteractiveContext.Provider>
  );
};

export const useInteractive = () => {
  const { state, dispatch } = useContext(InteractiveContext);
  return [state, dispatch];
};

export default InteractiverProvider;
