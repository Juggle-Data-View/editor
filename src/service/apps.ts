import { JuggleDV } from '@juggle-data-view/types';
import { cloneDeep, omit } from 'lodash';
import { Object as ObjectInst, User } from 'parse';

type OverrideCanvas = Omit<JuggleDV.Canvas, 'id' | 'appId'>;
type OverrideAppConfig = Omit<JuggleDV.AppConfig, 'id' | 'canvas'>;
type OverrideComps = Omit<JuggleDV.Comp, 'id'>;

export interface FormatAppConfig extends OverrideAppConfig {
  canvas: OverrideCanvas & {
    compInsts?: OverrideComps[];
  };
}

const formatAppConfig = (state: JuggleDV.State): FormatAppConfig => {
  const { compDatas, app, canvas } = state;
  const newApp = omit(cloneDeep(app), 'id');
  const newCanvas = omit(cloneDeep(canvas), 'id', 'appId');
  const { datasources } = newApp;
  for (const key in datasources) {
    const item = datasources[key];
    if (item.dataSourceType === 0) {
      datasources[key] = omit(datasources[key], 'body') as JuggleDV.MixinDatasource;
    }
  }
  const compInsts = Object.keys(compDatas).map((key) => {
    const item = compDatas[key];
    return omit(item, 'id');
  });
  return {
    ...newApp,
    canvas: {
      ...newCanvas,
      compInsts,
    },
  };
};

export const createNewApps = (params: JuggleDV.State) => {
  const Applications = ObjectInst.extend('Applications');
  const user = User.current();
  const applications = new Applications();
  applications.set(formatAppConfig(params));
  applications.set('user', user);
  return applications.save();
};
