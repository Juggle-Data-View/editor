/**
 * 定义全局 AutoDV 命名空间.
 * 防止AutoDV类型与其他声明冲突，包含命名空间、业务组件公共类型
 */

import { TriggerType } from 'config/const';
import { INodeConfig } from 'components/recursion';
import * as Const from 'config/const';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  declare namespace AutoDV {
    type AppID = number | null; // 页面ID
    type SpaceID = number | null; // 空间ID
    type CanvasID = number | null; // 画布ID

    /**
     * 缩放方式：
     *  0 - 原始比例
     *  1 - 等比缩放&宽度铺满，画布宽度与浏览器可视区宽度一致，可视区高度小于画布高度时可上下滚动
     *  2 - 等比缩放&⾼度铺满，画布高度与浏览器可视区高度一致，可视区宽度小于画布宽度时可左右滚动
     *  3 - 全屏铺满，画布尺寸与可视区一致，会拉伸。
     *  4 - 宽度铺满&上下居中
     *  5 - 高度铺满&左右居中
     */
    type ZoomType = 0 | 1 | 2 | 3 | 4 | 5;

    /**
     * 页面配置全部数据
     */
    interface AppConfig {
      canvas: Canvas & {
        compInsts?: Comp[];
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
    }

    /** 数据源相关 */

    interface Field {
      /** 数据源映射字段名称 */
      compFieldName: string;
      /** 数据源映射字段值  */
      sourceFieldName: string;
    }

    interface DataParam {
      name: string;
      value: string;
    }

    /**
     * 交互配置
     */
    interface ConfigTriggerField {
      /** 触发者 字段名称，唯一值，不能重复 */
      name: string;
      varName: string;
      defaultValue: string;
    }

    interface ConfigTrigger {
      /** 事件类型，单个组件会出现多种事件 */
      type: TriggerType;
      /** 是否开启 响应 */
      enable: boolean;
      /** 触发型组件使用，在“交互”配置面板中匹配 */
      fields: ConfigTriggerField[];
    }

    /**
     * 交互变量触发者数据
     */
    interface Trigger {
      /** 触发者所在组件 */
      code: string;
      /** 触发者事件类型 */
      type: TriggerType;
      /** 交互变量映射的数据字段，使用此字段可以获取数据源第0项数据 */
      name: string;
      /** 交互变量的值 */
      value: string | number | null;
      /** 交互变量的接收者（其他组件） */
      recivers: string[];
    }

    interface Reciver {
      /** 接收者的名称，一般为参数名 */
      name: string;
      /** 交互变量中触发者的值，对应`Trigger["value"]` */
      value: any;
      /** 触发者的映射字段名称 */
      triggerName: string;
      /** 触发者的交互变量名称 */
      triggerValue: string;
    }

    interface Triggers {
      /**
       * varName: 交互变量的名称
       */
      [varName: string]: AutoDV.Trigger;
    }

    interface Recivers {
      /**
       * code: 接收者所在组件
       */
      [code: string]: AutoDV.Reciver[];
    }

    interface Config {
      triggers?: ConfigTrigger[];
      groupCode?: string;
      // 占位块
      placeholder?: {
        size: number;
        color: string;
      };
    }

    type DataSourceType = Const.DataSourceType;

    type DataSourceId = number | null | string;

    // 数据源组辅助结构
    interface JsonMap {
      //数据源组组件的唯一标示
      sourceCode: string | null;
      //转换使用的辅助结构
      auxFieldMap: Field[];
    }

    interface DataConfig {
      dataSourceType: DataSourceType;
      /** 数据源ID，不能为-1 */
      dataSourceId: DataSourceId;
      /** 代码⽚片段ID， 不能为-1 */
      scriptId: number | null;
      /** 推送频率，单位：秒 */
      frequency: number;
      /** 数据参数kv列列表 json格式 [{"name":"a","value":12}] */
      dataParams: DataParam[];
      /**
       * mock数据，⽤于编排⻚页⾯面渲染 源⾃自组件数据或数据源数据，或⽤用户⾃自定义
       * 不超过1000个字符 是否跟随组件模板变化? 否
       */
      mockData: any[];
      /** 组件字段和数据字段名称映射 */
      fieldMap: Field[];
      /** 数据是否⾃动更新 */
      autoRefresh: boolean;
      /** 代码片段内容 */
      specScript: string;
      /** 数据源组结构*/
      jsonMap?: JsonMap;
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

    interface SubCompTemp<T = string, C = any> {
      dataConfig?: Partial<AutoDV.DataConfig>;
      config: C;
      alias: string;
      compCode: T;
    }

    /**
     * 组件实例类型
     * 注意：类型如果有变更，需与后端协商定义。否则，发起组件修改的请求时报错。
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
      dataConfig?: DataConfig;
      /** 组件是否锁定，true时,无法选中,拖拽  */
      locked: boolean;
      /** 组件是否隐藏 */
      hided: boolean;
      /** 组件缩略图 */
      compThumb?: string;
      /** 子组件配置 */
      subComponents?: SubComp[];
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

    interface SubComp<T = string, C = any> extends SubCompTemp<T, C> {
      code: string;
      hided: boolean;
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
      /** 交互接受者对象 */
      reciver?: Reciver[];
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

    /**
     * 业务组件模板 类型
     * 用于约定业务组件`temps`目录下文件中的配置项类型
     */
    type CompTemp<C = any> = Pick<Comp<C>, 'title' | 'config'> & {
      attr: Partial<Attr>;
      dataConfig?: Partial<DataConfig>;
      subComponents?: SubCompTemp[];
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
  }
}
