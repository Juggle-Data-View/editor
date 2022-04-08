/**
 * 在画布上创建组件逻辑
 *
 * 组件的来源可能是导入、粘贴、创建自菜单
 */

import { nanocode } from 'utils';
import { validComp } from 'helpers/jsonValider';
import { getJuggleDV } from 'utils';
import { JuggleDV } from '@juggle-data-view/types';

/**
 * 给定旧的内容，返回转换后的内容
 * 该函数会在导入、粘贴被调用
 */
export const transContent = (content: JuggleDV.ExportContent, options?: { offset: number }) => {
  try {
    const state = getJuggleDV();
    const isSameSpace = !!(content.userId === state.app.userId);

    let groupCache: { oldCode: string; newCode: string }[] = [];
    const updateGroupMap = (comp: JuggleDV.Comp<JuggleDV.Config>, hasGroup?: string) => {
      if (groupCache.length && hasGroup === groupCache[groupCache.length - 1].oldCode) {
        comp.config.groupCode = groupCache[groupCache.length - 1].newCode;
      } else {
        const cacheIndex = groupCache.findIndex((item) => item.oldCode === hasGroup);
        groupCache = groupCache.slice(0, cacheIndex + 1);
        groupCache.length && (comp.config.groupCode = groupCache[groupCache.length - 1].newCode);
      }
    };

    const components = content.components.map((comp) => {
      const newCode = nanocode(comp.compCode);
      const valider = validComp(comp);
      const oldCode = comp.code;
      const hasGroup = comp.config.groupCode;

      if (options?.offset) {
        comp.attr.left += options?.offset;
        comp.attr.top += options?.offset;
      }

      if (valider.error) {
        throw new Error('组件配置校验失败，请检查配置格式是否正确');
      }

      comp.code = newCode; // 导入时重置 code

      // 如果导入的配置不是相同的空间，需要修改数据源类型为静态数据类型
      if (!isSameSpace && comp.dataConfig) {
        comp.dataConfig.dataSourceId = '';
      }

      if (comp.compCode === 'group') {
        updateGroupMap(comp, hasGroup);
        groupCache.push({
          oldCode,
          newCode,
        });
        return comp;
      }
      if (!hasGroup) {
        groupCache = [];
        return comp;
      }

      if (!groupCache.length) {
        comp.config.groupCode = undefined;
        return comp;
      }

      updateGroupMap(comp, hasGroup);

      return comp;
    });

    return {
      ...content,
      components,
    };
  } catch (error) {
    throw error;
  }
};
