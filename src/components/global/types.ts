import { TypeChildKey } from './chilldConfig';

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
  tag?: TypeChildKey;

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
  options?: Array<propOptions> | (() => Promise<any>);

  /** 动态控制 组件节点的渲染 */
  isRender?: (model: any) => boolean;

  /** 动态控制 组件属性 childAttrs 的绑定 */
  getChildAttrs?: (model: any) => any;
}

export type TypeItemConfig = Array<PropFormItem>;
