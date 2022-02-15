import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanocode } from 'utils';
import { selectedRectSelector, actionStatusSelector } from 'helpers/selectors';
import { cloneDeep, pick, omit } from 'lodash';
import sortListItem from 'utils/sortListItem';
import subList from 'utils/SubList';
import getAllChildren from 'utils/getAllChildren';
import { getParentGroup, groupCreate, groupResort, updateAllChildrenRect, updateGroupSize } from 'helpers/groupHandle';

/**
 * 获取所有被选中组件，包括其子组件
 * @param codes 有序的被选中组件的code
 */
const getAllSelectedComps = (codes: string[], compDatas: AutoDV.State['compDatas'], compCodes: string[]) => {
  let result: string[] = [];
  codes.forEach((item) => {
    result.push(item);
    if (compDatas[item].compCode === 'group') {
      result = [...result, ...getAllChildren(item, compCodes, compDatas)];
    }
  });
  return result;
};

const initialState: AutoDV.State = {
  app: {
    createTime: 0,
    createUser: '',
    id: null,
    modifyTime: 0,
    modifyUser: '',
    name: '',
    spaceId: -1,
    type: 0,
    datasources: [],
  },
  canvas: {
    id: null,
    appId: 0,
    thumbnail: '',
    backgroundColor: '',
    backgroundImg: '',
    width: 1920,
    height: 1080,
    zoomType: 0,
  },
  compCodes: [],
  compDatas: {},
  selectedCompCodes: [],
  copyComps: [],
  keyPressed: null,
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    init: {
      reducer(state, action: PayloadAction<{ app: AutoDV.AppConfig }>) {
        const { app } = action.payload;
        const { compInsts } = app.canvas;
        state.app = omit(app, 'canvas');
        state.canvas = omit(pick(app, 'canvas').canvas, 'compInsts');
        if (compInsts) {
          compInsts.forEach((comp) => {
            state.compCodes.push(comp.code);
            state.compDatas[comp.code] = comp;
          });
        }
      },
      prepare: ({ app }) => {
        return {
          payload: {
            app,
            _alias: '初始状态',
          },
        };
      },
    },
    addComp: {
      reducer: (state, action: PayloadAction<{ comps: AutoDV.Comp[] }>) => {
        const { comps } = action.payload;
        state.selectedCompCodes = [];
        comps.forEach((newComp) => {
          const { code } = newComp;
          state.compCodes.push(code);
          state.compDatas[code] = newComp;
          state.selectedCompCodes.push(code);
        });
      },
      prepare: ({ comps }) => {
        return {
          payload: {
            comps,
            _alias: comps.length === 1 ? `添加${comps[0].title || comps[0].alias}` : `批量添加`,
          },
        };
      },
    },
    deleteComp: {
      reducer(state) {
        const { selectedCompCodes, compCodes, compDatas } = state;
        if (selectedCompCodes.length === compCodes.length) {
          state.compCodes = [];
          state.selectedCompCodes = [];
          state.compDatas = {};
          return;
        }
        const scodes: string[] = compCodes.filter((code) => selectedCompCodes.includes(code));
        const allSelectComp = getAllSelectedComps(scodes, compDatas, compCodes);
        allSelectComp.forEach((item) => {
          compCodes.splice(
            compCodes.findIndex((code) => code === item),
            1
          );
          delete compDatas[item];
        });
        state.selectedCompCodes = [];
      },
      prepare() {
        return { payload: { _alias: '删除组件' } };
      },
    },
    selectComp(state, action: PayloadAction<{ code: string | string[]; isAreaSelect?: boolean }>) {
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
        const selectedCompGroup = selectedCompCodes.length
          ? compDatas[selectedCompCodes[0]].config.groupCode
          : undefined;

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
    },
    unSelectComp(state) {
      const { selectedCompCodes } = state;
      if (selectedCompCodes.length) {
        state.selectedCompCodes = [];
      }
    },
    copyComp: {
      reducer(state) {
        const { compDatas, selectedCompCodes } = state;
        state.copyComps = selectedCompCodes.map((sid) => compDatas[sid]);
      },
      prepare() {
        return { payload: { _alias: '复制组件' } };
      },
    },
    pasteComp: {
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

            // 复制交互组件时，重置交互组件的交互配置
            if (comp.config.triggers && comp.config.triggers.length) {
              comp.config.triggers.forEach((_trigger) => {
                _trigger.enable = false;
                _trigger.fields.forEach((field) => {
                  field.defaultValue = '';
                  field.varName = '';
                });
              });
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
    },
    moveComp: {
      reducer(state, action: PayloadAction<{ direction: 'UP' | 'DOWN'; isEnd: boolean }>) {
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

            if (
              compDatas[preFirstSelectedCode].code === firstSelectedCompGroup &&
              firstSelectedCompGroup !== undefined
            ) {
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
    },
    toggleCompStatus: {
      reducer(state, action: PayloadAction<{ code?: string; status: keyof AutoDV.ICompOwnStatus }>) {
        const { compDatas, selectedCompCodes, compCodes } = state;
        const { code, status } = action.payload;
        const codes = getAllSelectedComps(selectedCompCodes, compDatas, compCodes);
        if (code) {
          // 对单个组件的状态处理
          compDatas[code][status] = false;
        } else {
          // 多个组件的状态处理，如果按钮状态是高亮，就解除高亮，否则相反。
          const { highlight_lock, highlight_hide } = actionStatusSelector(state);
          const highlight: Record<typeof status, boolean> = {
            locked: highlight_lock,
            hided: highlight_hide,
          };
          codes.forEach((scode) => (compDatas[scode][status] = !highlight[status]));
        }
      },
      prepare(payload: { code?: string; status: keyof AutoDV.ICompOwnStatus }) {
        return {
          payload: { ...payload, _alias: payload.status === 'hided' ? '隐藏' : '锁定' },
        };
      },
    },
    updateComp: {
      reducer(state, action: PayloadAction<{ code: string; comp: AutoDV.Comp }>) {
        const { code, comp } = action.payload;
        state.compDatas[code] = comp;
      },
      prepare(payload: { code: string; comp: AutoDV.Comp }) {
        return {
          payload: { ...payload, _alias: `更新${payload.comp.alias}配置` },
        };
      },
    },
    resortComp: {
      reducer(state, action: PayloadAction<{ source: number; destination: number }>) {
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
    },
    importJSON: {
      reducer(state, action: PayloadAction<{ content: AutoDV.ExportContent }>) {
        const { content } = action.payload;
        state.selectedCompCodes = [];
        content.components.forEach((newComp) => {
          const { code } = newComp;
          state.compCodes.push(code);
          state.compDatas[code] = newComp;
          state.selectedCompCodes.push(code);
        });
        if (content.canvas) {
          state.canvas = {
            ...state.canvas,
            ...content.canvas,
          };
        }
      },
      prepare(payload) {
        return { payload: { ...payload, _alias: '导入组件' } };
      },
    },
    updateCanvas: {
      reducer(state, action: PayloadAction<{ canvas: AutoDV.Canvas }>) {
        state.canvas = action.payload.canvas;
      },
      prepare(payload) {
        return { payload: { ...payload, _alias: '更新画布' } };
      },
    },
    updateCompRect: {
      reducer(state, action: PayloadAction<{ offset: AutoDV.Rect }>) {
        const { compDatas, selectedCompCodes, compCodes } = state;
        const { offset } = action.payload;
        selectedCompCodes.forEach((scode) => {
          (Object.keys(offset) as []).forEach((k: keyof Omit<AutoDV.Rect, 'rotation'>) => {
            compDatas[scode].attr[k] += Math.round(offset[k]);
          });
        });
        // 更新所属分组的尺寸
        updateAllChildrenRect(selectedCompCodes, compDatas, compCodes, offset);
        // 更新分组尺寸
        updateGroupSize(selectedCompCodes, compCodes, compDatas, state);
      },
      prepare(payload) {
        const { offset } = payload;
        let _alias = '更新位置或大小';
        if (offset.left || offset.top) {
          _alias = '移动组件';
        }
        if (offset.width || offset.height) {
          _alias = '更改大小';
        }
        return { payload: { ...payload, _alias } };
      },
    },
    createGroupComp: {
      reducer(state, action: PayloadAction<{ group: AutoDV.Comp; insertIndex: number }>) {
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
    },
    updateSubComp: {
      reducer(state, action: PayloadAction<{ parentCode: string; code: string; comp: AutoDV.SubComp }>) {
        const { code, comp, parentCode } = action.payload;
        const compData = state.compDatas[parentCode];
        const subComps = compData.subComponents as AutoDV.SubComp[];
        const subCompsIndex = subComps.findIndex((item) => item.code === code);
        if (subCompsIndex !== -1) {
          (state.compDatas[parentCode].subComponents as any[])[subCompsIndex] = comp;
        }
      },
      prepare(payload) {
        return { payload: { ...payload, _alias: '更新子组件' } };
      },
    },
    cancelGroup: {
      reducer(state, action: PayloadAction<{ code: string }>) {
        const { compDatas, compCodes } = state;
        const { code } = action.payload;
        const groupChildren = getAllChildren(code, compCodes, compDatas);
        const groupIndex = compCodes.indexOf(code);
        groupChildren.forEach((item) => {
          compDatas[item].config.groupCode = compDatas[code].config.groupCode;
        });
        compCodes.splice(groupIndex, 1);
        delete compDatas[code];
        state.selectedCompCodes = [];
      },
      prepare(payload) {
        return { payload: { ...payload, _alias: '取消分组' } };
      },
    },
    setCompAlignment: {
      reducer(state, action: PayloadAction<{ alignType: AutoDV.AlignType }>) {
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
      prepare(payload: { alignType: AutoDV.AlignType }) {
        const alignMap: Record<AutoDV.AlignType, string> = {
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
    },

    setKeypress(state, action) {
      state.keyPressed = action.payload;
    },
  },
});

export const appAction = appSlice.actions;

export default appSlice.reducer;
