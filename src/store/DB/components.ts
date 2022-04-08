import { JuggleDV } from '@juggle-data-view/types';
import { CompInstEditReqData } from 'utils/request';
import Database, { COMP_STORE } from './databaseInit';

class Components extends Database {
  updateComponets = async (payload: CompInstEditReqData[], appId: number) => {
    // console.log('update');
    try {
      const db = await this.dbIns;
      for await (const { code, key, value } of payload) {
        const keyrange = IDBKeyRange.only([appId, code]);
        const cursor = await db.transaction(COMP_STORE, 'readwrite').objectStore(COMP_STORE).openCursor(keyrange);
        if (cursor) {
          const compConfig = {
            ...cursor.value,
            [key]: value,
          };
          await cursor.update(compConfig);
        } else {
          throw new Error(`Can't update value, ${appId}, ${code}, ${key}`);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  sortComponents = async (payload: string[], appId: number) => {
    try {
      const db = await this.dbIns;
      const createTime = Date.now();
      let offet = 0;
      for await (const code of payload) {
        const keyrange = IDBKeyRange.only([appId, code]);
        const cursor = await db.transaction(COMP_STORE, 'readwrite').objectStore(COMP_STORE).openCursor(keyrange);
        if (cursor) {
          const compConfig = {
            ...cursor.value,
            createTime: createTime + offet++,
          };
          await cursor.update(compConfig);
        } else {
          throw new Error(`Can't resort components, ${appId}, ${code}`);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  deleteComponet = async (codes: string[], appId: number) => {
    try {
      const db = await this.dbIns;
      for await (const code of codes) {
        const keyrange = IDBKeyRange.only([appId, code]);
        const cursor = await db.transaction(COMP_STORE, 'readwrite').objectStore(COMP_STORE).openCursor(keyrange);
        if (cursor) {
          await cursor.delete();
        } else {
          throw new Error(`Can't delete record, ${appId}, ${code}`);
        }
      }
    } catch (error) {}
  };

  addComponents = async (payload: JuggleDV.Comp[], appId: number) => {
    try {
      const db = await this.dbIns;
      const createTime = Date.now();
      return Promise.all(
        payload.map(async (item, index) => {
          const comp = { ...item, createTime: createTime + index, id: appId };
          // await db.add(COMP_STORE, );
          const objectStore = db.transaction(COMP_STORE, 'readwrite').objectStore(COMP_STORE);

          objectStore.add(comp);
          return { code: item.code };
        })
      );
    } catch (error) {
      throw new Error();
    }
  };
}

export default new Components();
