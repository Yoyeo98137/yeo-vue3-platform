import { reactive } from "vue"
import { useRequest } from "../useRequest"

import {
  Service,
  Options,
  PropPaginationPlus,
  ResultPagination,
  TablePageVal,
} from "../types"
import merge from "@/utils/lodash/merge"

/**
 * usePagination
 * @description 通用分页、集成 useRequest
 */
export function usePagination<TData, TParams extends unknown[]>(
  service: Service<TData, TParams>
): ResultPagination<TData, TParams>
export function usePagination<TData, TParams extends unknown[]>(
  service: Service<TData, TParams>,
  options: Options<TData, TParams>
): ResultPagination<TData, TParams>
export function usePagination<TData, TParams extends unknown[]>(
  service: Service<TData, TParams>,
  options?: Options<TData, TParams>
) {
  const mergePaginationParams = (...args: TParams) => {
    runPagination(
      /* @ts-ignore */
      merge(
        {
          page: bindPagination.page,
          limit: bindPagination.limit,
        },
        // 合并 分页之外 的参数
        ...((args ?? []) as any[])
      )
    )
  }
  /** 设置分页，发出新请求 */
  const setPagination = (page: number, pageSize: number) => {
    bindPagination.page = page
    bindPagination.pageSize = bindPagination.limit = pageSize

    // Merge Params
    mergePaginationParams(...(restOptions.defaultParams ?? []) as TParams)
  }

  /** 收到分页切换回调 */
  const updatePagination = (pageInfo: TablePageVal) => {
    const { page, pageSize } = pageInfo
    console.log("🏄 #### updatePagination #### pageInfo", pageInfo)

    // step
    // 1. 页码更新 触发回调
    // 2. 更新分页信息（页码）
    // 3. 携带更新参数，重新发起分页请求
    setPagination(page, pageSize)
  }

  // *Init pagination
  const bindPagination: PropPaginationPlus = reactive({
    page: 1,
    pageSize: 10,
    limit: 10,
    total: 0,
    updatePagination,
  })

  /** 分页请求完成 更新 total */
  const successPagination = (res: any) => {
    console.log("🏄 #### successPagination #### res", res)

    // Set Total...
    const { info = {} } = res
    const { page = {}, result = [] } = info
    const { totalCount = result.length } = page
    bindPagination.total = totalCount
  }

  const { ...restOptions } = options ?? {}
  // *Merge options
  const finallyOptions = merge(
    {
      // 补充分页参数
      defaultParams: [
        {
          page: 1,
          limit: 10,
        },
      ],
      paginationModel: bindPagination,
      onSuccess: successPagination,
    },
    restOptions
  )
  console.log("🏄 #### finallyOptions", finallyOptions)

  // *Run request
  const {
    run: runPagination,
    // 保留剩余的导出，再提供出去
    ...rest
  } = useRequest(service, finallyOptions)

  return {
    pagination: bindPagination,
    ...rest,
  }
}
