<!-- Node -->

<script lang="ts" setup>
import type { default as CascaderNode } from './node';

interface Props {
  node: CascaderNode;
}
defineProps<Props>();
</script>

<template>
  <div class="y-node-content">
    <span>{{ node.label }}</span>
  </div>
</template>

<style lang="scss">
//
</style>
