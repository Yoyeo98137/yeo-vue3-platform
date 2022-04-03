import { onMounted, Ref, ref } from "vue"

interface RequestResult<TRequset, TParams extends unknown[]> {
  loading: any,
  data: any,

  run: any
}
interface PropsRequestOptions {
  /** 接收发起自动请求时需要携带的参数 */
  defaultParams?: any

  /** 自动请求开关 */
  manual?: boolean
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

  const isManualRun = () => {
    return options?.manual
  }

  const _run = (args: any) => {
    loading.value = true
    service(...args).then((res: any) => {
      console.log('🏄 # service # res', res)

      data.value = res
      loading.value = false
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

  return {
    loading,
    data,
    run
  }
}
