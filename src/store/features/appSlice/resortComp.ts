import { JuggleDV } from '@juggle-data-view/types';
import { groupResort, updateGroupSize } from 'helpers/groupHandle';
import { getAllSelectedComps } from 'utils/getAllChildren';
import sortListItem from 'utils/sortListItem';

const resortComp: JuggleDV.ReducerCaseWithPrepare<{ source: number; destination: number }> = {
  reducer(state, action) {
    const { compCodes, selectedCompCodes, compDatas } = state;
    const { source, destination } = action.payload;

    // 有前后顺序的选择id列表
    let scodes: string[] = compCodes.filter((code) => selectedCompCodes.includes(code));

    scodes = getAllSelectedComps(scodes, compDatas, compCodes);
    const [selectIntervalToplest, selectIntervalLowlest] = [
      compCodes.indexOf(scodes[0]),
      compCodes.indexOf(scodes[scodes.length - 1]),
    ];
    if (destination >= selectIntervalToplest && destination <= selectIntervalLowlest) {
      // 拖动位置在被选中组件的区间内，不进行任何动作
      return;
    }

    // 先调换被拖拽的id
    const [dragId] = compCodes.splice(source, 1);
    compCodes.splice(destination, 0, dragId);

    let endIndex = destination;
    const groupMap = groupResort(compCodes, scodes, compDatas, destination);
    scodes.forEach((scode) => {
      if (scode !== dragId) {
        const startIndex = compCodes.findIndex((code) => code === scode);
        const [removed] = compCodes.splice(startIndex, 1, '');
        endIndex++;
        compCodes.splice(endIndex, 0, removed);
      }
    });

    state.compCodes = sortListItem(
      compCodes.filter((code) => code !== ''),
      compDatas
    );

    // 更新分组尺寸
    updateGroupSize(selectedCompCodes, compCodes, compDatas, state, groupMap);
  },
  prepare(payload) {
    return { payload: { ...payload, _alias: '排序' } };
  },
};

export default resortComp;
