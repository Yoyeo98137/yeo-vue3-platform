<script setup lang="ts">
import type { ElCol } from 'element-plus';

type TypeElmCol = Partial<InstanceType<typeof ElCol>>;
interface Props extends TypeElmCol {
  original?: boolean;
}
withDefaults(defineProps<Props>(), {
  /** 开启原生元素控制，跳过 el-col 的样式定义 */
  original: false,
});
</script>

<template>
  <div v-if="original">
    <slot></slot>
  </div>
  <ElCol v-else v-bind="$attrs">
    <slot></slot>
  </ElCol>
</template>
