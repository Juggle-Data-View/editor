import { JuggleDV } from '@juggle-data-view/types';
import { cloneDeep } from 'lodash';
import { nanocode } from 'utils';
import { getAllSelectedComps } from 'utils/getAllChildren';
import sortListItem from 'utils/sortListItem';
import subList from 'utils/SubList';

export const pasteComp: JuggleDV.ReducerCaseWithPrepare = {
  reducer(state) {
    const { compDatas, selectedCompCodes, compCodes } = state;
    // 获取选中组件的原始顺序
    const scodes = getAllSelectedComps(
      state.compCodes.filter((code) => selectedCompCodes.includes(code)),
      compDatas,
      compCodes
    );

    const newCodes: string[] = [];

    const groupCodeCache: { newCode: string; oldCode: string }[] = [];

    // 根据原始顺序的code拷贝新的组件
    scodes
      .map((scode) => cloneDeep(compDatas[scode]))
      .forEach((comp) => {
        const newCode = nanocode(comp.compCode);

        if (comp.compCode === 'group') {
          comp.config.groupCode = undefined;
          //如果组件时分组组件，将分组的新旧code推入缓存
          groupCodeCache.push({
            oldCode: comp.code,
            newCode,
          });
        }
        comp.code = newCode;
        comp.attr.left += 20;
        comp.attr.top += 20;

        if (
          comp.config.groupCode &&
          groupCodeCache.length &&
          comp.config.groupCode === groupCodeCache[groupCodeCache.length - 1].oldCode
        ) {
          comp.config.groupCode = groupCodeCache[groupCodeCache.length - 1].newCode;
        }

        newCodes.push(comp.code);

        state.compCodes.push(comp.code);
        state.compDatas[comp.code] = comp;
        state.selectedCompCodes.push(comp.code);
      });
    state.compCodes = sortListItem(state.compCodes, compDatas);
    const codes = subList(state.compCodes, compDatas);
    state.selectedCompCodes = newCodes.filter((newCode) => codes.find((item) => newCode === item.code));
  },
  prepare() {
    return {
      payload: { _alias: '粘贴组件' },
    };
  },
};

export const copyComp: JuggleDV.ReducerCaseWithPrepare = {
  reducer(state) {
    const { compDatas, selectedCompCodes } = state;
    state.copyComps = selectedCompCodes.map((sid) => compDatas[sid]);
  },
  prepare() {
    return { payload: { _alias: '复制组件' } };
  },
};
