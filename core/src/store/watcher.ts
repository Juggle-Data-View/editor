/* eslint-disable @typescript-eslint/no-var-requires */
import store from './index';
import watch from 'redux-watch';
import objectPath from 'object-path';
import { debounce } from 'lodash';
import notice from '@utils/notice';
import { Diff, DiffNew } from 'deep-diff';
import { validComp } from 'helpers/jsonValider';
import components from './DB/components';
import canvas from './DB/canvas';
import app from './DB/appConfig';
import { JuggleDV } from '@juggle-data-view/types';
import { CompInstEditReqData, CompInstReqData } from '@utils/request';
import { getAppID } from '@utils/index';

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

      if (newVal.appId !== oldVal.appId) {
        return await canvas.addCanvas(newVal);
      }

      // for of每次迭代都会触发一种请求
      for (const kind of Object.keys(obj)) {
        const payload: any = []; // request data
        const newValKey = Object.keys(obj[kind]);

        if (kind !== 'E' && !newValKey.includes('mountComp')) {
          throw new Error(`listener error: ${kind}`);
        }
        Object.keys(obj[kind]).forEach((key) => {
          payload.push({
            key,
            value: newVal[key],
          });
        });

        await canvas.updateCanvas(payload, newVal.id);
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
      const appId = getAppID();
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
          await addComponents(payload as JuggleDV.Comp[], appId);

          // 创建分组组件和粘贴已经分组的组件需要排序
          if (
            (payload.length === 1 && (payload[0] as JuggleDV.Comp).compCode === 'group') ||
            (payload[0] as JuggleDV.Comp).config.groupCode
          ) {
            await sortComponents(store.getState().autoDV.present.compCodes, appId);
          }
        }

        if (kind === 'D') {
          // 删除组件
          codes.forEach((code) => payload.push(code));

          await deleteComponet(codes, appId);
        }

        if (kind === 'E') {
          // 修改组件
          // eslint-disable-next-line no-loop-func
          datas.forEach((data, index) => {
            const code = codes[index];
            (Object.keys(data) as (keyof JuggleDV.Comp)[]).forEach((key) => {
              payload.push({
                code,
                key,
                value: newVal[code][key],
              });
            });
          });
          // 发起请求
          await updateComponets(payload as CompInstEditReqData[], appId);
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
      const appId = getAppID();
      if (diffs.length && oldVal.length === newVal.length) {
        await sortComponents(newVal, appId);
      }
      // app.updateAppConfigVersion(appId, store.getState().autoDV.present.version);
    } catch (error: any) {
      const errMsg = error.message ? error.message : '请求错误';
      notice.error(`排序失败: ${errMsg}`);
    }
  });

  listen('autoDV.present.app', (newVal: any, oldVal: any) => {
    const { id: newId } = newVal;
    const { id: oldId } = oldVal;

    const appId = getAppID();
    if (newId === oldId) {
      app.updateAppConfig(newVal, appId);
    } else {
      app.cloneAppConfig(newId, oldId);
    }
  });
  listen('autoDV.present', (newVal: any) => {
    const appId = getAppID();
    app.updateAppConfigVersion(appId, newVal.version);
  });
};

export default setupWatch;
