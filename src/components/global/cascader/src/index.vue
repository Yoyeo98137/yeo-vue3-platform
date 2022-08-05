<!-- Cascader container -->

<script lang="ts" setup>
import { nextTick, onMounted, provide, reactive, Ref, ref, watch } from 'vue';
import YeoCascaderMenu from './menu.vue';

import Store from './store';
import Node from './node';
import { CASCADER_PANEL_INJECTION_KEY } from './types';
import { isEmpty, sortByOriginalChilds } from './utils';
import { useCascaderConfig } from './config';

import type {
  default as CascaderNode,
  CascaderValue,
  CascaderOption,
  CascaderNodeValue,
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
  (e: 'update:modelValue', value: Nullable<CascaderValue>): void;
  (e: 'change', values: CascaderNodePathValue): void;
  (e: 'close'): void;
}>();

const config = useCascaderConfig(props);

let store: Nullable<Store> = null;
const initialLoaded = ref(true);
const menus: Ref<CascaderNode[][]> = ref([]);

const expandingNode = ref<Nullable<CascaderNode>>();
const checkedNodes = ref<CascaderNode[]>([]);
const checkedValue = ref<Nullable<CascaderValue>>(null);

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

  const { options } = props;
  const cfg = config.value;

  store = new Store(options, cfg);
  // 实际上，外面的这一层 [] 就应该代表着 parent
  menus.value = [store.getNodes()];
  console.log('🏄 # initStore # store', store);
  console.log('🏄 # initStore # menus.value', menus.value);

  if (cfg.lazy && isEmpty(options)) {
    initialLoaded.value = false;
    lazyLoad(undefined, (list) => {
      if (list) {
        store = new Store(list, cfg);
        menus.value = [store.getNodes()];
      }
      initialLoaded.value = true;
    });
  }
};

const lazyLoad: CascaderPanelContext['lazyLoad'] = (node, cb) => {
  const cfg = config.value;
  node! = node || new Node({}, cfg, undefined, true);
  node.loading = true;

  // 闭包
  const resolve = (dataList: CascaderOption[]) => {
    const _node = node as Node;
    const parent = _node.root ? null : _node;

    dataList && store?.appendNodes(dataList, parent!);

    _node.loading = false;
    _node.loaded = true;
    _node.childrenData = _node.childrenData || [];
    cb && cb(dataList);
  };

  // 调用 props 定义的动态加载节点方法
  cfg.lazyLoad(node, resolve as any);
};

