<!-- Scrollbar menu -->

<script lang="ts" setup>
import YeoCascaderNode from './node.vue';
import type { default as CascaderNode } from './node';

interface Props {
  nodes: CascaderNode[];
}
defineProps<Props>();
</script>

<template>
  <div class="y-menu y-menu--scrollbar">
    <div class="y-menu-wrap y-menu--scrollbar-wrap">
      <template v-for="node in nodes" :key="node.uid">
        <YeoCascaderNode :node="node" />
      </template>
    </div>
  </div>
</template>

<style lang="scss">
.y-menu--scrollbar {
  height: 100%;
  overflow: hidden;
}

.y-menu {
  min-width: 180px;
  color: #606266;
  border-right: 1px solid #e4e7ed;

  // &:last-child {
  //   border-right: none;
  // }
}

.y-menu--scrollbar-wrap {
  overflow: auto;
}
</style>
