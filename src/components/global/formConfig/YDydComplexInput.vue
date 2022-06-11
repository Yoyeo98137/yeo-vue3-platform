<script lang="ts" setup>
import { useAttrs, computed } from 'vue';

const attrs: any = useAttrs();
const { model, bindKey } = attrs.config;

const computedBindVal = computed({
  get: () => model[model[bindKey]],
  set: (val) => {
    model[model[bindKey]] = val;
  },
});
</script>

<template>
  <div>
    <ElInput v-model="computedBindVal" clearable>
      <template #prepend>
        <ElSelect v-bind="$attrs" style="width: 102px">
          <template v-for="(fSelect, fIndex) in attrs.options" :key="fIndex">
            <ElOption :label="fSelect.label" :value="fSelect.value"></ElOption>
          </template>
        </ElSelect>
      </template>
    </ElInput>
  </div>
</template>

<style lang="scss">
//
</style>
