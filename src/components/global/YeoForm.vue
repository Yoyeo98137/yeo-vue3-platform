<script setup lang="ts">
import { onMounted, Ref, ref, shallowRef, useAttrs, watch } from 'vue';
import { PropFormItem, TypeItemConfig } from './types';
import { chilldConfig } from './chilldConfig';
import deepClone from '@/utils/lodash/clone';

interface Props {
  itemsConfig: TypeItemConfig;
  model: any;
  rules?: any;

  // submit?: boolean
  // submitContext?: string
  // reset?: boolean
  // resetContext?: string
}
const props = withDefaults(defineProps<Props>(), {
  // 可以理解为 Vue2 定义参数默认值的写法
  rules: () => {
    return {};
  },

  // submit: false,
  // submitContext: "查询",
  // reset: false,
  // resetContext: "重置",
});
// const emits = defineEmits<{
//   (e: "onSearch"): void
//   (e: "onReset"): void
// }>()

const attrs = useAttrs();
console.log('🏄 # attrs', attrs);

onMounted(() => {
  console.log('🏄 # onMounted # props', props);
  console.log('🏄 # onMounted # props', props.itemsConfig);

  __renderFormItems.value = props.itemsConfig.map((el) => computeFormItem(el));
  console.log(
    '🏄 # onMounted # __renderFormItems.value',
    __renderFormItems.value
  );
});

const refYeoForm = ref('');
// 处理渲染 el-form-item
const __renderFormItems: Ref<TypeItemConfig> = shallowRef([]);
// Vue received a Component which was made a reactive object.
// This can lead to unnecessary performance overhead,
// and should be avoided by marking the component with `markRaw` or using `shallowRef` instead of `ref`.
// const __renderFormItems: Ref<TypeItemConfig> = ref([]);

/** todo 计算绑定给组件的配置项 */
const computeFormItem = (formItem: PropFormItem) => {
  const item = deepClone(formItem);
  console.log('🏄 # computeFormItem # item', item);

  // 默认渲染输入框
  const tag = item.tag || 'input';
  /** @ts-ignore */
  const basicItem = chilldConfig[tag];

  if (!basicItem) throw new Error(`配置了不存在的组件类型 tag: ${tag}`);
  item.tag = basicItem.component;

  // 合并子表单项的 attrs
  item.childAttrs = Object.assign(
    {},
    // 写入动态组件里面定义的 默认属性
    basicItem.baseAttrs,
    item.childAttrs
  );

  console.log('🏄 # computeFormItem # item', item);

  return item;
};

// 没明白这里为什么跑出来的是 undefined...
// watch(
//   props.itemsConfig,
//   (val) => {
//     console.log('🏄 # val', val);
//     // val.forEach((el) => {
//     //   console.log('🏄 # val.forEach # el', el);
//     //   __renderFormItems.value.push(computeFormItem(el));
//     // });

//     // console.log('🏄 # __renderFormItems.value', __renderFormItems.value);
//   },
//   { deep: true, immediate: true }
// );

// todo
// 条件渲染：
// 初始化的时候扫描配置项，如果识别到条件渲染字段（isRender）
// 就开启一个 watch 去监听它，并绑定他对应的 函数、Props
// 监听函数值发生变化时，再去更改指定表单项的 isRender 来触发渲染
// 实现：建立一个数组，每当有一个 isRender 就插入到这个数组，然后用 watch 去监听这个数组

defineExpose({
  refYeoForm,
});
</script>

<template>
  <ElForm ref="refYeoForm" v-bind="$attrs" :model="model" :rules="rules">
    <template v-for="(fItems, fIdx) in __renderFormItems" :key="fIdx">
      <!-- todo slots -->

      <!-- todo isRender -->
      <ElFormItem v-bind="fItems.attrs || {}">
        <template v-if="fItems.attrs">
          <component
            :is="fItems.tag"
            v-model="model[fItems.attrs.prop]"
            v-bind="fItems.childAttrs || {}"
          />
        </template>
      </ElFormItem>
    </template>
  </ElForm>
</template>

<style scoped>
/*  */
</style>
