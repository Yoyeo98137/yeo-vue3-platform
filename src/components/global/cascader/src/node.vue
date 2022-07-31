<!-- Node -->

<script lang="ts" setup>
import { computed, inject } from 'vue';
import { CASCADER_PANEL_INJECTION_KEY } from './types';
import type { default as CascaderNode } from './node';

interface Props {
  node: CascaderNode;
}
const props = defineProps<Props>();

// get Context
const panel = inject(CASCADER_PANEL_INJECTION_KEY)!;

const isLeaf = computed(() => props.node.isLeaf);
const isChecked = computed(() => props.node.checked);
const inExpandingPath = computed(() => isInPath(panel.expandingNode));

const isInPath = (node: CascaderNode) => {
  const { level, uid } = props.node;
  // 在记录的路径集查找，是否匹配的到当前的节点
  return node?.pathNodes[level - 1]?.uid === uid;
};

// 由子节点接受交互事件，而后通知父节点更新状态
// 将当前节点的 checked 设置为 true，而且要把之前选中过的节点 checked 设置为 false（只考虑单选）
const doCheck = (checked: boolean) => {
  const { node } = props;
  if (checked === node.checked) return;
  panel.handleCheckChange(node, checked);
};
const doExpand = () => {
  if (inExpandingPath.value) return;
  panel.expandNode(props.node);
};

const handleCheck = (checked: boolean) => {
  doCheck(checked);
};
const handleExpand = () => {
  // node.loaded ? doExpand() : doLoad();
  doExpand();
};

const handleClick = () => {
  const { node } = props;
  console.log('🏄 # handleClick # node', node);

  if (isLeaf.value) {
    handleCheck(true);
  } else {
    handleExpand();
  }
};
</script>

<template>
  <div
    class="y-node-content"
    :class="[
      inExpandingPath ? 'in-active-path' : '',
      isChecked ? 'is-active' : '',
    ]"
    @click="handleClick"
  >
    <span class="y-node-label">{{ node.label }}</span>
  </div>
</template>

<style lang="scss">
.y-node-content {
  padding: 0 30px 0 20px;
  display: flex;
  align-items: center;
  height: 34px;
  line-height: 34px;
  cursor: pointer;

  &.is-active {
    background: #f5f7fa;
  }
  &.is-active,
  &.in-active-path {
    color: #409eff;
    font-weight: 700;
  }

  .y-node-label {
    flex: 1;
    text-align: left;
    padding: 0 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
