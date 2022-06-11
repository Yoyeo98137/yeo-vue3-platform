<script lang="ts" setup>
interface Props {
  beforeText?: string;
  afterText?: string;
  placeholder?: string;
  size?: string;
}
withDefaults(defineProps<Props>(), {
  beforeText: '',
  afterText: '',
  placeholder: '请输入',
  size: '',
});
const emits = defineEmits<{
  (e: 'handleFocus'): void;
}>();

const noticeFocus = () => {
  emits('handleFocus');
};
</script>

<template>
  <div class="config-radio-input-flex">
    <span v-if="beforeText !== ''">{{ beforeText }}</span>
    <!-- v-bind="$attrs" v-model -->
    <ElInput
      v-bind="$attrs"
      class="config-input-number"
      type="number"
      :placeholder="placeholder"
      :size="(size as any)"
      @focus="noticeFocus"
    />
    <span v-if="afterText !== ''">{{ afterText }}</span>
  </div>
</template>

<style lang="scss">
.config-radio-input-flex {
  display: flex;

  span:first-of-type {
    margin-right: 6px;
  }
  span:last-of-type {
    margin-left: 6px;
  }
  .config-input-number {
    width: 106px;

    /** 隐藏 数字类型输入框 的上下箭头 */
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
    }
    input[type='number'] {
      -moz-appearance: textfield;
    }
  }
}
</style>
