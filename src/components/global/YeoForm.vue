<script setup lang="ts">
import type { Ref } from 'vue';
import { computed, onMounted, ref, shallowRef, useAttrs, watch } from 'vue';
import YDydFormCol from './formConfig/YDydFormCol.vue';
import {
  TypeElmForm,
  PropsRenderItem,
  TypeItemConfig,
  ItemAsyncSubs,
  TypeSubsPush,
  TypeRenderItemConfig,
  PropsWatchEvents,
} from './formConfig/types';
import { chilldConfig, KeyChildConfig } from './formConfig/chilldConfig';
import {
  isArray,
  isFunction,
  isNull,
  isNumber,
  isString,
  isUndefined,
  notEmptyObject,
} from '@/utils/ifType';
import deepClone from '@/utils/lodash/clone';

// Types.

interface Props extends TypeElmForm {
  itemsConfig: TypeItemConfig;
  model: any;
  rules?: any;

  /** 控制 Layout Row - gutter */
  gutter?: number;

  search?: boolean;
  searchContext?: string;
  reset?: boolean;
  resetContext?: string;
}

const props = withDefaults(defineProps<Props>(), {
  // 可以理解为 Vue2 定义参数默认值的写法
  rules: () => {
    return {};
  },

  gutter: 20,

  search: false,
  searchContext: '查询',
  reset: false,
  resetContext: '重置',
});
const emits = defineEmits<{
  (e: 'onSearch'): void;
  (e: 'onReset'): void;
}>();

const attrs = useAttrs();
/** 检测是否开启 行内表单模式，开启了则不走 row-col 的布局 */
const attrsIsInLine = ref(!isUndefined(attrs.inline));

/** 保留 model 的初始值 */
let cacheOriginalModel: any = null;
const refYeoForm = ref<TypeElmForm>();
// 处理渲染 el-form-item
const __renderFormItems: Ref<TypeRenderItemConfig> = shallowRef([]);
// shallowRef：创建一个跟踪自身 .value 变化的 ref，但不会使其值也变成响应式的。
// Vue received a Component which was made a reactive object.
// This can lead to unnecessary performance overhead,
// and should be avoided by marking the component with `markRaw` or using `shallowRef` instead of `ref`.
// const __renderFormItems: Ref<TypeRenderItemConfig> = ref([]);

onMounted(() => {
  // set Original
  cacheOriginalModel = deepClone(props.model);

  // 配合配置项生成 el-form-item 所需内容（节点、属性等）
  __renderFormItems.value = props.itemsConfig.map((el) => computeFormItem(el));

  // 配置初始化之后，通知默认值更新
  notifyModelEvents();
  // 通知异步队列更新
  notifyAsyncModelEvents();
});

/** 合并 原有的/手动添加的 childAttrs */
const doMergeChildAttrs = <
  TOrigin,
  TGetAttrs extends <T>(args: T) => any | undefined
