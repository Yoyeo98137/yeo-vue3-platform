import YDydComplexData from './YDydComplexData.vue';
import YDydComplexInput from './YDydComplexInput.vue';
import YDydFormCol from './YDydFormCol.vue';
import YDydFormItem from './YDydFormItem.vue';
import YDydNumberInput from './YDydNumberInput.vue';
import YDydRadio from './YDydRadio.vue';
import YDydSelect from './YDydSelect.vue';
import YeoForm from '../YeoForm.vue';

declare module 'vue' {
  export interface GlobalComponents {
    YDydComplexData: typeof YDydComplexData;
    YDydComplexInput: typeof YDydComplexInput;
    YDydFormCol: typeof YDydFormCol;
    YDydFormItem: typeof YDydFormItem;
    YDydNumberInput: typeof YDydNumberInput;
    YDydRadio: typeof YDydRadio;
    YDydSelect: typeof YDydSelect;
    YeoForm: typeof YeoForm;
  }
}
