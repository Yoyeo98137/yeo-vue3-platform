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
 * *useRequest*
 * 
 * - [x] 自动请求/手动请求（兼容带参函数的正常调用）
 * - [x] loading delay
 * - [ ] 重新加载（reload），这类似于再手动触发一下请求，但是从语义化，或者是参数不变的情况下，reload 是更匹配当前场景的
 * - [ ] 泛型推断
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

  // todo 怎样可以通过解构的形式，同时又保证 ts 的正常推断
  // 可以再封装一层函数
  // 这里的 options 是非必填的，然后加层的函数里面则保证一个默认值 空对象
  // 这样就可以对其进行解构了
  // return useRequestImplement<TRequset, TParams>(service, options);
  // const { manual = false } = options

  /** 是否开启手动请求开关 */
  const isManualRun = () => options?.manual
  /** 是否开启延迟加载 */
  const isLoadingDelay = () => options?.loadingDelay

  const clearTimerAll = () => {
    delayLoadingTimer.value && delayLoadingTimer.value()
  }

  const _run = (args: any) => {
    clearTimerAll()

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
    // isManualRun() && _run(args)
    // manual 的用意应该是 静止自动发起请求，而不是跟 run 回调捆绑的关系
    _run(args)
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
