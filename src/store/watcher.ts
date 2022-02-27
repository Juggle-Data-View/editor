/* eslint-disable @typescript-eslint/no-var-requires */
import store from './index';
import watch from 'redux-watch';
import objectPath from 'object-path';
import { debounce } from 'lodash';
import notice from 'utils/notice';
import { Diff, DiffNew } from 'deep-diff';
import { validComp } from 'helpers/jsonValider';
import components from './DB/components';
import canvas from './DB/canvas';
import app from './DB/appConfig';
import global from 'utils/global';

const differ = require('deep-diff');

const listen = (path: string, callback: any) => {
  let diffs: any = [];
  const watcher = watch(store.getState, path);
  const debouncer = debounce((newVal: any, oldVal: any) => {
    callback && callback(newVal, oldVal, diffs);
    diffs = [];
  }, 200);
  return store.subscribe(
    watcher((newVal: any, oldVal: any) => {
      const diff = differ(oldVal, newVal);
      if (diff) {
        diffs = diffs.concat(diff);
      }
      debouncer(newVal, oldVal);
    })
  );
};

const setupWatch = () => {
  /**
   * listen canvas property change
   */
  listen('autoDV.present.canvas', async (newVal: any, oldVal: any, diffs: any) => {
    try {
      const obj: any = {};

      diffs.forEach((diff: any) => {
        const { path, kind } = diff;
        if (!path) return;
        if (!obj[kind]) {
          obj[kind] = {};
        }
        objectPath.set(obj[kind], path, {});
      });

      // for of每次迭代都会触发一种请求
      for (const kind of Object.keys(obj)) {
        const payload: any = []; // request data
        if (kind !== 'E') {
          throw new Error(`listener error: ${kind}`);
        }
        Object.keys(obj[kind]).forEach((key) => {
          payload.push({
            key,
            value: newVal[key],
          });
        });

        await canvas.updateCanvas(payload, Number(global.canvasId));
      }
    } catch (error: any) {
      notice.error(`更新画布失败: ${error.message}`);
    }
  });

  /**
   * listen component property change
   */
  listen('autoDV.present.compDatas', async (newVal: any, oldVal: any, diffs: Diff<any>[]) => {
    try {
      const obj: any = {};
      const { addComponents, updateComponets, deleteComponet, sortComponents } = components;
      diffs.forEach((diff) => {
        const { path, kind } = diff;
        if (!path) return;
        if (path.length === 1) {
          if (!obj[kind]) {
            obj[kind] = {};
          }
          if (kind === 'N') {
            objectPath.set(obj[kind], path, (diff as DiffNew<any>).rhs);
          }
          if (kind === 'D') {
            objectPath.set(obj[kind], path, {});
          }
        } else {
          if (!obj['E']) {
            obj['E'] = {};
          }
          objectPath.set(obj['E'], path, {});
        }
      });

      // obj = {N: {}, D: {}, E: {}, A: {}}
      for (const kind of Object.keys(obj)) {
        const payload: CompInstReqData = []; // request data

        const codes = Object.keys(obj[kind]);
        const datas: any[] = Object.values(obj[kind]);

        if (kind === 'N') {
          // 新增组件
          datas.forEach((data) => {
            const valid = validComp(data);
            if (valid.success) {
              payload.push(data);
            } else {
              notice.error('组件配置修改失败，打开控制台查看错误原因.');
              console.error('组件修改失败：', valid.message, data);
            }
          });
          // 请求新增组件，返回添加成功的组件实例信息
          await addComponents(payload as AutoDV.Comp[], Number(global.appId));

          // 创建分组组件和粘贴已经分组的组件需要排序
          if (
            (payload.length === 1 && (payload[0] as AutoDV.Comp).compCode === 'group') ||
            (payload[0] as AutoDV.Comp).config.groupCode
          ) {
            await sortComponents(store.getState().autoDV.present.compCodes, Number(global.appId));
          }
        }

        if (kind === 'D') {
          // 删除组件
          codes.forEach((code) => payload.push(code));

          await deleteComponet(codes, Number(global.appId));
        }

        if (kind === 'E') {
          // 修改组件
          // eslint-disable-next-line no-loop-func
          datas.forEach((data, index) => {
            const code = codes[index];
            (Object.keys(data) as (keyof AutoDV.Comp)[]).forEach((key) => {
              payload.push({
                code,
                key,
                value: newVal[code][key],
              });
            });
          });
          // 发起请求
          await updateComponets(payload as CompInstEditReqData[], Number(global.appId));
        }
      }
    } catch (error: any) {
      console.log(error);
      const errMsg = error.message ? error.message : '请求错误';
      // TODO: 数据更新失败是否需要回退到更新前的数据，待定。
      notice.error(`组件配置更新失败: ${errMsg}`);
    }
  });

  /**
   * listen canvas sorted change
   */
  listen('autoDV.present.compCodes', async (newVal: string[], oldVal: string[], diffs: any) => {
    try {
      // 有diff数据，且上次和这次的数组长度一致，才会触发排序请求
      const { sortComponents } = components;
      if (diffs.length && oldVal.length === newVal.length) {
        await sortComponents(newVal, Number(global.appId));
      }
    } catch (error: any) {
      const errMsg = error.message ? error.message : '请求错误';
      notice.error(`排序失败: ${errMsg}`);
    }
  });

  listen('autoDV.present.app', async (newVal: any) => {
    await app.updateAppConfig(newVal, Number(global.appId));
  });
};

export default setupWatch;
