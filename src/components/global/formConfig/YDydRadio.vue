<script lang="ts" setup>
import { useSlots } from 'vue';
import { notEmptyObject } from '@/utils/ifType';

const slots: any = useSlots();
console.log('🏄 # slots', slots);
</script>

<template>
  <ElRadioGroup v-bind="$attrs">
    <!-- todo -->
    <!-- {{ $slots }} -->

    <template v-for="(fRadio, fIndex) in $attrs.options" :key="fIndex">
      <ElRadio :label="fRadio.value">
        <!-- 当定义了自定义插槽名，且传入了插槽节点时 -->
        <template v-if="fRadio.slotName && notEmptyObject(slots)">
          <slot :name="fRadio.slotName"></slot>
        </template>
        <template v-else>{{ fRadio.label }}</template>
      </ElRadio>
    </template>
  </ElRadioGroup>
</template>

<style scoped>
/*  */
</style>
