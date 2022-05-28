<script setup lang="ts">
import { ref, useAttrs } from 'vue';
import { TypeItemConfig } from './types';
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

const refYeoForm = ref('');

/** todo 计算绑定给组件的配置项 */
// const computeFormItem = <T>(formItem: T) => {
//   const item = deepClone(formItem)

//   // 默认渲染输入框
//   const tag = item.tag || "input"
//   const basicItem = chilldConfig[tag]

//   if (!basicItem) throw new Error(`配置了不存在的组件类型 tag: ${tag}`)
//   item.tag = basicItem.component

//   item.attrs = Object.assign(
//     {},
//     // 写入动态组件里面定义的 默认属性
//     basicItem.baseAttrs,
//     item.attrs,
//   )

//   return item
// }

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
    <!-- todo v-for -->
    <template v-for="(fItems, fIdx) in itemsConfig">
      <!-- todo slots -->

      <!-- todo isRender -->
      <ElFormItem :key="fIdx" v-bind="fItems.attrs || {}">
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
