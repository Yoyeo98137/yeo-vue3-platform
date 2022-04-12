/*
 * @Description: hooks 通用类型定义
 * @Author: yeo
 * @Date: 2022-04-11 09:30:19
 * @LastEditors: yeo
 * @LastEditTime: 2022-04-11 09:36:32
 */

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
  /** 通过设置延迟的毫秒数，可以延迟 loading 变成 true 的时间，有效防止闪烁。 */
  loadingDelay?: number

  onBefore?: (params: TParams) => void
  onSuccess?: (data: TData, params: TParams) => void
  // and More...

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
}

export interface PropPaginationPlus extends TablePageVal {
  initPagination: () => void
  updatePagination: (pageInfo: TablePageVal) => void
}
export interface ResultPagination<TData, TParams extends unknown[]>
  extends RequestResult<TData, TParams> {
  pagination: PropPaginationPlus
}
