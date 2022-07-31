import { InjectionKey } from 'vue';
import type { CascaderOption, default as CascaderNode } from './node';

export type Resolve = (dataList?: CascaderOption[]) => void;
export type LazyLoad = (node: CascaderNode, resolve: Resolve) => void;
export interface CascaderProps {
  lazy: boolean;
  lazyLoad: LazyLoad;
}
export type CascaderConfig = Required<CascaderProps>;

export interface CascaderPanelContext {
  expandingNode: CascaderNode;
  lazyLoad: (
    node?: CascaderNode,
    cb?: (dataList: CascaderOption[]) => void
  ) => void;
  expandNode: (node: CascaderNode) => void;
  handleCheckChange: (
    node: CascaderNode,
    checked: boolean,
    // 触发选中 "submit" 通知路径确认（关闭弹窗）
    emitClose?: boolean
  ) => void;
}

export const CASCADER_PANEL_INJECTION_KEY: InjectionKey<CascaderPanelContext> =
  Symbol();
