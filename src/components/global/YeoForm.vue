<script setup lang="ts">
import { onMounted, Ref, ref, shallowRef, useAttrs, watch } from 'vue';
import { PropFormItem, TypeItemConfig } from './types';
import { chilldConfig } from './chilldConfig';
import { isFunction } from '@/utils/ifType';
import deepClone from '@/utils/lodash/clone';

interface PropsWatchEvents {
  key: string;
  reRender: (model: any) => boolean;
}
interface Props {
  itemsConfig: TypeItemConfig;
  model: any;
  rules?: any;

  /** 控制 Layout Row - gutter */
  gutter?: number;

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

  gutter: 20,

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
// shallowRef：创建一个跟踪自身 .value 变化的 ref，但不会使其值也变成响应式的。
// Vue received a Component which was made a reactive object.
// This can lead to unnecessary performance overhead,
// and should be avoided by marking the component with `markRaw` or using `shallowRef` instead of `ref`.
// const __renderFormItems: Ref<TypeItemConfig> = ref([]);

/** 计算绑定给组件的配置项 */
const computeFormItem = (formItem: PropFormItem) => {
  const item = deepClone(formItem);

  // 默认渲染输入框
  const tag = item.tag || 'input';
  /** @ts-ignore */
  const basicItem = chilldConfig[tag];

  if (!basicItem) throw new Error(`配置了不存在的组件类型 tag: ${tag}`);
  item.tag = basicItem.component;

  // 控制组件动态渲染
  item.__isRender = true;
  if (item.isRender && isFunction(item.isRender)) {
    watchModelEvents.value.push({
      // todo 应该要换个唯一key
      key: item.attrs?.prop || '',
      reRender: item.isRender,
    });
    item.__isRender = item.isRender(props.model);
  }

  // 合并子表单项的 attrs
  item.childAttrs = Object.assign(
    {},
    // 写入动态组件里面定义的 默认属性
    basicItem.baseAttrs,
    item.childAttrs
  );

  return item;
};

/**
 * 用来存储 需要配合响应式变化的 "事件集"
 * 应该是控制任何动态的事情，动态渲染、动态更新 Attributes 等
 */
const watchModelEvents: Ref<PropsWatchEvents[]> = ref([]);
const toggleModelEvents = () => {
  watchModelEvents.value.forEach((watchEL) => {
    const curModel = props.model;
    const curItemsIdx = __renderFormItems.value.findIndex(
      (items) => items.attrs?.prop === watchEL.key
    );

    // 这样不会触发 shallowRef 变化
    // if (curItemsIdx !== -1) {
    //   __renderFormItems.value[curItemsIdx].__isRender =
    //     watchEL.reRender(curModel);
    // }

    // 但是更新 .value 可以
    __renderFormItems.value = __renderFormItems.value.map((fItems, idx) => {
      if (idx === curItemsIdx) {
        fItems.__isRender = watchEL.reRender(curModel);
      }
      return fItems;
    });

    console.log('🏄 # watchModelEvents.value.forEach # curModel', curModel);
    console.log(
      '🏄 # watchModelEvents.value.forEach # curItemsIdx',
      curItemsIdx
    );
    console.log(
      '🏄 # watchModelEvents.value.forEach # __renderFormItems.value',
      __renderFormItems.value
    );
  });
};

watch(
  props.model,
  () => {
    if (watchModelEvents.value.length) {
      toggleModelEvents();
    }
  },
  { deep: true, immediate: true }
);

defineExpose({
  refYeoForm,
});
</script>

<template>
  <ElForm ref="refYeoForm" v-bind="$attrs" :model="model" :rules="rules">
    <ElRow :gutter="gutter">
      <template v-for="(fItems, fIdx) in __renderFormItems" :key="fIdx">
        <!-- todo slots -->

        <ElCol v-show="fItems.__isRender" :span="fItems.span || 24">
          <ElFormItem v-bind="fItems.attrs || {}">
            <template v-if="fItems.attrs">
              <component
                :is="fItems.tag"
                v-model="model[fItems.attrs.prop]"
                v-bind="fItems.childAttrs || {}"
              />
            </template>
          </ElFormItem>
        </ElCol>
      </template>
    </ElRow>
  </ElForm>
</template>

<style scoped>
/*  */
</style>
