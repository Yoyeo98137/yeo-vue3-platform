import { InjectionKey } from 'vue';
import type { CascaderOption, default as CascaderNode } from './node';

export type Resolve = (dataList?: CascaderOption[]) => void;
export type LazyLoad = (node: CascaderNode, resolve: Resolve) => void;
export interface CascaderProps {
  lazy?: boolean;
  lazyLoad?: LazyLoad;
  /** 是否严格的遵守父子节点不互相关联，通俗来说就是选中的路径，是否一定要以叶子节点来结尾 */
  checkStrictly?: boolean
}
export type CascaderConfig = Required<CascaderProps>;

export interface CascaderPanelContext {
  expandingNode: CascaderNode;
  initialLoaded: boolean;
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
