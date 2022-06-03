<script setup lang="ts">
import { onMounted, Ref, ref, shallowRef, useAttrs, watch } from 'vue';
import { PropFormItem, TypeItemConfig } from './types';
import { chilldConfig } from './chilldConfig';
import { isFunction } from '@/utils/ifType';
import deepClone from '@/utils/lodash/clone';

// Types.

interface OnlyKey {
  idKey: symbol;
}
type TypeSubsOtherPush = OnlyKey & PropsNotices;
type TypeSubsPush = (opt: TypeSubsOtherPush) => void;

interface PropsRenderItem extends PropFormItem {
  /** 指定表单项的唯一标识 */
  idKey?: symbol;
  /** 实际控制节点渲染的变量 */
  __isRender?: boolean;
}
type TypeRenderItemConfig = Array<PropsRenderItem>;

interface PropsNotices {
  k: Extract<keyof PropsRenderItem, 'attrs' | 'childAttrs' | '__isRender'>;
  // todo
  // × never
  // cb: Extract<keyof PropsRenderItem, PropsRenderItem['isRender'] | PropsRenderItem['getChildAttrs']>;
  // × 这个推导出来的虽然能用，但是好像也不对，没有应该要有的返回值类型
  cb: PropsRenderItem['getChildAttrs' | 'getChildAttrs'];
}
interface PropsWatchEvents {
  key: symbol;
  /*
    不要一个个属性的去定义、去计算
    通过匹配键名去动态的，基于 itemsConfig 中某个属性再进行更新
    {
      key: "xx",
      notices: [
        { k: __isRender, cb: reRender },
        { k: childAttrs, cb: reChildAttrs }
        ...
      ]
    }
  */
  notices?: PropsNotices[];
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

  // 避免传入 el-form 自身属性导致的 ts 报错
  [propName: string]: any;
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
  __renderFormItems.value = props.itemsConfig.map((el) => computeFormItem(el));
  // 配置初始化，通知默认值
  notifyModelEvents();
});

const refYeoForm = ref('');
// 处理渲染 el-form-item
const __renderFormItems: Ref<TypeRenderItemConfig> = shallowRef([]);
// shallowRef：创建一个跟踪自身 .value 变化的 ref，但不会使其值也变成响应式的。
// Vue received a Component which was made a reactive object.
// This can lead to unnecessary performance overhead,
// and should be avoided by marking the component with `markRaw` or using `shallowRef` instead of `ref`.
// const __renderFormItems: Ref<TypeRenderItemConfig> = ref([]);

/** 合并 原有的/手动添加的 childAttrs */
const doMergeChildAttrs = <TOrigin, TGetAttrs extends Function | undefined>(
  originAttrs: TOrigin,
  targetAttrs: TGetAttrs
) => {
  return () => ({
    ...originAttrs,
    ...targetAttrs?.(props.model),
  });
};
/** 计算绑定给组件的配置项 */
const computeFormItem = (formItem: PropsRenderItem) => {
  const item = deepClone(formItem);

  // Set idKey.
  item.idKey = Symbol();

  // 默认渲染输入框
  const tag = item.tag || 'input';
  /** @ts-ignore */
  const basicItem = chilldConfig[tag];

  if (!basicItem) throw new Error(`配置了不存在的组件类型 tag: ${tag}`);
  item.tag = basicItem.component;

  // 控制组件动态渲染
  item.__isRender = true;
  if (isFunction(item.isRender)) {
    pushSubsModel({
      idKey: item.idKey,
      k: '__isRender',
      cb: item.isRender,

      // todo better name...
      // noticeKey: '__isRender',
      // noticeCallback: item.isRender,
    });
  }

  // 合并子表单项的 attrs
  item.childAttrs = Object.assign(
    {},
    // 写入动态组件里面定义的 默认属性
    basicItem.baseAttrs,
    item.childAttrs
  );
  /** 保留原本的 childAttrs 引用，避免被 getChildAttrs 所影响 */
  const originalChildAttrs = item.childAttrs;

  // 控制组件动态更新属性绑定
  if (isFunction(item.getChildAttrs)) {
    pushSubsModel({
      idKey: item.idKey,
      k: 'childAttrs',
      cb: doMergeChildAttrs(originalChildAttrs, item.getChildAttrs),
    });
  }

  console.log('🏄 # computeFormItem # item', item);

  return item;
};

/**
 * 接收动态更新项的 订阅中心，
 * 比如动态控制 节点渲染、组件属性 Attributes 等
 */
const subsModelCenter: Ref<PropsWatchEvents[]> = ref([]);
/** 加入需要订阅的相关内容 */
const pushSubsModel: TypeSubsPush = ({ idKey, k, cb }) => {
  const subsIdx = subsModelCenter.value.findIndex((subs) => subs.key === idKey);
  // 避免重复添加相同的 key
  if (subsIdx === -1) {
    subsModelCenter.value.push({
      key: idKey,
      notices: [
        {
          k,
          cb,
        },
      ],
    });
  } else {
    subsModelCenter.value[subsIdx].notices?.push({
      k,
      cb,
    });
  }
};
/**
 * 下发动态更新的通知
 * 我们需要 “两次” 执行通知的时机：
 * - 第一次，初始化时，计算完组件的配置项后，通知更新（应用默认值）
 * - 第二次，或者说之后的更新，就依赖于 model 的变化，再去下发通知
 *
 * @todo
 * 这里是不是可以用 异步的合并计算？
 * 从而减少执行的次数，因为 model 的变化速率应该是相当快的
 * 有点难度了...
 */
const notifyModelEvents = () => {
  console.log(
    '🏄 # notifyModelEvents # subsModelCenter.value',
    subsModelCenter.value
  );
  if (!subsModelCenter.value.length) return;

  subsModelCenter.value.forEach((watchEL) => {
    const curModel = props.model;
    const curItemsIdx = __renderFormItems.value.findIndex(
      (items) => items.idKey === watchEL.key
    );

    // 这样不会触发 shallowRef 变化
    // if (curItemsIdx !== -1) __renderFormItems.value[curItemsIdx].__isRender = xxx;

    // 但是更改 .value 可以
    __renderFormItems.value = __renderFormItems.value.map((fItems, idx) => {
      if (idx === curItemsIdx && watchEL.notices?.length) {
        watchEL.notices.forEach((notiEl) => {
          fItems[notiEl.k] = notiEl.cb?.(curModel);
        });
        console.log('');
        console.log(
          '🏄 # __renderFormItems.value=__renderFormItems.value.map # fItems',
          fItems
        );
      }
      return fItems;
    });
  });
};

watch(
  props.model,
  () => {
    // 监听 model 变化，下发通知
    notifyModelEvents();
  },
  { deep: true, immediate: true }
);

defineExpose({
  refYeoForm,
});
</script>

<template>
  <ElForm
    ref="refYeoForm"
    v-bind="$attrs"
    :model="model"
    :rules="rules"
    size="default"
  >
    <!-- todo 看看有没有办法能 继承到 el-form 里面定义的属性字段提示 -->
    <!-- :label-width="" -->

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
