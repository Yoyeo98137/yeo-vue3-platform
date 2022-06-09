<script setup lang="ts">
import { onMounted, Ref, ref, shallowRef, useAttrs, watch } from 'vue';
import {
  TypeElmForm,
  PropsRenderItem,
  TypeItemConfig,
  ItemAsyncSubs,
  TypeSubsPush,
  TypeRenderItemConfig,
  PropsWatchEvents,
} from './formConfig/types';
import { chilldConfig } from './formConfig/chilldConfig';
import {
  isArray,
  isAsyncFunction,
  isFunction,
  isNumber,
  isString,
} from '@/utils/ifType';
import deepClone from '@/utils/lodash/clone';

// Types.

interface Props extends TypeElmForm {
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
  // 配合配置项生成 el-form-item 所需内容（节点、属性等）
  __renderFormItems.value = props.itemsConfig.map((el) => computeFormItem(el));
  // 配置初始化之后，通知默认值更新
  notifyModelEvents();
  // 通知异步队列更新
  notifyAsyncModelEvents();
});

/**
 * 过滤不需要 options 配置的组件名，
 * 在 elm 的某些组件中传入 “意外的属性（在这里是 options）” 会导致控制台的类型警告
 */
const filterNotOptMap = ['dataPicker'];
const refYeoForm = ref<TypeElmForm>();
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

  const { options, loading } = setingOptions(item);
  const filterOptIdx = filterNotOptMap.findIndex((ele) => ele === tag);

  // 合并子表单项的 attrs
  item.childAttrs = Object.assign(
    {},
    // 写入动态组件里面定义的 默认属性
    basicItem.baseAttrs,
    item.childAttrs,
    // { options } -> { options: options }
    filterOptIdx === -1
      ? {
          options,
          loading,
        }
      : {}
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

/** 适配不同类型 options 的属性设置 */
const setingOptions = <T extends PropsRenderItem>(item: T) => {
  let options = null;
  /** 提供内部控制的 loading 状态变更 */
  let hasSelfLoading = false;

  if (item.options) {
    if (isArray(item.options)) {
      // 数组 直接赋值
      options = item.options;
    } else if (isFunction(item.options) && typeof item.options === 'function') {
      // 函数 调用赋值
      options = item.options();
    } else if (isAsyncFunction(item.options)) {
      // 默认开启 loading 加载
      hasSelfLoading = true;

      // 异步函数，并推入事件记录队列
      pushSubsModel({
        idKey: item.idKey as symbol,
        k: 'childAttrs',

        // todo 这块还可以再改改
        cb: item.options as any,
        // cb: async () => {
        //   const res =
        //     typeof item.options === 'function' && (await item.options?.());

        //   return {
        //     options: res,
        //     loading: false,
        //   };
        // },
      });
    }
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
 * 从而减少执行的次数，因为 model 的变化速率应该是相当频繁的
 * 有点难度了...
 */
const notifyModelEvents = () => {
  console.log(
    '🏄 # notifyModelEvents # subsModelCenter.value',
    subsModelCenter.value
  );
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
          if (notiEl.cb) {
            // 因为打算先把条件渲染更新了，再去做异步 options 的更新
            // 所以现在分了两个事件数组，同步和异步分开更新

            if (isFunction(notiEl.cb)) {
              fItems[notiEl.k] = notiEl.cb(props.model);
            }

            if (isAsyncFunction(notiEl.cb)) {
              // 记录需要还原的绑定值
              let echoVal = null;
              // 当这个数据是需要通过异步事件（请求）获取，然后又携带了回显赋值的时候
              // 则记录还原值
              if (fItems.attrs) {
                if (checkHasBindVal(props.model[fItems.attrs.prop])) {
                  isSkipModelNotify.value = true;
                  echoVal = props.model[fItems.attrs.prop];
                  props.model[fItems.attrs.prop] = null;
                }
              }

              subsAsyncModelCenter.value.push({
                idKey: watchEL.key,
                k: notiEl.k,
                cb: notiEl.cb as any,
                prop: fItems.attrs?.prop as string,
                // 回显值
                echoVal,
              });

              // 清理异步回调，避免重复更新值
              notiEl.cb = null as any;
            }
          }
        }
      }

      return fItems;
    });
  });
};

/** 允许手动修改 model 时，跳过通知的下发 */
const isSkipModelNotify = ref(false);
watch(
  props.model,
  (val) => {
    if (isSkipModelNotify.value) {
      isSkipModelNotify.value = false;
      return;
    }

    console.log('🏄 # props.model # val', val);
    // 监听 model 变化，下发通知
    notifyModelEvents();
  },
  { deep: true }
);

/**
 * 接收异步事件，用来异步更新 options
 */
const subsAsyncModelCenter: Ref<ItemAsyncSubs[]> = ref([]);
const notifyAsyncModelEvents = () => {
  const promiseAsync = subsAsyncModelCenter.value.map(async (el) => {
    return el.cb().then((res) => {
      if (!res) return null;

      __renderFormItems.value = __renderFormItems.value.map((fItems) => {
        if (fItems.idKey === el.idKey) {
          fItems[el.k] = {
            options: res,
            loading: false,
          };
        }

        return fItems;
      });

      // 还原选中值
      if (el.echoVal) {
        isSkipModelNotify.value = true;
        props.model[el.prop] = el.echoVal;
      }

      return res;
    });
  });

  Promise.all(promiseAsync)
    .then((res) => {
      console.log('🏄 # GG # .then # res', res);
      /** res */
    })
    .catch(() => {
      /** err */
    })
    .finally(() => {
      console.log('🏄 # GG # promiseAsync # finally');
      // 执行完后清理一下异步事件
      subsAsyncModelCenter.value.length = 0;
    });
};

defineExpose({
  refYeoForm,
});
</script>

<template>
  <ElForm
    class="yeo-form"
    ref="refYeoForm"
    v-bind="$attrs"
    :model="model"
    :rules="rules"
    size="default"
  >
    <ElRow :gutter="gutter">
      <template v-for="(fItems, fIdx) in __renderFormItems" :key="fIdx">
        <ElCol v-show="fItems.__isRender" :span="fItems.span || 24">
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
              <!-- 组件自动引入的问题？ -->
              <!-- 必须要在页面的某个地方注册一次，才能拿到组件样式 -->
              <!-- <el-switch v-model="model[fItems.attrs.prop]" /> -->
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
