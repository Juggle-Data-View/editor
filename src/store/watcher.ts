/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * 监听redux数据变化，发起请求.
 * TODO: 完善类型声明
 *
 * 注意：
 * 针对数据变化后发起请求的逻辑，最好是将请求时机放在数据变更后。
 * 如果放在交互行为后发起请求，历史记录的回退操作将不会触发请求，数据无法同步更新。
 */
import store from './index';
import watch from 'redux-watch';
import objectPath from 'object-path';
import { debounce } from 'lodash';
import * as Api from 'utils/api';
import notice from 'utils/notice';
import { Diff, DiffNew } from 'deep-diff';
import { validComp } from 'helpers/jsonValider';
import DB from './DB';
import GV from 'utils/global';

const differ = require('deep-diff');

/**
 * 监听数据变化，将变化以debounce的方式收集
 * @param path 数据路径，如：'autoDV.present.compDatas'
 * @param callback 回调函数，参数依次：newVal: any, oldVal: any, diffs: any
 * @return unSubscribe Function
 */
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

// 创建启动函数，在loadAppcfg后开始设定监听
const setupWatch = () => {
  /**
   * 监听 画布 数据变化
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
        await Api.updateCanvas(payload);
      }
    } catch (error: any) {
      notice.error(`更新画布失败: ${error.message}`);
    }
  });

  /**
   * 监听 组件 数据变化
   */
  listen('autoDV.present.compDatas', async (newVal: any, oldVal: any, diffs: Diff<any>[]) => {
    try {
      const obj: any = {};
      const { addComponents, getConfigByAPPID } = await DB;
      console.log(await getConfigByAPPID(Number(GV.appId), Number(GV.canvasId)));
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
          await addComponents(payload as AutoDV.Comp[]);
          const successAddedDatas = await Api.addComp(payload as AutoDV.Comp[]);

          // 创建分组组件和粘贴已经分组的组件需要排序
          if (
            (payload.length === 1 && (payload[0] as AutoDV.Comp).compCode === 'group') ||
            (payload[0] as AutoDV.Comp).config.groupCode
          ) {
            await Api.resortComp(store.getState().autoDV.present.compCodes);
          }

          const staticDataPayload: CompInstEditReqData[] = [];

          // 遍历接口返回的新增组件实例信息
          // eslint-disable-next-line no-loop-func
          successAddedDatas.forEach((data: { code: string }, index: number) => {
            const { code, dataConfig }: AutoDV.Comp = datas[index];
            if (data.code === code && dataConfig && dataConfig.mockData && dataConfig.mockData.length) {
              // 静态数据在 addComp 时已经放到mockData下
              staticDataPayload.push({
                code,
                key: 'staticData',
                value: dataConfig.mockData,
              });
            }
          });

          if (staticDataPayload.length) {
            // 业务需求：给新增的组件添加静态数据
            await Api.updateComp(staticDataPayload);
          }
        }

        if (kind === 'D') {
          // 删除组件
          codes.forEach((code) => payload.push(code));
          // 发起请求
          await Api.deleteComp(payload as string[]);
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
          await Api.updateComp(payload as CompInstEditReqData[]);
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
   * 监听组件顺序变化
   */
  listen('autoDV.present.compCodes', async (newVal: string[], oldVal: string[], diffs: any) => {
    try {
      // 有diff数据，且上次和这次的数组长度一致，才会触发排序请求
      if (diffs.length && oldVal.length === newVal.length) {
        await Api.resortComp(newVal);
      }
    } catch (error: any) {
      const errMsg = error.message ? error.message : '请求错误';
      notice.error(`排序失败: ${errMsg}`);
    }
  });
};

export default setupWatch;