>(
  originAttrs: TOrigin,
  targetAttrs?: TGetAttrs
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
  const basicItem = chilldConfig[tag];

  if (!basicItem) throw new Error(`配置了不存在的组件类型 tag: ${tag}`);
  item.tag = basicItem.component;

  const { config } = resetComplexConfig(item, tag);
  const getOptions = setingOptions(item, tag);

  // 合并子表单项的 attrs
  item.childAttrs = Object.assign(
    {},
    // 写入动态组件里面定义的 默认属性
    basicItem.baseAttrs,
    item.childAttrs,
    getOptions,
    notEmptyObject(config) ? { config } : {}
  );

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
 * 过滤不需要 options 配置的组件名，
 * 在 elm 的某些组件中传入 “意外的属性（在这里是 options）” 会导致控制台的类型警告
 */
const shouldExcludeOptMaps = ['dataPicker'];
/** 适配不同类型 options 的属性设置 */
const setingOptions = <T extends PropsRenderItem>(item: T, tag: string) => {
  const excludeOptIdx = shouldExcludeOptMaps.findIndex(
    (excludeTag) => excludeTag === tag
  );
  if (excludeOptIdx !== -1) return {};

  let options = null;
  /** 提供内部控制的 loading 状态变更 */
  let hasSelfLoading = false;

  if (item.options) {
    if (isArray(item.options)) {
      // 数组，直接赋值
      options = item.options;

      // 函数，推入异步事件数组再做更新
    } else if (isFunction(item.options)) {
      // 默认开启 loading 加载
      hasSelfLoading = true;

      // 记录需要回显的绑定值
      let echoVal = null;
      // 当这个数据是需要通过异步事件（请求）获取，然后又携带了回显赋值的时候
      // 则记录回显值
      if (item.attrs) {
        if (checkHasBindVal(props.model[item.attrs.prop])) {
          isSkipModelNotify.value = true;
          echoVal = props.model[item.attrs.prop];
          props.model[item.attrs.prop] = null;
        }
      }

      // 然后再推入到异步事件数组
      subsAsyncModelCenter.value.push({
        // xxx! 非空断言保护
        idKey: item.idKey!,
        callback: item.options as any,
        prop: item.attrs?.prop as string,
        echoVal,
      });
    }

    // 清理之前的引入，由 childAttrs 统一处理
    delete item.options;
  }

  return {
    loading: hasSelfLoading,
    options,
  };
};
/** 校检当前传入值是否存在某种绑定值 */
const checkHasBindVal = (val: any) => {
  if (isArray(val) && val.length) return true;
  else if (isString(val) && val !== '') return true;
  else if (isNumber(val)) return true;
  else if (val) return true;
  else return false;
};

/**
 * 这类组件需要在内部自定义某些数据类型
 * 会把模型数据 Model 和当前绑定键值 prop 带过去
 */
const shouldSetConfigMaps = ['complexInput', 'complexData'];
/**
 * 设置 需要提供自定义绑定表单能力的 config
 * 为了兼容复合型输入框
 */
const resetComplexConfig = (item: PropsRenderItem, tag: KeyChildConfig) => {
  let config = {};
  if (shouldSetConfigMaps.findIndex((ele) => ele === tag) !== -1) {
    // 复合型输入框不需要再显示左侧的 label 文案
    item.attrs?.label && (item.attrs.label = '');

    config = {
      model: props.model,
      bindKey: item.attrs?.prop,
    };
  }

  return {
    config,
  };
};

/**
 * 接收动态更新项的 订阅中心，
 * 比如动态控制 节点渲染、组件属性 Attributes 等
 */
const subsModelCenter: Ref<PropsWatchEvents[]> = ref([]);
/** 加入需要订阅的相关内容 */
const pushSubsModel: TypeSubsPush = ({ idKey, k, cb }) => {
  const subsIdx = subsModelCenter.value.findIndex((subs) => subs.key === idKey);
  const subsVal: any = {
    k,
    cb,
  };

  // 避免重复添加相同的 key
  if (subsIdx === -1) {
    subsModelCenter.value.push({
      key: idKey,
      notices: [subsVal],
    });
  } else {
    subsModelCenter.value[subsIdx].notices?.push(subsVal);
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
 * 从而减少执行的次数，因为 model 的变化速率应该是相当频繁的
 * 有点难度了...
 */
const notifyModelEvents = () => {
  if (!subsModelCenter.value.length) return;

  subsModelCenter.value.forEach((watchEL) => {
    const curItemsIdx = __renderFormItems.value.findIndex(
      (items) => items.idKey === watchEL.key
    );

    // 通过下标改变某一项时，不会触发 shallowRef 的响应式变化
    // if (curItemsIdx !== -1) __renderFormItems.value[curItemsIdx].__isRender = xxx;

    // 但是直接更改 .value 可以
    __renderFormItems.value = __renderFormItems.value.map((fItems, idx) => {
      if (idx === curItemsIdx && watchEL.notices?.length) {
        for (const notiEl of watchEL.notices) {
          if (notiEl.cb && isFunction(notiEl.cb)) {
            fItems[notiEl.k] = notiEl.cb(props.model);
          }
        }
      }

      return fItems;
    });
  });
};

/** 允许手动修改 model 时，避免多余的通知消耗 */
const isSkipModelNotify = ref(false);
/**
 * 只有每次都 “克隆” 出一个新的对象，才能监听到对象里面的 新旧值变化
 * 为了识别 clearable 导致的字段被 elm 内部置为 null 的情况
 */
const cloneFormModel = computed(() => deepClone(props.model));
watch(
  () => cloneFormModel.value,
  (curModel, prevModel) => {
    if (isSkipModelNotify.value) {
      isSkipModelNotify.value = false;
      return;
    }

    // 处理 null 值
    useClearableErrorNull(props.model, prevModel);
    // 监听 model 变化，下发通知
    notifyModelEvents();
  },
  { deep: true }
);
/**
 * 处理 clearable 导致的 null 值问题
 * @param curModel 需要重新赋予正确空值类型的对象
 * @param prevModel 此时包含异常空值 null 类型的对象
 */
const useClearableErrorNull = (curModel: any, prevModel: any) => {
  for (const k in curModel) {
    if (isNull(curModel[k])) {
      if (prevModel[k]) {
        isSkipModelNotify.value = true;
        curModel[k] = isArray(prevModel[k]) ? [] : '';
      }
    }
  }
};

/**
 * 接收异步事件，用来异步更新 options
 */
const subsAsyncModelCenter: Ref<ItemAsyncSubs[]> = ref([]);
const notifyAsyncModelEvents = () => {
  const promiseAsync = subsAsyncModelCenter.value.map(async (el) => {
    const pmsValue = el.callback();

    // 用 Promise.resolve 包裹解析一下，适配传入的 options 回调是非 Promise 的情况
    return Promise.resolve(pmsValue).then((res) => {
      if (!res) return null;

      __renderFormItems.value = __renderFormItems.value.map((fItems) => {
        if (fItems.idKey === el.idKey) {
          // 更新绑定属性
          fItems['childAttrs']!.options = res;
          fItems['childAttrs']!.loading = false;
        }

        return fItems;
      });

      // 更新完列表数据后，还原回显值
      if (!isNull(el.echoVal)) {
        isSkipModelNotify.value = true;
        props.model[el.prop] = el.echoVal;
      }

      return res;
    });
  });

  Promise.all(promiseAsync)
    .then(() => {
      /** res */
    })
    .catch(() => {
      /** err */
    })
    .finally(() => {
      // 执行完后清理一下异步事件
      subsAsyncModelCenter.value.length = 0;
    });
};

const onSearchEmit = () => {
  emits('onSearch');
};
const onResetEmit = () => {
  resetFormModel();
  emits('onReset');
};
/** 重置表单 */
const resetFormModel = () => {
  // elm 的表单重置方法有问题，这里主要为了移除校验结果
  refYeoForm.value?.resetFields?.();

  // 这里再通过记录的表单初始值，进行重置
  for (const k in cacheOriginalModel) {
    props.model[k] = cacheOriginalModel[k];
  }
};

defineExpose({
  refYeoForm,
  resetFormModel,
});
</script>

<template>
  <ElForm
    ref="refYeoForm"
    class="yeo-form"
    v-bind="$attrs"
    :model="model"
    :rules="rules"
    size="default"
  >
    <ElRow :gutter="attrsIsInLine ? 0 : gutter">
      <template v-for="(fItems, fIdx) in __renderFormItems" :key="fIdx">
        <YDydFormCol
          v-show="fItems.__isRender"
          :span="fItems.span || 24"
          :original="attrsIsInLine"
        >
          <ElFormItem v-bind="fItems.attrs || {}">
            <!-- Slots -->
            <template v-if="fItems.slotKey">
              <slot :name="fItems.slotKey" :model="props.model"></slot>
            </template>

            <!-- Compontents -->
            <template v-else-if="fItems.attrs">
              <component
                :is="fItems.tag"
                v-model="model[fItems.attrs.prop]"
                v-bind="fItems.childAttrs || {}"
              />
            </template>
          </ElFormItem>
        </YDydFormCol>
      </template>

      <!-- 配合查询表格场景下的通用按钮组 -->
      <template v-if="search || reset">
        <div class="plus-form-btns">
          <ElButton v-if="search" type="primary" @click="onSearchEmit">{{
            searchContext
          }}</ElButton>
          <ElButton v-if="reset" @click="onResetEmit">{{
            resetContext
          }}</ElButton>
        </div>
      </template>
    </ElRow>
  </ElForm>
</template>

<style scoped>
/*  */
</style>
