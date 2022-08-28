import { JuggleDV } from '@juggle-data-view/types';
import { updateGroupSize } from 'helpers/groupHandle';
import { selectedRectSelector } from 'helpers/selectors';
import { getAllSelectedComps } from '@utils/getAllChildren';

const setCompAlignment: JuggleDV.ReducerCaseWithPrepare<{ alignType: JuggleDV.AlignType }> = {
  reducer(state, action) {
    const { alignType } = action.payload;
    const { canvas, selectedCompCodes, compDatas, compCodes } = state;
    const selectedRect = selectedRectSelector(state);
    const codes = getAllSelectedComps(selectedCompCodes, compDatas, compCodes);

    // 组件是与画布对齐，多个组件时，对齐方式为组件与组件之间对齐
    const align2canvas = selectedCompCodes.length > 1 ? false : true;

    codes.forEach((scode) => {
      const { width, height } = compDatas[scode].attr;
      const alignMap: any = {
        /* 横向 */
        left: align2canvas ? 0 : selectedRect.left,
        right: align2canvas ? canvas.width - width : selectedRect.left + selectedRect.width - width,
        horizontalCenter: align2canvas
          ? (canvas.width - width) / 2
          : selectedRect.left + selectedRect.width / 2 - width / 2,
        /* 纵向 */
        top: align2canvas ? 0 : selectedRect.top,
        bottom: align2canvas ? canvas.height - height : selectedRect.top + selectedRect.height - height,
        verticalCenter: align2canvas
          ? (canvas.height - height) / 2
          : selectedRect.top + selectedRect.height / 2 - height / 2,
      };
      const key = ['left', 'right', 'horizontalCenter'].includes(alignType) ? 'left' : 'top';
      compDatas[scode].attr[key] = Math.round(alignMap[alignType]);
    });

    // 更新分组尺寸
    updateGroupSize(selectedCompCodes, compCodes, compDatas, state);
  },
  prepare(payload: { alignType: JuggleDV.AlignType }) {
    const alignMap: Record<JuggleDV.AlignType, string> = {
      left: '左对齐',
      horizontalCenter: '横向居中',
      right: '右对齐',
      top: '顶部对齐',
      verticalCenter: '垂直居中',
      bottom: '底部对齐',
      horizontalJustified: '横向两端对齐',
      verticalJustified: '纵向两端对齐',
    };
    return { payload: { ...payload, _alias: alignMap[payload.alignType] || '对齐' } };
  },
};

export default setCompAlignment;
