import { onMounted, Ref, ref } from "vue"

interface RequestResult<TRequset, TParams extends unknown[]> {
  loading: any,
  data: any,

  run: any
}
interface PropsRequestOptions {
  /** 接收发起自动请求时需要携带的参数 */
  defaultParams?: any

  /** 手动请求开关 */
  manual?: boolean
  /** 通过设置延迟的毫秒数，可以延迟 loading 变成 true 的时间，有效防止闪烁。 */
  loadingDelay?: number
}

/**
 * useRequest
 * 
 * - [x] 自动请求/手动请求（兼容带参函数的正常调用）
 * - [ ] loading delay
 * - [ ] ...
 * 
 * todo types.
 */
export function useRequest<TRequset, TParams extends unknown[] = any>(
  service: any,
): RequestResult<TRequset, TParams>;
export function useRequest<TRequset, TParams extends unknown[] = any>(
  service: any,
  options: PropsRequestOptions
): RequestResult<TRequset, TParams>;
export function useRequest<TRequset, TParams>(service: any, options?: PropsRequestOptions) {
  const loading = ref(false)
  const data = ref()
  const delayLoadingTimer = ref()

  /** 是否开启手动请求开关 */
  const isManualRun = () => options?.manual
  /** 是否开启延迟加载 */
  const isLoadingDelay = () => options?.loadingDelay

  const _run = (args: any) => {
    loading.value = !isLoadingDelay()
    delayLoadingTimer.value = checkDelayLoading()

    service(...args)
      .then((res: any) => {
        console.log('🏄 # service # res', res)

        data.value = res
        loading.value = false
      }).catch((error: any) => {
        // 
      }).finally(() => {
        // clear Delay timer
        delayLoadingTimer.value()
      })
  }
  // *手动请求
  const run = (...args: any) => {
    isManualRun() && _run(args)
  }
  // *自动请求
  onMounted(() => {
    // 参数兼容
    const params = options?.defaultParams?.length ? options?.defaultParams : []
    !isManualRun() && _run(params)
  })

  // *检测是否开启加载延迟
  const checkDelayLoading = () => {
    let delayTimer: number
    if (isLoadingDelay()) {
      delayTimer = setTimeout(() => {
        loading.value = true
      }, isLoadingDelay());
    }

    return () => delayTimer && clearTimeout(delayTimer)
  }

  return {
    loading,
    data,
    run
  }
}
