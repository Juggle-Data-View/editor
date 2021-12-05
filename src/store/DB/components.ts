import { DB, COMP_STORE } from '.';

class Components extends DB {
  constructor() {
    super();
    console.log('init components store ');
  }

  updateComponets = async () => {
    console.log('update');
  };

  addComponents = async (payload: AutoDV.Comp[]) => {
    try {
      const db = await this.dbIns;
      payload.forEach((item) => {
        db.add(COMP_STORE, { id: 146, ...item });
      });
    } catch (error) {
      if (error) {
        console.log(error);
      } else {
        console.log('Add components success');
      }
    }
  };
}

export default new Components();
