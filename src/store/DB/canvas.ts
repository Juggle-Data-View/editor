import { DB, CANVAS_STORE } from '.';

class Canvas extends DB {
  updateCanvas = async (payload: UpdateCanvasPayload[], appId: number) => {
    try {
      const db = await this.dbIns;
      for await (const { key, value } of payload) {
        const keyrange = IDBKeyRange.only(appId);
        const cursor = await db.transaction(CANVAS_STORE, 'readwrite').objectStore(CANVAS_STORE).openCursor(keyrange);
        console.log(cursor?.value);
        if (cursor) {
          const canvasConfig = {
            ...cursor.value,
            [key]: value,
          };
          await cursor.update(canvasConfig);
        } else {
          throw new Error(`Can't update canvas prop, ${appId}, ${key}`);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
}
export default new Canvas();
