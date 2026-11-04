import { JuggleDV } from '@juggle-data-view/types';
import { DataSourceType } from '@configurableComponents/const';

/** Stable id so IndexedDB keys stay numeric (the existing DB coerces ids with Number()). */
export const DEMO_APP_ID = 2022110401;

const textStyle = (fontSize: number, color = '#e8f1ff') => ({
  display: 'flex',
  color,
  fontSize,
  lineHeight: 1.3,
  fontWeight: fontSize > 24 ? 600 : 400,
  letterSpacing: 0,
  justifyContent: 'flex-start',
  alignItems: 'center',
  textAlign: 'left' as const,
});

const attr = (left: number, top: number, width: number, height: number): JuggleDV.Attr => ({
  left,
  top,
  width,
  height,
  angle: 0,
  scale: [1, 1],
  lock: false,
  opacity: 1,
});

const fields = (pairs: Array<[string, string]>): JuggleDV.Field[] =>
  pairs.map(([compFieldName, sourceFieldName]) => ({ compFieldName, sourceFieldName }));

const dataConfig = (id: string, pairs: Array<[string, string]>): JuggleDV.CompDataConfig => ({
  dataSourceType: DataSourceType.Static,
  dataSourceId: id,
  fieldMap: fields(pairs),
  frequency: 0,
  autoRefresh: false,
  sourceData: [],
});

const comp = (
  input: Pick<JuggleDV.Comp, 'code' | 'compCode' | 'alias' | 'attr'> &
    Partial<JuggleDV.Comp> & { config: Record<string, unknown> }
): JuggleDV.Comp => ({
  version: '1.0.0',
  title: '',
  createTime: 1700000000000,
  locked: false,
  hided: false,
  ...input,
  config: input.config as JuggleDV.Config,
});

/**
 * Page JSON. compCode + version point at remote bundles in /components.
 * Datasources are filled at runtime from each bundle's manifest staticData.
 */
const demoApp: JuggleDV.AppConfig = {
  version: 1,
  createTime: 1700000000000,
  createUser: 'demo',
  id: DEMO_APP_ID,
  modifyTime: 1700000000000,
  modifyUser: 'demo',
  name: 'Juggle Data View',
  userId: -1,
  datasources: {},
  canvas: {
    id: DEMO_APP_ID,
    appId: DEMO_APP_ID,
    thumbnail: '',
    backgroundColor: '#0b1b2b',
    backgroundImg: '',
    width: 1920,
    height: 1080,
    zoomType: 0,
    compInsts: [
      comp({
        code: 'common-title_heading',
        compCode: 'common-title',
        alias: '标题',
        attr: attr(48, 28, 900, 72),
        config: {
          title: 'Juggle Data View',
          style: textStyle(40),
          link: { url: '', isBlank: false },
        },
      }),
      comp({
        code: 'common-title_sub',
        compCode: 'common-title',
        alias: '副标题',
        attr: attr(48, 104, 1100, 40),
        config: {
          title: 'Portfolio demo — charts load from /components at runtime',
          style: textStyle(18, '#9bb0c9'),
          link: { url: '', isBlank: false },
        },
      }),
      comp({
        code: 'base-bar_main',
        compCode: 'base-bar',
        alias: '基础柱状图',
        attr: attr(48, 180, 900, 420),
        config: { title: '库存' },
        dataConfig: dataConfig('base-bar', [
          ['x', 'brand'],
          ['y', 'stock'],
        ]),
      }),
      comp({
        code: 'base-line_main',
        compCode: 'base-line',
        alias: '基础折线图',
        attr: attr(980, 180, 890, 420),
        config: { title: '订单趋势' },
        dataConfig: dataConfig('base-line', [
          ['x', 'brand'],
          ['y', 'order'],
        ]),
      }),
      comp({
        code: 'pie_main',
        compCode: 'pie',
        alias: '基础饼图',
        attr: attr(48, 630, 900, 400),
        config: { title: '订单占比' },
        dataConfig: dataConfig('pie', [
          ['name', 'brand'],
          ['value', 'order'],
        ]),
      }),
      comp({
        code: 'broken-widget_main',
        compCode: 'broken-widget',
        alias: '异常组件',
        attr: attr(980, 630, 430, 180),
        config: {},
      }),
      comp({
        code: 'broken-load_main',
        compCode: 'broken-load',
        alias: '加载失败',
        attr: attr(1440, 630, 430, 180),
        config: {},
      }),
    ],
  },
};

export default demoApp;
