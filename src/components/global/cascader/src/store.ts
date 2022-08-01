import Node from './node';
import { flatNodes } from './utils';

import type { CascaderConfig } from './types';
import type {
  CascaderOption,
  CascaderNodePathValue,
  CascaderNodeValue,
} from './node';
import type { Nullable } from './utils';

class Store {
  readonly nodes: Node[];
  readonly allNodes: Node[];
  readonly leafNodes: Node[];

  constructor(data: CascaderOption[], readonly config: CascaderConfig) {
    const nodes = (data || []).map(
      (nodeData) => new Node(nodeData, this.config)
    );
    this.nodes = nodes;
    this.allNodes = flatNodes(nodes, false);
    this.leafNodes = flatNodes(nodes, true);
  }

  getNodes() {
    return this.nodes;
  }

  getFlattedNodes(leafOnly: boolean) {
    return leafOnly ? this.leafNodes : this.allNodes;
  }

  appendNode(nodeData: CascaderOption, parentNode?: Node) {
    const node = parentNode
      ? parentNode.appendChild(nodeData)
      : new Node(nodeData, this.config);

    if (!parentNode) this.nodes.push(node);

    this.allNodes.push(node);
    node.isLeaf && this.leafNodes.push(node);
  }

  appendNodes(nodeDataList: CascaderOption[], parentNode: Node) {
    nodeDataList.forEach((nodeData) => this.appendNode(nodeData, parentNode));
  }

  /** 通过 `value` 查找节点 */
  getNodeByValue(
    value: CascaderNodeValue | CascaderNodePathValue,
    leafOnly = false
  ): Nullable<Node> {
    // 保证 value = 0 能向后运行
    if (!value && value !== 0) return null;

    const node = this.getFlattedNodes(leafOnly).find(
      (node) => node.value === value
    );
    // 多选模式下，modelValue 就是数组 —— `|| isEqual(node.pathValues, value)`

    return node || null;
  }

  getSameNode(node: Node): Nullable<Node> {
    if (!node) return null;

    const node_ = this.getFlattedNodes(false).find(
      // isEqual(node.value, value)
      ({ value, level }) => node.value === value && node.level === level
    );

    return node_ || null;
  }
}

export default Store;
