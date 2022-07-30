<!-- Cascader container -->

<script lang="ts" setup>
import { Ref, ref, watch } from 'vue';
import YeoCascaderMenu from './menu.vue';

import Node from './node';

import type { CascaderProps } from './types';
import type {
  default as CascaderNode,
  CascaderValue,
  CascaderOption,
} from './node';

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
  (e: 'change'): void;
  (e: 'submit'): void;
}>();

const menus: Ref<CascaderNode[][]> = ref([]);

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
  menus.value = [props.options.map((node) => new Node(node))];
  console.log('🏄 # initStore # menus.value', menus.value);
};

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
  box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12);
  background: #ffffff;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
}
</style>
