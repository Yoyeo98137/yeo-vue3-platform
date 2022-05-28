interface propOptions {
  label: string;
  value: string | number;
}
interface PropItemAttrs {
  prop: string;
  label?: string;
  required?: boolean;
}
interface PropFormItem {
  // todo 插槽的时候或许不需要
  /** 指定要生成的表单控件，对应配置表的枚举 */
  tag?: string;

  /** 通过 v-bind 继承给 el-form-item 的属性以及事件 */
  attrs?: PropItemAttrs;
  /** 通过 v-bind 继承给 具体表单控件（比如 el-input） 的属性以及事件 */
  childAttrs?: object;

  // getAttrs?: (model: any) => any;
  /** 条件渲染控制 */
  isRender?: () => boolean;

  /**
   * 列表数据项，应用于如 Checkbox、Radio、Select  
   * PS：[] | () => data | async () => await getData()
   */
  options?: Array<propOptions> | (() => Promise<any>);
  /** 具名插槽定义 */
  slotKey?: string;
  /** 布局控制 */
  col?: number;
}

export type TypeItemConfig = Array<PropFormItem>;
