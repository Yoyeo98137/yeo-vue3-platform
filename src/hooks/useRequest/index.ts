import { onMounted, ref } from "vue"
import { Service, Options, RequestResult } from "../types"

/**
 * *useRequest*
 * 
 * - [x] 自动请求/手动请求（兼容带参函数的正常调用）
 * - [x] loading delay
 * - [x] 继承请求体入参类型推断 
 * - [x] 泛型推断
 * - [x] 安全解构
 * - [ ] 动态参数（尤其是手动执行场景下）
 * - [ ] 重新加载（reload），这类似于再手动触发一下请求，但是从语义化，或者是参数不变的情况下，reload 是更匹配当前场景的
 * - [ ] 放置回调钩子（before、success、finally...）
 * - [ ] 应该自带 节流 能力
 * - [ ] ...
 * 
 * *自动执行的更多能力*
 * - [ ] 数据自制化（reRender）比如表格，需要在拿到响应数据后再修改一下字段结构
 * - [ ] 刷新，以原本相同的参数重新发起请求，重新渲染数据（reload）
 * - [ ] init、reload、run 之间的联系
 * 
 * 把这个 _run 或者说 service 抽离出去，方便后面提供给场景 hooks
 * 
 * todo types.
 */
export function useRequest<TRequset, TParams extends unknown[]>(
  service: Service<TRequset, TParams>
): RequestResult<TRequset, TParams>;
export function useRequest<TRequset, TParams extends unknown[]>(
  service: Service<TRequset, TParams>,
  options: Options<TRequset, TParams>
): RequestResult<TRequset, TParams>;
export function useRequest<TRequset, TParams extends unknown[]>(
  service: Service<TRequset, TParams>,
  options?: Options<TRequset, TParams>
) {

  const loading = ref(false)
  const error = ref()
  const data = ref()
  const delayLoadingTimer = ref()

  // 空值合并 ??
  // 类似于 || 的效果，大概区别是：
  // 0 || 5 -> 5
  // 0 ?? 5 -> 0
  const {
    manual,
    defaultParams = [],
    loadingDelay,
    onBefore,
    onSuccess,
    onError,
    onFinally,
  } = options ?? {}

  /** 统一清理定时器 */
  const clearTimerAll = () => {
    delayLoadingTimer.value && delayLoadingTimer.value()
  }

  const _run = (args: TParams) => {
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
  // *手动请求
  const run = (...args: TParams) => {
    // manual && _run(args)
    // ? manual 的用意应该是 静止自动发起请求，而不是跟 run 回调捆绑的关系
    _run(args)
  }
  // *自动请求
  onMounted(() => {
    if (manual) return
    _run(defaultParams as TParams)
  })

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
    run
  }
}
