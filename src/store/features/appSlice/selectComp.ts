import { JuggleDV } from '@juggle-data-view/types';

const selectComp: JuggleDV.ReducerCase<{ code: string | string[]; isAreaSelect?: boolean }> = (state, action) => {
  const { code, isAreaSelect } = action.payload;
  const { compCodes, selectedCompCodes, compDatas, keyPressed } = state;

  if (Array.isArray(code)) {
    state.selectedCompCodes = [...code];
    return;
  }

  if (code === 'ALL') {
    state.selectedCompCodes = compCodes;
    return;
  }

  if (keyPressed === 'meta' || keyPressed === 'control' || isAreaSelect) {
    const selectedCompGroup = selectedCompCodes.length ? compDatas[selectedCompCodes[0]].config.groupCode : undefined;

    if (compDatas[code].config.groupCode !== selectedCompGroup) {
      state.selectedCompCodes = [code];
      return;
    }

    if (selectedCompCodes.includes(code)) {
      // 如果id在选中列表中，则取消选中，只有ctrl有这个操作
      state.selectedCompCodes = selectedCompCodes.filter((scode) => scode !== code);
    } else {
      state.selectedCompCodes.push(code);
    }

    return;
  }

  if (keyPressed === 'shift') {
    if (!selectedCompCodes.length) {
      state.selectedCompCodes = [code];
      return;
    }

    const start = compCodes.findIndex((code) => code === selectedCompCodes[0]);
    const end = compCodes.findIndex((_code) => _code === code);

    if (start === end) {
      state.selectedCompCodes = [code];
    } else {
      // reset
      state.selectedCompCodes = [];

      // 将区间的id依次有序的推入选中列表中
      const i = start > end ? 1 : -1;
      let flag = start + i;
      while (flag !== end) {
        flag = flag + i * -1;
        const code = compCodes[flag];
        // const hasGroup = compDatas[code].config.groupCode;
        if (compDatas[code].config.groupCode !== compDatas[compCodes[start]].config.groupCode) {
          continue;
        }
        state.selectedCompCodes.push(compCodes[flag]);
      }
    }
    return;
  }

  // default
  state.selectedCompCodes = [code];
};

export default selectComp;
