
// hooks 通用类型定义

import { Ref } from "vue"

/**
 * [page | pageSize | total]
 *
 * @interface TablePageVal
 * @description 要保证 total 的输入来渲染分页、初始化为 0
 */
export interface TablePageVal {
  page: number
  pageSize: number
  total: number

  /** 补充给后台的识别字段 */
  limit?: number
}

// extends any[] -> 因为要给 ...args 定义数组类型（arguments 是类数组对象）
export type Service<TData, TParams extends any[]> = (
  ...args: TParams
) => Promise<TData>

// TParams - defaultParams 通过 TParams 接收参数类型校检
// 不过这里的 TParams extends any[] 好像并没什么作用
// 因为实际上在接收 TParams 的时候，这个 TParams 已经被指定为 extends any[] 了
export interface Options<TData, TParams extends any[]> {
  /** 手动请求开关 */
  manual?: boolean
  /** 接收发起自动请求时需要携带的参数 */
  defaultParams?: TParams
  /** 依赖刷新数组 */
  refreshDeps?: any[]
  /** 通过设置延迟的毫秒数，可以延迟 loading 变成 true 的时间，有效防止闪烁。 */
  loadingDelay?: number
  /** 请求等待依赖，当其值为 false 时，请求永远都不会发出 */
  ready?: Ref<Boolean>

  /** 节流 delay 时间 */
  throttleInterval?: number
  /** 防抖 wait 时间 */
  debounceInterval?: number

  onBefore?: (params?: TParams) => void
  onSuccess?: (data?: TData, params?: TParams) => void
  onError?: () => void
  onFinally?: () => void

  // [key: string]: any;
}

// todo more Types...
export interface RequestResult<TData, TParams extends unknown[]> {
  loading: Ref<boolean>
  error: any
  data: any

  // run: (...arg: TParams) => void
  // ?需要提供 .then 之类的回调吗
  run: (...arg: TParams) => Promise<TData | null>

  // 重新请求
  refresh: () => void
}

export interface PropPaginationPlus extends TablePageVal {
  updatePagination: (pageInfo: TablePageVal) => void
}
export interface ResultPagination<TData, TParams extends unknown[]>
  extends RequestResult<TData, TParams> {
  pagination: PropPaginationPlus

  /** 重新发起一次 分页的请求，相当于分页的手动 run */
  reload: () => void
}
