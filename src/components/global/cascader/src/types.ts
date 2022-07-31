import { InjectionKey } from 'vue';
import type { default as CascaderNode } from './node';

export interface CascaderProps {
  lazy: boolean;
  lazyLoad: () => void;
}
export type CascaderConfig = Required<CascaderProps>;

export interface CascaderPanelContext {
  expandingNode: CascaderNode;
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
