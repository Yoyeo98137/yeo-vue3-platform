import Node from './node';
import { flatNodes } from './utils';

import type { CascaderConfig } from './types';
import type { CascaderOption } from './node';

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
}

export default Store;
