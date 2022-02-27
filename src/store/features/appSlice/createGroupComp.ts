import { groupCreate } from 'helpers/groupHandle';
import sortListItem from 'utils/sortListItem';

const createGroupComp: AutoDV.ReducerCaseWithPrepare<{ group: AutoDV.Comp; insertIndex: number }> = {
  reducer(state, action) {
    const { compDatas, compCodes, selectedCompCodes } = state;
    const { insertIndex, group } = action.payload;
    compDatas[group.code] = group;
    state.compDatas = groupCreate(selectedCompCodes, compDatas, group);
    //将分组插入到指定位置
    compCodes.splice(insertIndex < 0 ? 0 : insertIndex, 0, group.code);
    //重排
    state.compCodes = sortListItem(compCodes, compDatas);
  },
  prepare(payload) {
    return { payload: { ...payload, _alias: '创建分组' } };
  },
};

export default createGroupComp;
