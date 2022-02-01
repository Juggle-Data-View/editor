/**
 * 封装action中的通用逻辑
 */

import { getAutoDV, nanocode } from 'utils';
import notice from 'utils/notice';
import { asyncLoadStaticData, asyncLoadCompConfig } from 'helpers/asyncLoad';
import { merge, cloneDeep, random } from 'lodash';
import { defaultCompData } from 'config/defaults';
import store from 'store/index';
import { appAction } from 'store/features/appSlice';
import copy from 'copy-to-clipboard';
import { COPY_KEY } from 'config/const';
import dayjs from 'dayjs';
import { getAllSelectedComps } from 'utils/getAllChildren';

// 复制组件
// undo会影响复制后的数据，如果触发了undo，需在undo后重新执行复制操作。
export const COPY_COMP = () => {
  const { selectedCompCodes, compDatas, app, compCodes } = getAutoDV();
  if (!selectedCompCodes.length) {
    notice.warn('请选择组件');
    return;
  }
  const copyContent: AutoDV.ExportContent = {
    name: app.name,
    exportTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    spaceId: app.spaceId,
    components: getAllSelectedComps(selectedCompCodes, compDatas, compCodes).map((code) => compDatas[code]),
  };
  copy(`${COPY_KEY}${JSON.stringify(copyContent)}`);
  notice.success('已复制到剪贴板');
};

// 删除组件
export const DELETE_COMP = () => {
  const { selectedCompCodes } = getAutoDV();
  const Len = selectedCompCodes.length;
  if (!Len) {
    return;
  }
  const content = `是否要删除选中的<b style="color:red"> ${Len} </b>个组件？`;
  notice.alert(<div dangerouslySetInnerHTML={{ __html: content }} />, {
    icon: 'trash',
    intent: 'warning',
    canEnterKeyConfirm: true,
    onConfirm: () => {
      store.dispatch(appAction.deleteComp());
      notice.success('删除成功');
    },
  });
};

/**
 * 添加组件到画布中
 * @param compId 组件id，在组件菜单中的可以，组成为 {compCode/compTempCode}
 */
export const ADD_COMP = async (compId: string, alias: string) => {
  try {
    const [compCode, compTempCode] = compId.split('/');
    if (!compCode || !compTempCode) {
      throw new Error('缺少组件类型或组件模板！');
    }
    const { template, staticData } = await asyncLoadCompConfig(compCode, compTempCode);
    const selfComp = {
      code: nanocode(compCode),
      compTempCode,
      compCode,
      alias,
      locked: false,
      hided: false,
      attr: Object.assign({}, template.attr, {
        left: random(20, 200),
        top: random(20, 200),
      }),
      title: '',
      config: {},
    };

    //拥有子组件的组件 新增时需要生成子组件的code，并记录子组件的生成顺序
    if (template.subComponents) {
      const codes: string[] = [];

      template.subComponents.forEach((item: any) => {
        const code = nanocode(item.compCode);
        codes.push(code);
        item.code = code;
      });
      template.config.layersSorted = codes;
    }

    const compData = merge(cloneDeep(defaultCompData), template, selfComp);

    if (compData.subComponents && compData.subComponents.length) {
      for await (const item of compData.subComponents) {
        if (item.dataConfig) {
          const staticData = await asyncLoadStaticData(compCode, item.compCode);
          item.dataConfig = {
            ...item.dataConfig,
            // 有静态数据就获取静态数据
            mockData: staticData ? staticData : [],
          };
        }
      }
    }

    // 如果组件有`dataConfig`属性就添加静态数据
    if (template.dataConfig) {
      compData.dataConfig = merge({}, compData.dataConfig, {
        // 有静态数据就获取静态数据
        mockData: staticData ? staticData : [],
      });
    } else {
      delete compData.dataConfig;
    }
    store.dispatch(appAction.addComp({ comps: [compData] }));
    notice.success('创建成功');
  } catch (error) {
    if (error instanceof Error) notice.error(`添加组件失败: ${error.message}`);
  }
};

export const ADD_GROUP_COMP = (attr: AutoDV.Attr, selectedCompCodes: string[]) => {
  const { compCodes } = getAutoDV();
  // const groupItemCode = selectedCompCodes.filter((item) => item !== item);
  const resortSelectCodes = selectedCompCodes.slice().sort((a, b) => {
    return compCodes.indexOf(a) - compCodes.indexOf(b);
  });
  const defaultCompTemp = {
    code: nanocode('group'),
    compTempCode: 'index',
    compCode: 'group',
    alias: '分组',
    locked: false,
    hided: false,
    attr: attr,
    title: '分组',
    config: {
      groupItemCode: resortSelectCodes,
    },
  };
  store.dispatch(
    appAction.createGroupComp({
      group: defaultCompTemp,
      insertIndex: compCodes.indexOf(resortSelectCodes[0]),
    })
  );
};
