import { isArray } from '@/utils/ifType';
import type { CascaderConfig } from './types';
import { Nullable } from './utils';

export type CascaderNodeValue = string | number;
export type CascaderNodePathValue = CascaderNodeValue[];
export type CascaderValue =
  | CascaderNodeValue
  | CascaderNodePathValue
  | (CascaderNodeValue | CascaderNodePathValue)[];

export interface CascaderOption extends Record<string, unknown> {
  label?: string;
  value?: CascaderNodeValue;
  children?: CascaderOption[];
  leaf?: boolean;
}

// 状态：checked（当前 Node 是否选中）、loading、loaded
// 属性：uid（每个 Node 的唯一标识，可用于读取路径、定义键值等）、parent（保留父节点）、leavel（可以判断容器个数）、leaf（叶子节点不再触发后续的交互）、children（读取下一层 Node 集合）
// 动作：点击 Click（触发 children 的数据获取）、展开 Expand（渲染下一级节点容器）

let uid = 0;

/** 计算当前的节点路径集 */
const calculatePathNodes = (node: Node) => {
  const nodes = [node];
  let { parent } = node;

  while (parent) {
    // “先进后出” —— 每次循环，将层级小的节点推入到集合头部
    nodes.unshift(parent);
    parent = parent.parent;
  }

  return nodes;
};

class Node {
  readonly uid: number = uid++;
  readonly level: number;
  readonly label: string;
  readonly value: CascaderNodeValue;
  readonly pathNodes: Node[];

  childrenData: CascaderOption[];
  children: Node[];

  checked = false;
  loading = false;
  loaded: boolean;

  constructor(
    readonly data: Nullable<CascaderOption>,
    readonly config?: CascaderConfig,
    readonly parent?: Node,
    readonly root = false
  ) {
    const childrenData = data?.children!;

    this.level = root ? 0 : parent ? parent.level + 1 : 1;
    this.label = data?.label!;
    this.value = data?.value!;

    // 原数据结构
    this.childrenData = childrenData;
    this.children = (childrenData || []).map(
      (child) => new Node(child, config, this)
    );

    this.pathNodes = calculatePathNodes(this);
    // this.loaded = !config.lazy || this.isLeaf || !isEmpty(childrenData);
    this.loaded = true;
  }

  get isLeaf(): boolean {
    const { data, childrenData } = this;
    const isLeaf =
      !(isArray(childrenData) && childrenData.length) || data?.leaf;

    return !!isLeaf;
  }

  appendChild(childData: CascaderOption) {
    // ...
  }

  doCheck(checked: boolean) {
    if (this.checked === checked) return;
    this.checked = checked;
  }
}

export default Node;
