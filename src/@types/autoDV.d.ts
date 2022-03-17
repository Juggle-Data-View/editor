import { INodeConfig } from 'components/recursion';
import * as Const from 'config/const';
import { PayloadAction, PrepareAction } from '@reduxjs/toolkit';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  declare namespace AutoDV {
    type AppID = number | null; // 页面ID
    type SpaceID = number | null; // 空间ID
    type CanvasID = number | null; // 画布ID

    /**
     * scale way
     *  0 - normal
     *  1 - 等比缩放&宽度铺满，画布宽度与浏览器可视区宽度一致，可视区高度小于画布高度时可上下滚动
     *  2 - 等比缩放&⾼度铺满，画布高度与浏览器可视区高度一致，可视区宽度小于画布宽度时可左右滚动
     *  3 - 全屏铺满，画布尺寸与可视区一致，会拉伸。
     *  4 - 宽度铺满&上下居中
     *  5 - 高度铺满&左右居中
     */
    type ZoomType = 0 | 1 | 2 | 3 | 4 | 5;

    interface DataConfig {
      dataSourceId: DataSourceId;
      //All components request data frequency of using the datasrouce
      frequency?: number;
      //request params
      dataParams?: DataParam[];
      //datasource operation set
      operator?: string[];
      name: string;
      //datasource data cache
      body: any;
    }

    type HttpHeadersKeys = keyof IncomingHttpHeaders;
    interface HeadersArrayItem {
      key: HttpHeadersKeys;
      value?: string | boolean;
    }
    interface APIDatasourceInstance extends DataConfig {
      dataSourceType: Const.DataSourceType.API;
      url: string;
      method: Const.HttpMethod;
      header?: HeadersArrayItem[];
    }

    interface StaticDatasourceInstance extends DataConfig {
      dataSourceType: Const.DataSourceType.Static;
    }

    interface ExeclDatasourceInstance extends DataConfig {
      // execl storage url
      url: string;
      dataSourceType: Const.DataSourceType.CSV;
    }

    type MixinDatasource = APIDatasourceInstance | StaticDatasourceInstance | ExeclDatasourceInstance;
    interface AppConfig {
      canvas: Canvas & {
        compInsts?: Comp[];
      };
      datasources: {
        [key in DataSourceId]: MixinDatasource;
      };
      createTime?: number;
      createUser?: string;
      id: AppID;
      modifyTime?: number;
      modifyUser?: string;
      name: string; // 页面标题
      spaceId: SpaceID;
      type?: number; // 是否是实验室大屏(websocket)
    }

    interface UndoState {
      past: State[];
      present: State;
      future: State[];
      _latestUnfiltered: State;
    }

    /** AutoDV状态，包含系统主要数据 */
    interface State {
      app: Omit<AppConfig, 'canvas'>;
      /** 画布信息 */
      canvas: Canvas;
      /**
       * 组件实例code的集合，存放 Comp['code']
       */
      compCodes: string[];
      /**
       * 组件实例配置的集合
       */
      compDatas: {
        [code: string]: Comp;
      };

      /** 选中的组件实例 */
      selectedCompCodes: string[];
      /** 复制数据 */
      copyComps: Comp[];

      actionAlias?: string;

      keyPressed: ModifierKey;
    }

    type PanelName = 'compList' | 'compProps' | 'history';

    type AlignType =
      | 'left'
      | 'horizontalCenter'
      | 'right'
      | 'top'
      | 'verticalCenter'
      | 'bottom'
      | 'horizontalJustified'
      | 'verticalJustified';

    type ModifierKey = 'meta' | 'alt' | 'control' | 'shift' | null;

    /** 编排状态 */
    interface Editor {
      /** 画布比例 */
      canvasRatio: number;
      canvasPadding: number;
      panel: Record<PanelName, boolean>;
      theme: 'light' | 'dark';
      hoverIndex: number[];
      guideLines: GuideLine;
      adaptiveScale: number;
      isSelecto: boolean;
      rightPannelType: 'global' | 'component' | 'multiple-select' | 'group' | 'hidden';
      lang: 'zh' | 'en';
    }

    /** 数据源相关 */

    interface Field {
      /** 数据源映射字段名称 */
      compFieldName: string;
      /** 数据源映射字段值  */
      sourceFieldName: string;
      /** source data field alias name*/
      alias?: string;

      //TODO: Declare filter type as function name
      /** current map filter */
      filter?: string;
    }

    interface DataParam {
      name: string;
      value: string;
    }
    interface Config {
      groupCode?: string;
      // 占位块
      placeholder?: {
        size: number;
        color: string;
      };
    }

    type DataSourceType = Const.DataSourceType;

    type DataSourceId = number | string;

    // 数据源组辅助结构
    interface JsonMap {
      //数据源组组件的唯一标示
      sourceCode: string | null;
      //转换使用的辅助结构
      auxFieldMap: Field[];
    }
    interface Canvas {
      appId: AppID;
      backgroundColor: string;
      backgroundImg: string;
      createUser?: string;
      createTime?: string;
      height: number;
      id: CanvasID;
      modifyUser?: string;
      modifyTime?: string;
      thumbnail: string; // 缩略图
      width: number;
      zoomType: ZoomType;
    }

    /**
     * 组件位置与大小
     */
    interface Rect {
      left: number;
      top: number;
      width: number;
      height: number;
    }

    interface Attr extends Rect {
      angle: number;
      scale: number[];
      lock: boolean;
      opacity: number;
    }

    /**
     * Component instance
     */
    interface Comp<C = Config> {
      /**
       * 组件英文名称（组件类型）。值对应项目`@/components/comps/`下的目录名称。
       */
      readonly compCode: string;
      /** 组件中文别名 */
      readonly alias: string;
      /**
       * 组件模板名称，默认值为`index`。对应路径关系如下：
       * 为默认值时，index模板的路径为：`@/components/comps/{compCode}/config.tsx`
       * 为其他值(如: temp1)时，路径为：`@/components/comps/{compCode}/config_temp1.tsx`
       */
      readonly compTempCode: string;
      /**
       * 组件创建时间
       */
      readonly createTime: number;
      /**
       * 组件实例唯一code。例如: commonTitle_e72a6d
       */
      code: string;
      /** 组件标题，用户可自定义 */
      title: string;
      /** 组件自身属性 */
      attr: Attr;
      /** 组件配置 */
      config: C;
      /** 组件数据配置，没有数据源功能的组件可以不加此属性 */
      dataConfig?: CompDataConfig;
      /** 组件是否锁定，true时,无法选中,拖拽  */
      locked: boolean;
      /** 组件是否隐藏 */
      hided: boolean;
      /** 组件缩略图 */
      compThumb?: string;
    }

    interface AddCompParams extends Comp {
      staticData: any;
    }

    // 组件属性自带的状态
    type ICompOwnStatus = Pick<Comp, 'locked' | 'hided'>;

    interface ColorStop {
      /** 数值为0-1,可选的终点位置（可以是一个百分比值或者是沿着渐变轴的<length>） */
      offset: number;
      /** 色值 */
      color: string;
      /** 透明度 */
      opacity?: number;
    }

    interface ColorResult {
      /** 线性渐变、径向渐变  */
      type: 'linear' | 'radial';
      /** 旋转角度 */
      angle: number;
      /** 多个颜色 */
      colorStops: ColorStop[];
    }

    /**
     * 画布中展示组件的属性类型
     * @param C 自定义的`config`类型
     * @param S 自定义的`souceData`类型
     */
    interface CompIndex<C = Config, S = unknown> {
      /** 组件配置，组合类型，每个组件的配置类型都不同  */
      compData: Comp<C>;
      /** 组件是否选中 */
      isSelected: boolean;
      /** 组件会在编排、预览时使用，此属性可判断组件当前所在位置 */
      isInEditor: boolean;
      /** 组件数据，公式为：`sourceData = dataTranslater(originData, fieldMap)` */
      sourceData: S;
      /** 数据更新函数，在组件内需要更新数据时可以调用 */
      updateData?: () => void;
    }

    /**
     * 业务组件`Props.tsx`的属性声明
     * @param C 业务组件自定义的`config`类型
     * @param O 业务数据，来源可能为静态数据or服务端下发
     */
    interface PropsCompProps<C = Config> {
      /** 组件配置，泛型，每个组件的配置类型都不同 */
      compData: Comp<C>;
      /** 组件完整的model，如：autoDV.present.compDatas.searchInput_9c531a */
      // model: string;
      /** 子组件的配置组件*/
      parentCompCode?: string;
      /** 是否需要加载通用组件配置，默认需要*/
      noNeedPropsCommon?: boolean;
      /**
       * 自定义起始路径
       */
      parentName?: string;
      /**
       * 父组件的code
       */
      parentCode?: string;
    }

    /**
     * 每个组件配置中可能包含的基础结构
     */
    interface BaseCompConfig {
      decorationId: string;
      groupId: string;
    }

    interface CompDataConfig {
      dataSourceId: DataSourceId;
      //data field map to component field
      fieldMap: Field[];
      //independence request data frequency
      frequency: number;
      autoRefresh: boolean;
      //sub-datasource filed mapping path
      jsonMap?: JsonMap;
      //component data
      sourceData: any[];
    }

    /**
     * 业务组件模板 类型
     * 用于约定业务组件`temps`目录下文件中的配置项类型
     */
    type CompTemp<C = any> = Pick<Comp<C>, 'title' | 'config'> & {
      attr: Partial<Attr>;
      dataConfig?: Partial<CompDataConfig>;
    };

    interface CompConfig<T = any> {
      /** 组件版本 */
      version: string;
      /** Tab选项，为true时显示 */
      tab: {
        config?: boolean;
        dataset?: boolean;
      };
      /** 额外的Tab选项配置，例如：交互配置项 */
      extraTab?: Array<{ title: string; component: React.ComponentType<PropsCompProps> }>;
      /** 组件信息 */
      template: CompTemp<T>;
      /** 组件表单配置信息 */
      forms: INodeConfig | INodeConfig[];
      /** 静态数据 */
      staticData?: any[];
    }

    interface ExportContent {
      name: string;
      exportTime: string;
      spaceId: SpaceID;
      components: Comp[];
      canvas?: {
        backgroundColor: string;
        backgroundImg: string;
        width: number;
        height: number;
        thumbnail: string;
        zoomType: Canvas['zoomType'];
      };
    }

    interface GuideLine {
      visible: boolean;
      h: number[];
      v: number[];
    }

    // 一种自定义的数据状态，当服务端未下发数据时使用自定义数据在组件之间通信
    interface CustomOriginData {
      id: string; // 使用id作为自定义数据的唯一标识
      status: 'idle' | 'pendding' | 'success' | 'error';
      code: number;
      message: string;
    }

    interface ReducerCaseWithPrepare<Payload = any> {
      reducer(s: State, action: PayloadAction<Payload>): void;
      prepare: PrepareAction<Payload>;
    }

    type ReducerCase<Payload = undefined> = (s: State, action: PayloadAction<Payload>) => void;
  }
}
