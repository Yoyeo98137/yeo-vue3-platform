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

const curcheckedNodes = computed(() => panel.checkedNodes);
const checkStrictly = computed(() => panel.config.checkStrictly);
const isLeaf = computed(() => props.node.isLeaf);
const isChecked = computed(() => props.node.checked);
const inExpandingPath = computed(() => isInPath(panel.expandingNode));
/** 是否还没有越过当前选中的节点层级 */
const unCrossedTheCheckedYet = computed(() => {
  if (!curcheckedNodes.value.length || !checkStrictly.value)
    return inExpandingPath.value;
  else {
    const checkedLevel = curcheckedNodes.value[0].level;
    const curLevel = props.node.level;

    return inExpandingPath.value && curLevel <= checkedLevel;
  }
});

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
  // `checkStrictly` 模式下，展开节点的同时也需要更改当前节点的 `checked` 状态
  // 同时也要避免重复更新状态
  if (checkStrictly.value && !isChecked.value) {
    doCheck(true);
  }

  if (inExpandingPath.value) return;
  panel.expandNode(props.node);
};
const doLoadExpand = () => {
  panel.lazyLoad(props.node, () => {
    if (!isLeaf.value) doExpand();
  });
};

const handleCheck = (checked: boolean) => {
  if (!props.node.loaded) {
    doLoadExpand();
  } else {
    doCheck(checked);
  }
};
const handleExpand = () => {
  const { loading, loaded } = props.node;
  if (loading) return;
  loaded ? doExpand() : doLoadExpand();
};

const handleClick = () => {
  const { node } = props;
  console.log('🏄 # Node # handleClick # node', node);

  if (isLeaf.value && !checkStrictly.value) {
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
      unCrossedTheCheckedYet ? 'in-active-path' : '',
      isChecked ? 'is-active' : '',
    ]"
    @click="handleClick"
  >
    <span class="y-node-label">{{ node.label }}</span>
    <div v-show="node.loading" class="y-node-loading"></div>
  </div>
</template>

<style lang="scss">
.y-node-content {
  position: relative;
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
  &:hover {
    background: #f5f7fa;
  }

  .y-node-label {
    flex: 1;
    text-align: left;
    padding: 0 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .y-node-loading {
    position: absolute;
    right: -16px;
    width: 12px;
    height: 12px;
    border: 1px solid rgba(122, 122, 122, 0.8);
    border-bottom-color: transparent;
    border-radius: 50%;
    display: inline-block;
    position: relative;
    animation: rotation 0.72s linear infinite;
  }
  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
}
</style>
