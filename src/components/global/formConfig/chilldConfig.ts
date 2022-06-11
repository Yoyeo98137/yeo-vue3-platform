import { ElInput, ElDatePicker } from 'element-plus';
import YDydNumberInput from '@/components/global/formConfig/YDydNumberInput.vue';
import YDydSelect from '@/components/global/formConfig/YDydSelect.vue';
import YDydRadio from '@/components/global/formConfig/YDydRadio.vue';
import YDydComplexInput from '@/components/global/formConfig/YDydComplexInput.vue';
import YDydComplexData from '@/components/global/formConfig/YDydComplexData.vue';

export type KeyChildConfig =
  | 'input'
  | 'numberInput'
  | 'dataPicker'
  | 'select'
  | 'radio'
  | 'complexInput'
  | 'complexData';

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
    },
  },
  select: {
    component: YDydSelect,
    baseAttrs: {},
  },
  radio: {
    component: YDydRadio,
    baseAttrs: {},
  },

  numberInput: {
    component: YDydNumberInput,
    baseAttrs: {
      clearable: true,
    },
  },
  dataPicker: {
    component: ElDatePicker,
    baseAttrs: {
      type: 'daterange',
      rangeSeparator: '~',
      startPlaceholder: '开始日期',
      endPlaceholder: '结束日期',
      valueFormat: 'x',
      // 范围选择时选中日期所使用的当日内具体时刻
      // 业务计算到最后的实际 23:59:59
      defaultTime: [
        new Date(2000, 1, 1, 0, 0, 0),
        new Date(2000, 2, 1, 23, 59, 59),
      ],
    },
  },
  /** 复合型输入框 */
  complexInput: {
    component: YDydComplexInput,
    baseAttrs: {},
  },
  /** 复合型时间选择器 */
  complexData: {
    component: YDydComplexData,
    baseAttrs: {},
  },
};
