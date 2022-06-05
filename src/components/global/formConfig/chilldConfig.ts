import { ElInput, ElSwitch, ElCheckbox } from 'element-plus';
import YDydSelect from './YDydSelect.vue';
import YDydRadio from './YDydRadio.vue';

// todo
export type KeyChildConfig =
  | 'input'
  | 'switch'
  | 'select'
  | 'radio'
  | 'checkout';

interface ValChildConfig {
  component: any;
  baseAttrs: any;
  [propName: string]: any;
}
type TypeChildConfig = Record<KeyChildConfig, ValChildConfig>;

export const chilldConfig: TypeChildConfig = {
  input: {
    component: ElInput,
    baseAttrs: {
      clearable: true,
      // ...
    },
  },

  // todo
  // 很奇怪就这个 Switch 会存在样式丢失问题
  switch: {
    component: ElSwitch,
    baseAttrs: {
      // ...
    },
  },

  select: {
    component: YDydSelect,
    baseAttrs: {
      // ...
    },
  },

  radio: {
    component: YDydRadio,
    baseAttrs: {},
  },

  checkout: {
    component: ElCheckbox,
    baseAttrs: {
      // ...
    },
  },
};
