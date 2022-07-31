<!-- Scrollbar menu -->

<script lang="ts" setup>
import { computed, inject } from 'vue';
import YeoCascaderNode from './node.vue';
import { CASCADER_PANEL_INJECTION_KEY } from './types';
import type { default as CascaderNode } from './node';

interface Props {
  nodes: CascaderNode[];
}
const props = defineProps<Props>();

const panel = inject(CASCADER_PANEL_INJECTION_KEY)!;

const isEmpty = computed(() => !props.nodes.length);
const isLoading = computed(() => !panel.initialLoaded);
</script>

<template>
  <div class="y-menu y-menu--scrollbar">
    <div class="y-menu-wrap y-menu--scrollbar-wrap">
      <template v-for="node in nodes" :key="node.uid">
        <YeoCascaderNode :node="node" />
      </template>

      <div v-if="isLoading" class="empty-text">加载中...</div>
      <div v-else-if="isEmpty">暂无数据</div>
    </div>
  </div>
</template>

<style lang="scss">
.y-menu--scrollbar {
  height: 100%;
  overflow: scroll;

  &::-webkit-scrollbar {
    display: none;
  }
}

.y-menu {
  min-width: 180px;
  border-right: 1px solid #e4e7ed;

  &:last-child {
    border-right: none;
  }
}

.y-menu--scrollbar-wrap {
  overflow: auto;
}

.y-menu-wrap {
  padding: 6px 0;
}

.empty-text {
  padding: 0 30px 0 20px;
  height: 34px;
  color: rgba(96, 98, 102, 0.67);
  text-align: center;
  line-height: 34px;
}
</style>