const expandNode: CascaderPanelContext['expandNode'] = (node) => {
  const { level } = node;
  const newMenus = menus.value.slice(0, level);
  let newExpandingNode: Nullable<CascaderNode>;

  // console.log('🏄 # level', level);
  // console.log('🏄 # level - 2', level - 2);
  // console.log('🏄 # newMenus', newMenus);

  if (node.isLeaf) {
    // 暂时没懂这个 level - 2 的含义，因为走到这里则说明后续没有再对 newExpandingNode 的逻辑处理
    // 我的理解是等同于跟设置 null（undefined）
    // newExpandingNode = node.pathNodes[level - 2];
    newExpandingNode = null;
  } else {
    newExpandingNode = node;
    newMenus.push(node.children);
  }

  if (expandingNode.value?.uid !== newExpandingNode?.uid) {
    console.log('🏄 # ---- 触发渲染了新的展开节点');

    // push next menu
    menus.value = newMenus;
    expandingNode.value = node;
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

  // 如果没有 nextTick，close 回调的值会是 calculateCheckedValue 更新之前的 checkedValue.value
  // 应该是事件回调时序导致的
  nextTick(() => {
    emitClose && emits('close');
  });
};

const getFlattedNodes = (leafOnly: boolean) => {
  return store?.getFlattedNodes(leafOnly);
};
const getCheckedNodes = (leafOnly: boolean) => {
  return getFlattedNodes(leafOnly)?.filter((node) => node.checked);
};
const calculateCheckedValue = () => {
  const isLeafOnly = false;
  const oldNodes = checkedNodes.value;
  const newNodes = getCheckedNodes(isLeafOnly)!;
  // 保证原本的节点排序，这将在多选模式下起到作用
  const nodes = sortByOriginalChilds(oldNodes, newNodes);
  console.log('🏄 # calculateCheckedValue # nodes', nodes);
  checkedNodes.value = nodes;

  const values = nodes.map((node) => node.valueByOption);
  checkedValue.value = values[0] ?? null;
};

// 自己的一个思考
const syncCheckedValueEasy = () => {
  console.log('🏄 # syncCheckedValueEasy # modelValue', props.modelValue);
  console.log('🏄 # syncCheckedValueEasy # menus', menus.value);

  const alls = store?.getFlattedNodes(false);
  console.log('🏄 # syncCheckedValueEasy # alls', alls);

  // 1 先找到当前要回显的节点实例
  const node = alls?.find((node) => node.value === props.modelValue);
  console.log('🏄 # syncCheckedValueEasy # node', node);

  // 2 拷贝出节点实例内的路径集
  const expandPaths = [...node?.pathNodes!];
  console.log('🏄 # syncCheckedValueEasy # expandPaths', expandPaths);

  // 3 计算出最深的查找路径层数
  let maxExpand = expandPaths?.length;
  console.log('🏄 # syncCheckedValueEasy # maxExpand', maxExpand);

  // 4 一直向下查找路径，同时推出集合头部节点（父节点），触发其交互事件（展开或者点击），直到这条路径结束
  while (maxExpand) {
    const curNode = expandPaths?.splice(0, 1)?.[0];
    const { isLeaf } = curNode;
    isLeaf ? handleCheckChange(curNode, true) : expandNode(curNode);
    maxExpand--;
  }
};
const syncCheckedValue = () => {
  const { modelValue } = props;
  const { checkStrictly } = config.value;
  const leafOnly = !checkStrictly;

  // 如果初始化的加载还没有结束
  if (!initialLoaded.value) return;

  // Find that sync node
  const values = [modelValue];
  const nodes = values.map((val) =>
    store?.getNodeByValue(val as CascaderNodeValue, leafOnly)
  ) as Node[];

  console.log('');
  console.log('🏄 # syncCheckedValue # nodes', nodes);
  syncMenuState(nodes);
  checkedValue.value = modelValue!;
};
const syncMenuState = (newCheckedNodes: CascaderNode[]) => {
  const { checkStrictly } = props.props;
  const oldNodes = checkedNodes.value;
  // 只查找叶子节点，正常的逻辑就是你如果需要做回显的话，肯定是具体到某个叶子节点
  // 而不是回显某个菜单
  // checkStrictly 就对应着我们业务侧边栏的场景，不要求精确到某一个叶子节点选项，允许选择 "菜单节点" 作为值
  // 这相当于对应分类筛选的场景，你可以具体到某一个单品类，你当然也可以仅筛选某个菜单分类
  const newNodes = newCheckedNodes.filter(
    (node) => !!node && (checkStrictly || node.isLeaf)
  );
  console.log('🏄 # newCheckedNodes', newCheckedNodes);
  console.log('🏄 # syncMenuState # oldNodes', oldNodes);
  console.log('🏄 # syncMenuState # newNodes', newNodes);

  const oldExpandingNode = store?.getSameNode(expandingNode.value!);
  const newExpandingNode = oldExpandingNode || newNodes[0];
  console.log('🏄 # oldExpandingNode', oldExpandingNode);
  console.log('🏄 # newExpandingNode', newExpandingNode);

  if (newExpandingNode) {
    // 将新节点路径集中所有父节点展开，从而还原路径链
    // 而这个新节点本身是叶子节点，在 expandNode 会跳过响应的执行
    newExpandingNode.pathNodes.forEach((node) => expandNode(node));
  } else {
    expandingNode.value = null;
  }

  // 复原 checked 状态，相当于补全 handleCheckChange 的逻辑
  oldNodes.forEach((node) => node.doCheck(false));
  newNodes.forEach((node) => node.doCheck(true));
  checkedNodes.value = newNodes;
};

provide(
  CASCADER_PANEL_INJECTION_KEY,
  reactive({
    expandingNode,
    initialLoaded,
    lazyLoad,
    expandNode,
    handleCheckChange,
  })
);

watch(() => props.options, initStore, {
  deep: true,
  immediate: true,
});

watch(checkedValue, (val) => {
  if (val !== props.modelValue) {
    emits('update:modelValue', val);
  }
});

onMounted(() => {
  // !isEmpty(props.modelValue) && syncCheckedValueEasy();
  !isEmpty(props.modelValue) && syncCheckedValue();
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
