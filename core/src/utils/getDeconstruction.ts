import { JuggleDV } from '@juggle-data-view/types';
import { omit } from 'lodash';

const getDeconstruction = (config: JuggleDV.AppConfig, id: number) => {
  const canvas = omit(config.canvas, 'compInsts');
  return {
    app: omit(config, 'canvas'),
    canvas: { ...canvas, canvasId: canvas.id, id },
    components:
      config.canvas.compInsts?.reduce(
        (prev, curr) => ({ ...prev, [curr.code]: { ...curr, id } }),
        {} as { [key: string]: JuggleDV.Comp & { id: number } }
      ) || {},
  };
};
export default getDeconstruction;
