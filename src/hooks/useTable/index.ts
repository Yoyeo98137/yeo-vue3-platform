
import { computed, Ref } from "vue"
import { isFunction } from "@/utils/ifType"
import { Service, Options, ResultPagination } from "../types"
import { usePagination } from "../usePagination"

interface OptionsTable<TData, TParams extends unknown[]>
  extends Options<TData, TParams> {
  /** 允许重新定制表格 */
  reRender?: (ele: any, index: any) => void
}
interface ResultTable<TData, TParams extends unknown[]>
  extends ResultPagination<TData, TParams> {
  list: Ref<any[]>
  /** 刷新表格（刷新分页） */
  reload: (...arg: TParams) => void
  // reload: (...arg: TParams) => Promise<TData | null>
  // reload: () => void
}

/**
 * useTable
 * @description 通用表格、集成分页 请求
 * todo
 * - not run, Is reload
 * - types...
 */
export function useTable<TData, TParams extends unknown[]>(
  service: Service<TData, TParams>
): ResultTable<TData, TParams>
export function useTable<TData, TParams extends unknown[]>(
  service: Service<TData, TParams>,
  options: OptionsTable<TData, TParams>
): ResultTable<TData, TParams>
export function useTable<TData, TParams extends unknown[]>(
  service: Service<TData, TParams>,
  options?: OptionsTable<TData, TParams>
) {
  const { reRender } = options ?? {}

  // Set request
  const {
    data,
    pagination,
    reQuery,

    // 保留剩余的导出，再提供出去
    ...rest
  } = usePagination(service, options!)

  // Init/Update table-list
  const list: Ref<any[]> = computed(() => {
    let res: any = []

    console.log("🏄 #### computed #### list #### data", data.value)

    if (data.value) {
      const { info = {} } = data
      const { result = [] } = info

      // 重新处理数据格式
      if (isFunction(reRender)) {
        res = result.map((ele: any, index: any) =>
          // todo
          /* @ts-ignore */
          reRender(ele, index)
        )
      } else res = result
    }

    return res
  })

  const reload = (...arg: TParams) => {
    console.log('🏄 # reload # arg', arg)
    pagination.initPagination()
  }

  return {
    list,
    pagination,
    reload,
    reQuery,

    ...rest,
  }
}
