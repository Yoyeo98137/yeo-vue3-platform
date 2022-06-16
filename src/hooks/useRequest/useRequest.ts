import type { Ref } from 'vue';
import { ref, reactive, computed, watch } from 'vue';
import type {
  Service,
  Queries,
  BaseOptions,
  Config,
  BaseResult,
  UnWrapState,
} from './types';
import { useSingleQuery } from './useSingleQuery';

/**
 * todoList
 * - [x] 自动请求、手动请求
 * - [x] 携带参数手动发起请求 run
 * - [x] 携带默认参数重新请求 refresh
 * - [x] 延迟 loadingDelay
 * - [x] 依赖刷新 refreshDeps
 * - [x] 并发请求控制
 * - [ ] 节流
 * - [ ] 防抖
 * - [ ] usePagination 迁移
 * - [ ] useTable 迁移
 */

// default Key.
const QUERY_DEFAULT_KEY = '__QUERY_DEFAULT_KEY__';

export function useRequest<TQuery, TParams extends unknown[]>(
  service: Service<TQuery, TParams>
): BaseResult<TQuery, TParams>;
export function useRequest<TQuery, TParams extends unknown[]>(
  service: Service<TQuery, TParams>,
  options: BaseOptions<TQuery, TParams>
): BaseResult<TQuery, TParams>;
export function useRequest<TQuery, TParams extends unknown[]>(
  service: Service<TQuery, TParams>,
  options?: BaseOptions<TQuery, TParams>
) {
  // init Refs.
  const loading = ref(false);
  const data = ref<TQuery>();
  const error = ref<Error>();
  const params = ref() as Ref<TParams>;
  // const params: Ref<TParams | undefined>
  // const params = ref<TParams>()

  // init Options.
  const {
    manual = false,
    // 类型 "never[]" 到类型 "TParams" 的转换可能是错误的，因为两种类型不能充分重叠。
    // 如果这是有意的，请先将表达式转换为 "unknown"。
    // defaultParams = [] as TParams,
    defaultParams = [] as unknown as TParams,
    loadingDelay = 0,
    refreshDeps = [],

    queryKey,
    ...rest
  } = options ?? {};

  // 用于判断是否为自动请求
  // skip debounce when initail run
  const isAutoRunFlag = ref(false);

  const config = {
    isAutoRunFlag,
    loadingDelay,
    queryKey,
    ...rest,
  } as Config<TQuery, TParams>;

  // 管理当前的请求
  // 解包？
  const queries = reactive<Queries<TQuery, TParams>>({
    [QUERY_DEFAULT_KEY]: reactive(useSingleQuery(service, config)),
    // [QUERY_DEFAULT_KEY]: useSingleQuery(service, config),
  });
  // 为什么需要响应式的变量？因为需要依赖计算属性去更新状态。
  const latestQueryKey = ref(QUERY_DEFAULT_KEY);
  const latestQuery = computed(() => queries[latestQueryKey.value] ?? {});

  // sync Status.
  watch(
    latestQuery,
    (queryData) => {
      // console.log("🏄 #### queryData", queryData)

      loading.value = queryData?.loading;
      data.value = queryData?.data as TQuery;
      error.value = queryData?.error;
      params.value = queryData?.params as TParams;
    },
    {
      deep: true,
      immediate: true,
    }
  );

  const run = (...args: TParams) => {
    // set Key.
    const newQueryKey = queryKey?.(...args) ?? QUERY_DEFAULT_KEY;
    if (!queries[newQueryKey]) {
      // 这里推入到 queries 时少了外层的 reactive
      // 但是初始化 QUERY_DEFAULT_KEY 时就有，可能就是这层结构导致了 TS 语法问题
      // todo
      /** @ts-ignore */
      queries[newQueryKey] = <UnWrapState<TQuery, TParams>>(
        reactive(useSingleQuery(service, config))
      );
    }
    // console.log("🏄 #### run #### queries", queries)
    // Update: latestQueryKey - latestQuery - latestQuery.value.run
    // 否则更新的一直是 queries["QUERY_DEFAULT_KEY"] 对象里面的状态值，而不是某个 queryKey() 识别的状态值
    latestQueryKey.value = newQueryKey;

    // 想象成 queries[xxx].run 就好理解了
    return latestQuery.value.run(...args);
  };

  // todo cancel
  // const cancel = () =>
  const refresh = () => latestQuery.value.refresh();

  // init Run.
  // no Mounted，like Created.
  if (!manual) {
    isAutoRunFlag.value = true;
    run(...defaultParams);
    isAutoRunFlag.value = false;
  }

  // 依赖刷新，相当于基于 watch 监听响应式对象的语法糖
  if (refreshDeps.length) {
    watch(refreshDeps, () => {
      !manual && refresh();
    });
  }

  // onUnmounted(() => {
  //   unmountQueries();
  // });

  return {
    loading,
    data,
    error,
    params,
    // todo
    /** @ts-ignore */
    queries,
    run,
    refresh,
  };
}
