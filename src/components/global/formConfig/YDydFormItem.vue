<script setup lang="ts">
import type { ElFormItem } from 'element-plus';

type TypeElmFormItem = Partial<InstanceType<typeof ElFormItem>>;
interface Props extends TypeElmFormItem {
  original?: boolean;
}
withDefaults(defineProps<Props>(), {
  original: false,
});
</script>

<template>
  <!-- div -->
  <template v-if="original">
    <slot></slot>
  </template>
  <ElFormItem v-else v-bind="$attrs">
    <slot></slot>
  </ElFormItem>
</template>
