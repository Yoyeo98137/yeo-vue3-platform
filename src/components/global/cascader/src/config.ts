import { computed } from 'vue';
import { CascaderConfig, CascaderProps } from './types';

export const DefaultProps: CascaderConfig = {
  checkStrictly: false, // whether all nodes can be selected
  emitPath: false,
  lazy: false,
  lazyLoad: () => {},
};

export const useCascaderConfig = (props: { props: CascaderProps }) => {
  // 首先应用默认值，而后接入自定义配置项
  return computed(() => ({
    ...DefaultProps,
    ...props.props,
  }));
};
