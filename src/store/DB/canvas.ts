import { JuggleDV } from '@juggle-data-view/types';
import { UpdateCanvasPayload } from '@utils/request';
import Database, { CANVAS_STORE } from './databaseInit';

class Canvas extends Database {
  updateCanvas = async (payload: UpdateCanvasPayload[], canvasId: number | string) => {
    try {
      const db = await this.dbIns;
      for await (const { key, value } of payload) {
        const keyrange = IDBKeyRange.only(canvasId);
        const cursor = await db.transaction(CANVAS_STORE, 'readwrite').objectStore(CANVAS_STORE).openCursor(keyrange);
        if (cursor) {
          const canvasConfig = {
            ...cursor.value,
            [key]: value,
          };
          await cursor.update(canvasConfig);
        } else {
          throw new Error(`Can't update canvas prop, ${canvasId}, ${key}`);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  deleleCanvas = async (canvasId: number | string) => {
    try {
      const db = await this.dbIns;
      const objectStore = db.transaction(CANVAS_STORE, 'readwrite').objectStore(CANVAS_STORE);
      const keyrange = IDBKeyRange.only(canvasId);
      return objectStore.delete(keyrange);
    } catch (error) {
      console.log(error);
    }
  };

  addCanvas = async (payload: JuggleDV.Canvas) => {
    try {
      const db = await this.dbIns;
      const objectStore = db.transaction(CANVAS_STORE, 'readwrite').objectStore(CANVAS_STORE);
      return objectStore.add({
        ...payload,
        appId: payload.appId,
      });
    } catch (error) {
      return error;
    }
  };
}
export default new Canvas();
