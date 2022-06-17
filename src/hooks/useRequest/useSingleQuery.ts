import type { Ref } from 'vue';
import { ref } from 'vue';
import type { Service, Config, SingleQueryResult } from './types';
import { resolvedPromise } from './index';

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
  const { loadingDelay, isAutoRunFlag, onBefore, onSuccess, onError, onAfter } =
    config;

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

        // hooks onSuccess.
        onSuccess?.(res, args);
        return resolvedPromise;
      })
      .catch((err) => {
        console.log('🏄 #### service #### err', err);
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
  const run = (...args: TParams) => {
    // throttle
    // debounce
    // queryCount
    // ...

    clearTimerAll();

    // initial auto run should not debounce
    if (!isAutoRunFlag.value) {
      //
    }

    return __run(...args);
  };

  // todo cancel
  // const cancel = () =>
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
