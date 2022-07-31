import type { default as CascaderNode } from './node';

export type Nullable<T> = T | null;

/** 扁平目标数组 */
export const flatNodes = (nodes: CascaderNode[], leafOnly: boolean) => {
  return nodes.reduce((res, node) => {
    if (node.isLeaf) {
      res.push(node);
    } else {
      !leafOnly && res.push(node);
      res = res.concat(flatNodes(node.children, leafOnly));
    }
    return res;
  }, [] as CascaderNode[]);
};

export const sortByOriginalChilds = (
  oldNodes: CascaderNode[],
  newNodes: CascaderNode[]
) => {
  // Beautiful JS: https://stackoverflow.com/questions/5024085/whats-the-point-of-slice0-here
  const newNodesCopy = newNodes.slice(0);
  const newIds = newNodesCopy.map((node) => node.uid);
  const res = oldNodes.reduce((acc, item) => {
    const index = newIds.indexOf(item.uid);
    if (index > -1) {
      acc.push(item);
      newNodesCopy.splice(index, 1);
      newIds.splice(index, 1);
    }
    return acc;
  }, [] as CascaderNode[]);

  res.push(...newNodesCopy);

  return res;
};