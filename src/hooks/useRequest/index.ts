import { isRef, onMounted, ref, watch } from "vue"
import { Service, Options, RequestResult } from "../types"
import { isNull, isObject } from "@/utils/ifType"
import deepClone from "@/utils/lodash/clone"
import debounce from "@/utils/lodash/debounce"
import throttle from "@/utils/lodash/throttle"

/**
 * *useRequest*
 * 
 * - [x] 自动请求/手动请求（兼容带参函数的正常调用）
 * - [x] loading delay
 * - [x] 继承请求体入参类型推断 
 * - [x] 泛型推断
 * - [x] 安全解构
 * - [x] 回调钩子（before、success、finally...）
 * - [x] ready
 *        等待执行（所谓等待，应该是期望在请求发起之前，先暂停一会，等待某个执行完毕 即返回 true）
 *        两个场景：
 *        - 当 manual=false 自动请求模式时，每次 ready 从 false 变为 true 时，都会自动发起请求，会带上参数 options.defaultParams。
 *        - 当 manual=true 手动请求模式时，只要 ready=false，则通过 run/runAsync 触发的请求都不会执行。
 *        - 参考 @ses: https://ahooks.gitee.io/zh-CN/hooks/use-request/ready
 * - [x] 兼容响应式参数
 * - [x] 重新发起请求 refresh
 * - [x] 依赖刷新 refreshDeps（see: https://www.attojs.com/guide/documentation/refreshDeps.html）
 * - [x] 节流、防抖选项
 * - [ ] ...
 */
export function useRequest<TData, TParams extends unknown[]>(
  service: Service<TData, TParams>
): RequestResult<TData, TParams>;
export function useRequest<TData, TParams extends unknown[]>(
  service: Service<TData, TParams>,
  options: Options<TData, TParams>
): RequestResult<TData, TParams>;
export function useRequest<TData, TParams extends unknown[]>(
  service: Service<TData, TParams>,
  options?: Options<TData, TParams>
) {

  const loading = ref(false)
  const error = ref()
  const data = ref()
  const delayLoadingTimer = ref()

  // 空值合并 ??assdgosnsf
  // 类似于 || 的效果，大概区别是：
  // 0 || 5 -> 5
  // 0 ?? 5 -> 0
  const {
    manual,
    defaultParams = [],
    refreshDeps = [],
    loadingDelay,
    ready = ref(true),
    throttleInterval = null,
    debounceInterval = null,

    paginationModel,

    onBefore,
    onSuccess,
    onError,
    onFinally,
  } = options ?? {}

  /** 统一清理定时器 */
  const clearTimerAll = () => {
    delayLoadingTimer.value && delayLoadingTimer.value()
  }
  /**
   * 识别存在的 响应式参数，然后重新赋值
   * - 如果是单独的 ref，直接赋值，不需要再 .value
   * - 如果是 reactive 中的某个属性则通过计算属性转成 ref：computed(() => reactive.xxx)
   * - 如果是字段比较多的 reactive 想配合解构使用：...toRefs(reactive)
   */
  const reVarReactiveParams = (targetArgs: any) => {
    // Deep clone.
    const cloneTarget = deepClone(targetArgs)

    const reactiveInParams = cloneTarget.map((pms: any) => {
      // todo
      // 目前只兼容了单层对象
      if (isObject(pms)) {
        for (const key in pms) {
          // 识别响应式参数值
          if (isRef(pms[key])) pms[key] = pms[key].value
        }
      }
      // 单层数组、以及其他的基本类型
      if (isRef(pms)) pms = pms.value

      return pms
    })

    return reactiveInParams
  }

  /** 记录等待依赖参数 */
  const tempReadyParams = ref()

  const _run = (args: TParams) => {
    // wait ready state.
    if (!ready.value) {
      tempReadyParams.value = args
      return
    }

    // Run before
    onBefore?.(args)

    // Clear all
    clearTimerAll()

    loading.value = !loadingDelay
    delayLoadingTimer.value = checkDelayLoading()

    service(...args)
      .then((res) => {
        console.log('🏄 # service......')
        console.log('🏄 # service # res', res)
        console.log('🏄 # service......end')
        console.log('')

        data.value = res
        // Run success
        onSuccess?.(res, args)

      }).catch((err) => {
        error.value = err
        // Run error
        onError?.()

      }).finally(() => {
        // clear Delay timer
        delayLoadingTimer.value()

        // init loading
        loading.value = false

        // Run finally
        onFinally?.()
      })
  }

  /** 统一限制节流防抖的执行 */
  const waitRunCenter = (args: TParams) => {
    if (debouncedRun) {
      /* @ts-ignore */
      return debouncedRun(reVarReactiveParams(args))
    }

    if (throttledRun) {
      /* @ts-ignore */
      return throttledRun(reVarReactiveParams(args))
    }

    return _run(reVarReactiveParams(args))
  }

  // *手动请求
  const run = (...args: TParams) => {
    // manual && _run(args)
    // ? manual 的用意应该是 静止自动发起请求，而不是跟 run 回调捆绑的关系
    waitRunCenter(args)
  }
  // *自动请求
  onMounted(() => {
    if (manual) return
    waitRunCenter(defaultParams as TParams)
  })

  // *定义防抖/节流函数载体
  const debouncedRun =
    !isNull(debounceInterval) &&
    debounce(_run);
  const throttledRun =
    !isNull(throttleInterval) &&
    throttle(_run);

  // *携带默认参数，重新发起请求
  const refresh = () => {
    // _run 的时候会把请求发出的分页参数重置
    // 但是不会触发绑定在页面组件的参数，因为两者的取值源头在这里并不一样
    // 所以在识别到分页参数的时候，手动触发一下页面组件绑定的更新来避免视图更新异常
    if (paginationModel) {
      paginationModel.page = 1
      paginationModel.pageSize = paginationModel.limit = 10
    }

    waitRunCenter(defaultParams as TParams)
  }

  // *依赖刷新，相当于基于 watch 监听响应式对象的语法糖
  if (refreshDeps.length) {
    // 如果监听的是 ref - [ref1, ref2...]
    // 如果监听的是 reactive 中的某个字段 - [() => reactive.xx1, () => reactive.xx2...]
    watch(refreshDeps, () => {
      refresh()
    })
  }

  // *监听等待依赖变化，然后重新发起请求
  watch(ready, (val => {
    if (val && tempReadyParams.value) {
      _run(tempReadyParams.value)
    }
  }))
  // @see: https://v3.cn.vuejs.org/api/instance-methods.html#watch
  // @see: https://github.com/AttoJS/vue-request/blob/0df0977c74c83301ad092554642dccb07420f011/src/core/useAsyncQuery.ts#L219
  // 有一个关于 watch 的配置应用 flush: 'sync'
  // vue 的文档是这么介绍的：“这将强制效果始终同步触发。然而，这是低效的，应该很少需要。”
  // 猜测大概是防止异步的 ready 变化导致逻辑错误的处理，在后面补充 asyncRun 的时候再调试

  // *检测是否开启加载延迟
  const checkDelayLoading = () => {
    let delayTimer: any
    if (loadingDelay) {
      delayTimer = setTimeout(() => {
        loading.value = true
      }, loadingDelay);
    }

    return () => delayTimer && clearTimeout(delayTimer)
  }

  return {
    loading,
    error,
    data,
    run,
    refresh
  }
}
