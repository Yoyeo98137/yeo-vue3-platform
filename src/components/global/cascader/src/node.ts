import { isUndefined } from '@/utils/ifType';
import { isEmpty } from './utils';

import type { CascaderConfig } from './types';
import type { Nullable } from './utils';

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
  readonly pathValues: CascaderNodePathValue;
  readonly pathLabels: string[];

  childrenData: CascaderOption[];
  children: Node[];

  checked = false;
  loading = false;
  loaded: boolean;

  constructor(
    readonly data: Nullable<CascaderOption>,
    readonly config: CascaderConfig,
    readonly parent?: Node,
    readonly root = false
  ) {
    const childrenData = data?.children!;
    const pathNodes = calculatePathNodes(this);

    this.level = root ? 0 : parent ? parent.level + 1 : 1;
    this.label = data?.label!;
    this.value = data?.value!;

    // 原数据结构
    this.childrenData = childrenData;
    this.children = (childrenData || []).map(
      (child) => new Node(child, config, this)
    );

    this.pathNodes = pathNodes;
    this.pathValues = pathNodes.map((node) => node.value);
    this.pathLabels = pathNodes.map((node) => node.label);

    // 如果开启了 lazy，则初始化的时候会先过一次 isLeaf，这时候 loaded 还没有定义所以会是 undefined
    // 于是就会走到 isLeaf 里面的 lazy && !loaded —— false 赋值，最终计算 childrenData 后赋值给 loaded
    this.loaded = !config.lazy || this.isLeaf || !isEmpty(childrenData);
  }

  get isLeaf(): boolean {
    const { data, config, childrenData, loaded } = this;
    const { lazy } = config;
    const isLeaf = data?.leaf;

    return isUndefined(isLeaf)
      ? lazy && !loaded
        ? false
        : !(Array.isArray(childrenData) && childrenData.length)
      : !!isLeaf;
  }

  get valueByOption() {
    return this.config.emitPath ? this.pathValues : this.value;
  }

  appendChild(childData: CascaderOption) {
    const { childrenData, children } = this;
    // 将自己作为父节点，根据自己的 childData 生成子节点
    const node = new Node(childData, this.config, this);

    // 同步更新 childrenData、children
    if (Array.isArray(childrenData)) {
      childrenData.push(childData);
    } else {
      this.childrenData = [childData];
    }
    children.push(node);

    return node;
  }

  setCheckState(checked: boolean, leafOnly = false) {
    if (leafOnly) this.checked = checked;
    else
      this.checked =
        this.loaded && this.children.every((child) => child.loaded) && checked;
  }

  doCheck(checked: boolean) {
    if (this.checked === checked) return;
    const { checkStrictly } = this.config;
    this.setCheckState(checked, checkStrictly);
  }
}

export default Node;
