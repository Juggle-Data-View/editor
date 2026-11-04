import { JuggleDV } from '@juggle-data-view/types';
import { DataSourceType, HttpMethod } from '@configurableComponents/const';

/** Stable ids so IndexedDB keys stay numeric (the existing DB coerces ids with Number()). */
export const DEMO_APP_ID = 2022110401;
export const SANDBOX_APP_ID = 2022110402;
/** Bump when the seeded pages should replace a dashboard already stored in the browser. */
export const DEMO_SEED_VERSION = 2;

const TELEMETRY_URL = 'https://pay.ashesborn.cloud/api/v1/telemetry';
const DATASETS_URL = 'https://pay.ashesborn.cloud/api/v1/datasets';

const textStyle = (fontSize: number, color = '#e8f1ff', align: 'left' | 'right' = 'left') => ({
  display: 'flex',
  color,
  fontSize,
  lineHeight: 1.3,
  fontWeight: fontSize > 24 ? 600 : 400,
  letterSpacing: 0,
  justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
  alignItems: 'center',
  textAlign: align,
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

const apiBinding = (id: string, pairs: Array<[string, string]>): JuggleDV.CompDataConfig => ({
  dataSourceType: DataSourceType.API,
  dataSourceId: id,
  fieldMap: fields(pairs),
  frequency: 0,
  autoRefresh: false,
  sourceData: [],
});

let compOrder = 1;
const comp = (
  input: Pick<JuggleDV.Comp, 'code' | 'compCode' | 'alias' | 'attr'> &
    Partial<JuggleDV.Comp> & { config: Record<string, unknown> }
): JuggleDV.Comp => ({
  version: '1.0.0',
  title: '',
  locked: false,
  hided: false,
  ...input,
  createTime: compOrder++,
  config: input.config as JuggleDV.Config,
});

const apiSource = (id: string, name: string, url: string): JuggleDV.APIDatasourceInstance => ({
  dataSourceId: id,
  name,
  dataSourceType: DataSourceType.API,
  url,
  method: HttpMethod.GET,
  isProxy: false,
  header: [],
  dataParams: [],
  body: null,
  frequency: 0,
});

const liveDatasources = {
  telemetry: apiSource('telemetry', 'x402 telemetry', TELEMETRY_URL),
  datasets: apiSource('datasets', 'x402 datasets', DATASETS_URL),
};

/**
 * Main page. Components bind to the two API datasources through field maps.
 * `a.b` reads a nested field. `list[].field` expands that array into rows.
 */
const demoApp: JuggleDV.AppConfig = {
  version: DEMO_SEED_VERSION,
  createTime: 1700000000000,
  createUser: 'demo',
  id: DEMO_APP_ID,
  modifyTime: 1700000000000,
  modifyUser: 'demo',
  name: 'x402 paid API telemetry',
  userId: -1,
  datasources: liveDatasources,
  canvas: {
    id: DEMO_APP_ID,
    appId: DEMO_APP_ID,
    thumbnail: '',
    backgroundColor: '#0b1b2b',
    backgroundImg: '',
    width: 1920,
    height: 1180,
    zoomType: 0,
    compInsts: [
      comp({
        code: 'common-title_heading',
        compCode: 'common-title',
        alias: '标题',
        attr: attr(40, 18, 1200, 52),
        config: {
          title: 'x402 paid API telemetry',
          style: textStyle(34),
          link: { url: '', isBlank: false },
        },
      }),
      comp({
        code: 'common-title_samples',
        compCode: 'common-title',
        alias: '示例页',
        attr: attr(1280, 28, 600, 36),
        config: {
          title: 'Remote component failure samples',
          style: textStyle(15, '#8eb7ff', 'right'),
          link: { url: '/editor/canvas?id=2022110402', isBlank: false },
        },
      }),
      comp({
        code: 'common-title_live',
        compCode: 'common-title',
        alias: '数据时间',
        attr: attr(40, 74, 1500, 32),
        config: {
          title: '',
          prefix: 'Live data from pay.ashesborn.cloud, updated ',
          fallback: 'Live data from pay.ashesborn.cloud, data unavailable',
          style: textStyle(15, '#9bb0c9'),
          link: { url: '', isBlank: false },
        },
        dataConfig: apiBinding('telemetry', [['value', 'generated_at']]),
      }),
      comp({
        code: 'kpi_papers',
        compCode: 'kpi',
        alias: '论文',
        attr: attr(40, 122, 352, 118),
        config: { label: 'Papers' },
        dataConfig: apiBinding('telemetry', [['value', 'corpus.papers']]),
      }),
      comp({
        code: 'kpi_edges',
        compCode: 'kpi',
        alias: '引用边',
        attr: attr(408, 122, 352, 118),
        config: { label: 'Citation edges' },
        dataConfig: apiBinding('telemetry', [['value', 'corpus.citation_edges']]),
      }),
      comp({
        code: 'kpi_retractions',
        compCode: 'kpi',
        alias: '撤稿',
        attr: attr(776, 122, 352, 118),
        config: { label: 'Retractions' },
        dataConfig: apiBinding('telemetry', [['value', 'corpus.retractions']]),
      }),
      comp({
        code: 'kpi_settlements',
        compCode: 'kpi',
        alias: '主网结算',
        attr: attr(1144, 122, 352, 118),
        config: { label: 'Mainnet settlements' },
        dataConfig: apiBinding('telemetry', [['value', 'payments.mainnet.settlements']]),
      }),
      comp({
        code: 'kpi_volume',
        compCode: 'kpi',
        alias: '主网金额',
        attr: attr(1512, 122, 368, 118),
        config: { label: 'Mainnet volume', suffix: ' USDC' },
        dataConfig: apiBinding('telemetry', [['value', 'payments.mainnet.volume_usdc']]),
      }),
      comp({
        code: 'pie_networks',
        compCode: 'pie',
        alias: '结算分布',
        attr: attr(40, 264, 620, 400),
        config: {
          title: 'Settlements by network',
          slices: [
            { name: 'Mainnet', field: 'mainnet' },
            { name: 'Testnet', field: 'testnet' },
          ],
        },
        dataConfig: apiBinding('telemetry', [
          ['mainnet', 'payments.mainnet.settlements'],
          ['testnet', 'payments.testnet.settlements'],
        ]),
      }),
      comp({
        code: 'base-bar_recent',
        compCode: 'base-bar',
        alias: '近期结算',
        attr: attr(680, 264, 1200, 400),
        config: { title: 'Recent mainnet settlements' },
        dataConfig: apiBinding('telemetry', [
          ['x', 'payments.recent_mainnet[].settled_at'],
          ['y', 'payments.recent_mainnet[].amount_usdc'],
        ]),
      }),
      comp({
        code: 'data-table_tx',
        compCode: 'data-table',
        alias: '交易',
        attr: attr(40, 688, 920, 460),
        config: {
          title: 'Recent mainnet transactions',
          columns: [
            { field: 'network', label: 'Network', format: 'network' },
            { field: 'amount', label: 'USDC' },
            { field: 'settled_at', label: 'Settled', format: 'time' },
            { field: 'tx', label: 'Transaction', format: 'short', linkField: 'url' },
          ],
        },
        dataConfig: apiBinding('telemetry', [
          ['network', 'payments.recent_mainnet[].network'],
          ['amount', 'payments.recent_mainnet[].amount_usdc'],
          ['settled_at', 'payments.recent_mainnet[].settled_at'],
          ['tx', 'payments.recent_mainnet[].transaction'],
          ['url', 'payments.recent_mainnet[].explorer_url'],
        ]),
      }),
      comp({
        code: 'data-table_datasets',
        compCode: 'data-table',
        alias: '数据集',
        attr: attr(980, 688, 900, 460),
        config: {
          title: 'Dataset pricing',
          columns: [
            { field: 'title', label: 'Dataset' },
            { field: 'synthetic', label: 'Corpus', format: 'synthetic' },
            { field: 'price', label: 'Price', format: 'price' },
          ],
        },
        dataConfig: apiBinding('datasets', [
          ['title', 'datasets[].title'],
          ['synthetic', 'datasets[].synthetic'],
          ['priceCall', 'datasets[].pricing.per_call.usd'],
          ['priceLocal', 'datasets[].pricing.local.usd'],
          ['priceGlobal', 'datasets[].pricing.global.upto.usd'],
        ]),
      }),
    ],
  },
};

export const sandboxAppConfig: JuggleDV.AppConfig = {
  version: DEMO_SEED_VERSION,
  createTime: 1700000000000,
  createUser: 'demo',
  id: SANDBOX_APP_ID,
  modifyTime: 1700000000000,
  modifyUser: 'demo',
  name: 'Remote component samples',
  userId: -1,
  datasources: {},
  canvas: {
    id: SANDBOX_APP_ID,
    appId: SANDBOX_APP_ID,
    thumbnail: '',
    backgroundColor: '#0b1b2b',
    backgroundImg: '',
    width: 1920,
    height: 1080,
    zoomType: 0,
    compInsts: [
      comp({
        code: 'common-title_back',
        compCode: 'common-title',
        alias: '返回',
        attr: attr(48, 36, 700, 40),
        config: {
          title: 'Back to x402 dashboard',
          style: textStyle(16, '#8eb7ff'),
          link: { url: '/editor/canvas?id=2022110401', isBlank: false },
        },
      }),
      comp({
        code: 'common-title_sandbox',
        compCode: 'common-title',
        alias: '说明',
        attr: attr(48, 96, 1400, 80),
        config: {
          title: 'These bundles fail on purpose. The editor keeps running and shows a placeholder.',
          style: textStyle(22),
          link: { url: '', isBlank: false },
        },
      }),
      comp({
        code: 'broken-widget_main',
        compCode: 'broken-widget',
        alias: '渲染异常',
        attr: attr(48, 240, 640, 280),
        config: {},
      }),
      comp({
        code: 'broken-load_main',
        compCode: 'broken-load',
        alias: '加载异常',
        attr: attr(740, 240, 640, 280),
        config: {},
      }),
    ],
  },
};

export default demoApp;
