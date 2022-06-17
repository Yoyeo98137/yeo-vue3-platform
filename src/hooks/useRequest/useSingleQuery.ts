import type { Ref } from 'vue';
import { ref } from 'vue';
import type { Service, Config, SingleQueryResult } from './types';
import { resolvedPromise } from './index';
import { isNull } from '@/utils/ifType';
import { debounce, throttle } from '@/utils/lodash';

export function useSingleQuery<TQuery, TParams extends unknown[]>(
  service: Service<TQuery, TParams>,
  config: Config<TQuery, TParams>
): SingleQueryResult<TQuery, TParams> {
  // init Refs.
  const loading = ref(false);
  const data = ref<TQuery>();
  const error = ref<Error>();
  const params = ref([]) as unknown as Ref<TParams>;

  // init Config.
  const {
    loadingDelay,
    isAutoRunFlag,
    throttleInterval = null,
    debounceInterval = null,
    onBefore,
    onSuccess,
    onError,
    onAfter,
  } = config;

  const delayLoadingTimer = ref();
  /** 统一清理定时器 */
  const clearTimerAll = () => {
    delayLoadingTimer.value && delayLoadingTimer.value();
  };

  const __run = async (...args: TParams) => {
    // init Loading.
    loading.value = !loadingDelay;
    delayLoadingTimer.value = checkDelayLoading();

    // 同步调用参数
    params.value = args;
    // hooks onBefore.
    onBefore?.(args);

    return service(...args)
      .then((res) => {
        console.log('🏄 #### service #### res', res);
        data.value = res;
        error.value = undefined;
        // hooks onSuccess.
        onSuccess?.(res, args);
        return resolvedPromise;
      })
      .catch((err) => {
        console.log('🏄 #### service #### err', err);
        data.value = undefined;
        error.value = err;
        // hooks onError.
        onError?.(err, args);
        return resolvedPromise;
      })
      .finally(() => {
        // clear Delay
        delayLoadingTimer.value();
        // reset Loading
        loading.value = false;

        // hooks onAfter.
        onAfter?.(args);
      });
  };

  // 定义 防抖/节流 函数载体
  const debouncedRun =
    !isNull(debounceInterval) && debounce(__run, debounceInterval!);
  const throttledRun =
    !isNull(throttleInterval) && throttle(__run, throttleInterval!);

  const run = (...args: TParams) => {
    // clear.
    clearTimerAll();

    // initial auto run should not debounce
    if (!isAutoRunFlag.value && debouncedRun) {
      debouncedRun(...args);
      return resolvedPromise;
    }

    if (throttledRun) {
      throttledRun(...args);
      return resolvedPromise;
    }

    return __run(...args);
  };

  const refresh = () => run(...params.value);

  /** 检测是否开启加载延迟 */
  const checkDelayLoading = () => {
    let delayTimer: any;

    if (loadingDelay) {
      delayTimer = setTimeout(() => {
        loading.value = true;
      }, loadingDelay);
    }
    return () => delayTimer && clearTimeout(delayTimer);
  };

  return {
    loading,
    error,
    data,
    params,
    run,
    refresh,
  };
}
