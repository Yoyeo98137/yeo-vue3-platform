<!-- Cascader container -->

<script lang="ts" setup>
import { provide, reactive, Ref, ref, watch } from 'vue';
import YeoCascaderMenu from './menu.vue';

import Node from './node';
import { CASCADER_PANEL_INJECTION_KEY } from './types';
import { flatNodes, sortByOriginalChilds } from './utils';

import type {
  default as CascaderNode,
  CascaderValue,
  CascaderOption,
  CascaderNodePathValue,
} from './node';
import type { CascaderPanelContext, CascaderProps } from './types';
import type { Nullable } from './utils';

interface Props {
  modelValue: CascaderValue;
  options?: CascaderOption[];
  props?: CascaderProps;
}
const props = withDefaults(defineProps<Props>(), {
  options: () => [],
  props: () => ({} as CascaderProps),
});

const emits = defineEmits<{
  // todo update modelValue
  (e: 'change', values: CascaderNodePathValue): void;
  (e: 'close'): void;
}>();

let store: Nullable<CascaderNode[]> = null;
const menus: Ref<CascaderNode[][]> = ref([]);
const allNodes: Ref<CascaderNode[]> = ref([]);
const leafNodes: Ref<CascaderNode[]> = ref([]);

const expandingNode = ref<Nullable<CascaderNode>>();
const checkedNodes = ref<CascaderNode[]>([]);

const initStore = () => {
  /*
    not options, is [...options] !!!

    {
      [
        label
        value
        children
      ],
      ...
    }

    [cur].value ---- [[cur].children].value ---- [[cur.children].children].value
    [cur].value ---- [[cur].children].value ---- [[cur.children].children].value
    [cur].value ---- [[cur].children].value ---- [[cur.children].children].value

    ! menus 的个数不是直接基于 options 来渲染，是基于层数来渲染，有多深层次的 children，就有多少个 menus
  */
  // menus.value = props.options;

  store = (props.options || []).map((node) => new Node(node));

  allNodes.value = flatNodes(store, false);
  leafNodes.value = flatNodes(store, true);

  // 实际上，外面的这一层 [] 就应该代表着 parent
  menus.value = [store];
  console.log('🏄 # initStore # menus.value', menus.value);
};

const expandNode: CascaderPanelContext['expandNode'] = (node) => {
  const { level } = node;
  const newMenus = menus.value.slice(0, level);
  let newExpandingNode: Nullable<CascaderNode>;

  console.log('🏄 # level', level);
  console.log('🏄 # level - 2', level - 2);
  console.log('🏄 # newMenus', newMenus);

  if (node.isLeaf) {
    // 暂时没动这个 level - 2 的含义，因为走到这里则说明后续没有再对 newExpandingNode 的逻辑处理
    // 我的看法是等同于跟设置 null（undefined）
    // newExpandingNode = node.pathNodes[level - 2];
    newExpandingNode = null;
  } else {
    newExpandingNode = node;
    newMenus.push(node.children);
  }

  console.log('🏄 # newExpandingNode', newExpandingNode);
  console.log('');

  if (expandingNode.value?.uid !== newExpandingNode?.uid) {
    console.log('🏄 # ---- 触发渲染了新的展开节点');
    expandingNode.value = node;
    // push next menu
    menus.value = newMenus;
    emits('change', node?.pathValues || []);
  }
};
const handleCheckChange: CascaderPanelContext['handleCheckChange'] = (
  node,
  checked,
  emitClose = true
) => {
  const oldNode = checkedNodes.value[0];
  console.log('🏄 # handleCheckChange # oldNode', oldNode);

  oldNode?.doCheck(false);
  node.doCheck(checked);
  calculateCheckedValue();

  emitClose && emits('close');
};

const getFlattedNodes = (leafOnly: boolean) => {
  return leafOnly ? leafNodes.value : allNodes.value;
};
const getCheckedNodes = (leafOnly: boolean) => {
  return getFlattedNodes(leafOnly)?.filter((node) => node.checked);
};
const calculateCheckedValue = () => {
  const isLeafOnly = false;
  const oldNodes = checkedNodes.value;
  const newNodes = getCheckedNodes(isLeafOnly);
  // 保证原本的节点排序，这将在多选模式下起到作用
  const nodes = sortByOriginalChilds(oldNodes, newNodes);
  console.log('🏄 # calculateCheckedValue # nodes', nodes);
  checkedNodes.value = nodes;
};

provide(
  CASCADER_PANEL_INJECTION_KEY,
  reactive({
    expandingNode,
    // lazyLoad,
    expandNode,
    handleCheckChange,
  })
);

// todo
// config,
watch([() => props.options], initStore, {
  deep: true,
  immediate: true,
});
</script>

<template>
  <div class="y-cascader--container">
    <template v-for="(menu, index) in menus" :key="index">
      <YeoCascaderMenu :nodes="menu" />
    </template>
  </div>
</template>

<style lang="scss">
.y-cascader--container {
  display: flex;
  height: 206px;
  font-size: 14px;
  color: #606266;

  box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12);
  background: #ffffff;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
}
</style>
