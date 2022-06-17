import { reactive } from 'vue';
import type {
  Service,
  BaseOptions,
  BaseResult,
  PropPaginationPlus,
  TablePageVal,
} from '../useRequest/types';
import { merge } from '@/utils/lodash';
import { useRequest } from '../useRequest';
import { unRefParams } from '../useRequest/useSingleQuery';

interface PaginationResult<Q, R extends unknown[]> extends BaseResult<Q, R> {
  pagination: any;
}

/**
 * usePagination
 * @description 通用分页、集成 useRequest
 */
export function usePagination<TQuery, TParams extends unknown[]>(
  service: Service<TQuery, TParams>
): PaginationResult<TQuery, TParams>;
export function usePagination<TQuery, TParams extends unknown[]>(
  service: Service<TQuery, TParams>,
  options: BaseOptions<TQuery, TParams>
): PaginationResult<TQuery, TParams>;
export function usePagination<TQuery, TParams extends unknown[]>(
  service: Service<TQuery, TParams>,
  options?: BaseOptions<TQuery, TParams>
) {
  /** 收到分页切换回调，重新合并参数并发起请求 */
  const updatePagination = (pageInfo: TablePageVal) => {
    // 同步 limit
    pageInfo.limit = pageInfo.pageSize;

    const otherRes = unRefParams(...cacheParams);
    const [, ...restParams] = params.value as TParams[];
    // todo 扩张参数必须具有元组类型或传递给 rest 参数。ts(2556)
    // @ts-ignore
    const updateParams = merge(...otherRes, pageInfo);
    const mergePrams = [updateParams, ...restParams] as TParams;

    run(...mergePrams);
  };

  // *Init pagination
  const bindPagination: PropPaginationPlus = reactive({
    page: 1,
    pageSize: 10,
    limit: 10,
    total: 0,
    updatePagination,
  });

  // todo
  /** 分页请求完成 更新 total */
  const successPagination = (res: any) => {
    const { info = {} } = res;
    const { page = {}, result = [] } = info;
    const { totalCount = result.length } = page;
    bindPagination.total = totalCount;
  };

  const { ...restOptions } = options ?? {};
  const cacheParams = (restOptions.defaultParams ?? []) as TParams;

  console.log('🏄 #### restOptions', restOptions);
  console.log('🏄 #### cacheParams', cacheParams);

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
      // paginationModel: bindPagination,
      // onSuccess: successPagination,
    },
    restOptions
  );

  console.log('🏄 #### usePagination #### finallyOptions', finallyOptions);

  const { run, params, queries, ...rest } = useRequest(service, finallyOptions);

  return {
    run,
    pagination: bindPagination,
    ...rest,
  };
}
