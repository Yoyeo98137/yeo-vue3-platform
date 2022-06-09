import type { ElForm } from 'element-plus';
import { KeyChildConfig } from './chilldConfig';

/**
 * 因为这里 InstanceType 得到的属性都是必填属性，使用时就会产生多余的传入参数警告
 * 通过 Partial 将其属性都转为可选属性，这样即保留了 elm 的类型判断，也避免了多余的输入报警
 */
export type TypeElmForm = Partial<InstanceType<typeof ElForm>>;

interface propOptions {
  label: string;
  value: string | number;
}
interface PropItemAttrs {
  prop: string;
  label?: string;
  required?: boolean;
  [propName: string]: any;
}
export interface PropFormItem {
  // todo 插槽的时候或许不需要
  /** 指定要生成的表单控件，对应配置表的枚举 */
  tag?: KeyChildConfig;

  /** 通过 v-bind 继承给 el-form-item 的属性以及事件 */
  attrs?: PropItemAttrs;
  /** 通过 v-bind 继承给 具体表单控件（比如 el-input） 的属性以及事件 */
  childAttrs?: any;

  /** 具名插槽定义 */
  slotKey?: string;
  /** 控制 Layout 布局：Col - span */
  span?: number;

  /**
   * 列表数据项，应用于如 Checkbox、Radio、Select
   * PS：[] | () => data | async () => await getData()
   */
  options?: Array<propOptions> | (() => void) | (() => Promise<any>);

  /** 动态控制 组件节点的渲染 */
  isRender?: (model: any) => boolean;

  /** 动态控制 组件属性 childAttrs 的绑定 */
  getChildAttrs?: (model: any) => any;
}

export type TypeItemConfig = Array<PropFormItem>;

//

interface OnlyKey {
  idKey: symbol;
}
type TypeSubsOtherPush = OnlyKey & PropsNotices;
export type TypeSubsPush = (opt: TypeSubsOtherPush) => void;
export interface ItemAsyncSubs extends TypeSubsOtherPush {
  cb: () => Promise<any>;
  prop: string;
}

export interface PropsRenderItem extends PropFormItem {
  /** 指定表单项的唯一标识 */
  idKey?: symbol;
  /** 实际控制节点渲染的变量 */
  __isRender?: boolean;
}
export type TypeRenderItemConfig = Array<PropsRenderItem>;

interface PropsNotices {
  k: Extract<keyof PropsRenderItem, 'attrs' | 'childAttrs' | '__isRender'>;
  // todo
  // × never
  // cb: Extract<keyof PropsRenderItem, PropsRenderItem['isRender'] | PropsRenderItem['getChildAttrs']>;
  // × 这个推导出来的虽然能用，但是好像也不对，没有应该要有的返回值类型
  cb: PropsRenderItem['isRender' | 'getChildAttrs'];
  echoVal?: any;
}
export interface PropsWatchEvents {
  key: symbol;
  /*
    不要一个个属性的去定义、去计算
    通过匹配键名去动态的，基于 itemsConfig 中某个属性再进行更新
    {
      key: "xx",
      notices: [
        { k: __isRender, cb: reRender },
        { k: childAttrs, cb: reChildAttrs }
        ...
      ]
    }
  */
  notices?: PropsNotices[];
}
