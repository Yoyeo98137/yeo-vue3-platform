<script lang="ts" setup>
import { useAttrs, computed } from 'vue';
import { isNull } from '@/utils/ifType';

const attrs: any = useAttrs();
const { model, bindKey } = attrs.config;

const computedBindVal = computed({
  get: () => model[model[bindKey]],
  set: (val) => {
    model[model[bindKey]] = isNull(val) ? [] : val;
  },
});
</script>

<template>
  <div class="res-pool-timer">
    <ElSelect v-bind="$attrs" class="res-pool-timer-select">
      <template v-for="(fSelect, fIndex) in attrs.options" :key="fIndex">
        <ElOption :label="fSelect.label" :value="fSelect.value"></ElOption>
      </template>
    </ElSelect>
    <ElDatePicker
      v-model="computedBindVal"
      type="daterange"
      rangeSeparator="~"
      startPlaceholder="开始日期"
      endPlaceholder="结束日期"
      valueFormat="x"
      :defaultTime="[
        new Date(2000, 1, 1, 0, 0, 0),
        new Date(2000, 2, 1, 23, 59, 59),
      ]"
      class="res-pool-timer-picker"
    ></ElDatePicker>
  </div>
</template>

<style lang="scss">
.res-pool-timer {
  display: flex;

  // 兼容边框
  .res-pool-timer-select {
    position: relative;
    flex: none;
    width: 102px;
    cursor: pointer;

    .el-input__inner {
      border: none !important;
      color: #606266;

      &:hover,
      &:focus {
        outline: none !important;
      }
    }
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 5;
      border: 1px solid #dcdfe6;
      border-right: none;
      border-radius: 4px 0 0 4px;
    }
  }
  .res-pool-timer-picker {
    &.el-range-editor--medium.el-input__inner {
      border-radius: 0 4px 4px 0 !important;
    }
  }
}
</style>
