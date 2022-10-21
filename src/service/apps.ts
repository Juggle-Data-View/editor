import { JuggleDV } from '@juggle-data-view/types';
import { cloneDeep, omit } from 'lodash';
import { Object as ObjectInst, Query, User } from 'parse';

type OverrideCanvas = Omit<JuggleDV.Canvas, 'appId'>;
type OverrideAppConfig = Omit<JuggleDV.AppConfig, 'id' | 'canvas'>;
type OverrideComps = Omit<JuggleDV.Comp, 'id'>;

export interface FormatAppConfig extends OverrideAppConfig {
  canvas: OverrideCanvas & {
    compInsts?: OverrideComps[];
  };
}

const formatAppConfig = (state: JuggleDV.State): FormatAppConfig => {
  const { compDatas, app, canvas, version } = state;
  const newApp = omit(cloneDeep(app), 'id');
  const newCanvas = omit(cloneDeep(canvas), 'appId');
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
    version,
    ...newApp,
    canvas: {
      ...newCanvas,
      compInsts,
    },
  };
};

export const createNewApps = (params: JuggleDV.State): Promise<ObjectInst<Parse.Attributes>> => {
  const Applications = ObjectInst.extend('Applications');
  const user = User.current();
  const applications = new Applications();
  applications.set(formatAppConfig(params));
  applications.set('user', user);
  return applications.save();
};

export const queryAppByID = async (id: string) => {
  const Applications = ObjectInst.extend('Applications');
  const user = User.current();
  const applications = new Applications();
  const query = new Query(applications);
  return query.equalTo('objectId', id).equalTo('user', user).first();
};

export const queryAppByIDWithoutUser = async (id: string) => {
  const Applications = ObjectInst.extend('Applications');
  const applications = new Applications();
  const query = new Query(applications);
  return query.equalTo('objectId', id).first();
};

export const updateApp = (obj: ObjectInst<Parse.Attributes>, data: JuggleDV.State) => {
  const user = User.current();
  obj.set(formatAppConfig(data));
  obj.set('user', user);
  return obj.save();
};
