import { getParentGroup } from 'helpers/groupHandle';
import getAllChildren, { getAllSelectedComps } from 'utils/getAllChildren';
import { AutoDV } from 'auto-dv-type';

const moveComp: AutoDV.ReducerCaseWithPrepare<{ direction: 'UP' | 'DOWN'; isEnd: boolean }> = {
  reducer(state, action) {
    const { compCodes, selectedCompCodes, compDatas } = state;
    const { direction, isEnd } = action.payload;
    // const Len = compCodes.length;

    // 有前后顺序的选择id列表
    const scodes: string[] = compCodes.filter((code) => selectedCompCodes.includes(code));

    // 选中列表是否包含参数code
    // const has = (code: string, codes = selectedCompCodes) => codes.includes(code);

    // 所有选中的组件和其子组件
    const allSelectComp = getAllSelectedComps(scodes, compDatas, compCodes);

    const result = compCodes.filter((item) => !allSelectComp.includes(item));

    const startIndex = compCodes.indexOf(allSelectComp[0]);
    const endIndex = compCodes.indexOf(allSelectComp[allSelectComp.length - 1]);

    const generateCodes = (targetIndex: number) => {
      let sameLevelUnseletedCount = 0;
      //TODO: 相对位置计算在混合选择时，应依赖层次计算相对位置
      return compCodes
        .map((code, index) => {
          const firstSelectedCompGroup = compDatas[allSelectComp[0]].config.groupCode;

          if (
            compDatas[code].config.groupCode === firstSelectedCompGroup &&
            index > startIndex &&
            !allSelectComp.includes(code)
          ) {
            sameLevelUnseletedCount++;
          }

          return {
            code,
            index: index === startIndex ? 0 : allSelectComp.indexOf(code) + sameLevelUnseletedCount,
          };
        })
        .filter((item) => allSelectComp.includes(item.code));
    };

    const getTargetIndex = () => {
      const baseOffset = direction === 'UP' ? -1 : 1;
      const firstSelectedCode = compCodes[startIndex];
      const firstSelectedCompGroup = compDatas[firstSelectedCode].config.groupCode;

      if (direction === 'UP') {
        const preFirstSelectedCode = compCodes[startIndex - 1];
        if (!preFirstSelectedCode) {
          return -1;
        }
        const preFirstSelectedCompGroup = compDatas[preFirstSelectedCode].config.groupCode;

        if (compDatas[preFirstSelectedCode].code === firstSelectedCompGroup && firstSelectedCompGroup !== undefined) {
          //已在当前层次的顶部
          return -1;
        }

        if (firstSelectedCompGroup === undefined && startIndex === 0) {
          //已在最外层的顶部
          return -1;
        }

        if (preFirstSelectedCompGroup !== firstSelectedCompGroup) {
          //目标位置在另一个分组内的情况
          const group = getParentGroup(preFirstSelectedCompGroup, firstSelectedCompGroup, compCodes, compDatas);
          return compCodes.indexOf(group[0]) - 1;
        } else {
          return startIndex + baseOffset;
        }
      } else {
        const nextSelectedCode = compCodes[endIndex + 1];
        if (!nextSelectedCode) {
          return -1;
        }
        const nextSelectedCodeComp = compDatas[nextSelectedCode];

        if (
          nextSelectedCodeComp.config.groupCode !== firstSelectedCompGroup &&
          //已在当前层次的底部
          firstSelectedCompGroup !== undefined
        ) {
          return -1;
        }

        if (firstSelectedCompGroup === undefined && endIndex === compCodes.length - 1) {
          //已在最外层的底部
          return -1;
        }

        if (nextSelectedCodeComp.compCode === 'group') {
          //目标位置是分组的情况
          const group = getAllChildren(nextSelectedCodeComp.code, compCodes, compDatas);
          //下移的目标位置是一个相对位置
          return compCodes.indexOf(group[group.length - 1]) - allSelectComp.length + 1;
        } else {
          return startIndex + baseOffset;
        }
      }
    };

    if (isEnd) {
      if (direction === 'UP') {
        state.compCodes = allSelectComp.concat(result);
      } else {
        state.compCodes = result.concat(allSelectComp);
      }
      return;
    } else {
      const targetIndex = getTargetIndex();
      if (targetIndex === -1) {
        return;
      }
      const codes: { code: string; index: number }[] = generateCodes(targetIndex);
      codes.forEach((item) => {
        result.splice(targetIndex + item.index, 0, item.code);
      });
    }

    state.compCodes = result;
  },
  prepare(payload: { direction: 'UP' | 'DOWN'; isEnd: boolean }) {
    const { direction, isEnd } = payload;
    let _alias = '移动';
    if (direction === 'UP') {
      _alias = isEnd ? '置顶' : '上移';
    }
    if (direction === 'DOWN') {
      _alias = isEnd ? '置底' : '下移';
    }
    return { payload: { ...payload, _alias } };
  },
};

export default moveComp;
