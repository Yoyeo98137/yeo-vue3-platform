<script lang="ts" setup>
import YeoCascader from '@/components/global/cascader';
import type {
  CascaderProps,
  CascaderNodePathValue,
} from '@/components/global/cascader';
import { ref, watch } from 'vue';

// const cascaderValue = ref('');
// const cascaderValue = ref('guide');
// const cascaderValue = ref('disciplines');
const cascaderValue = ref('consistency');
const cascaderOptions = [
  {
    value: 'guide',
    label: 'Guide',
    children: [
      {
        value: 'disciplines',
        label: 'Disciplines',
        children: [
          {
            value: 'consistency',
            label: 'Consistency',
          },
          {
            value: 'feedback',
            label: 'Feedback',
          },
          {
            value: 'efficiency',
            label: 'Efficiency',
          },
          {
            value: 'controllability',
            label: 'Controllability',
          },
        ],
      },
      {
        value: 'navigation',
        label: 'Navigation',
        children: [
          {
            value: 'side nav',
            label: 'Side Navigation',
          },
          {
            value: 'top nav',
            label: 'Top Navigation',
          },
        ],
      },
    ],
  },
  {
    value: 'component',
    label: 'Component',
    children: [
      {
        value: 'basic',
        label: 'Basic',
        children: [
          {
            value: 'layout',
            label: 'Layout',
          },
          {
            value: 'color',
            label: 'Color',
          },
          {
            value: 'typography',
            label: 'Typography',
          },
          {
            value: 'icon',
            label: 'Icon',
          },
          {
            value: 'button',
            label: 'Button',
          },
        ],
      },
      {
        value: 'form',
        label: 'Form',
        children: [
          {
            value: 'radio',
            label: 'Radio',
          },
          {
            value: 'checkbox',
            label: 'Checkbox',
          },
          {
            value: 'input',
            label: 'Input',
          },
          {
            value: 'input-number',
            label: 'InputNumber',
          },
          {
            value: 'select',
            label: 'Select',
          },
          {
            value: 'cascader',
            label: 'Cascader',
          },
          {
            value: 'switch',
            label: 'Switch',
          },
          {
            value: 'slider',
            label: 'Slider',
          },
          {
            value: 'time-picker',
            label: 'TimePicker',
          },
          {
            value: 'date-picker',
            label: 'DatePicker',
          },
          {
            value: 'datetime-picker',
            label: 'DateTimePicker',
          },
          {
            value: 'upload',
            label: 'Upload',
          },
          {
            value: 'rate',
            label: 'Rate',
          },
          {
            value: 'form',
            label: 'Form',
          },
        ],
      },
      {
        value: 'data',
        label: 'Data',
        children: [
          {
            value: 'table',
            label: 'Table',
          },
          {
            value: 'tag',
            label: 'Tag',
          },
          {
            value: 'progress',
            label: 'Progress',
          },
          {
            value: 'tree',
            label: 'Tree',
          },
          {
            value: 'pagination',
            label: 'Pagination',
          },
          {
            value: 'badge',
            label: 'Badge',
          },
        ],
      },
      {
        value: 'notice',
        label: 'Notice',
        children: [
          {
            value: 'alert',
            label: 'Alert',
          },
          {
            value: 'loading',
            label: 'Loading',
          },
          {
            value: 'message',
            label: 'Message',
          },
          {
            value: 'message-box',
            label: 'MessageBox',
          },
          {
            value: 'notification',
            label: 'Notification',
          },
        ],
      },
      {
        value: 'navigation',
        label: 'Navigation',
        children: [
          {
            value: 'menu',
            label: 'Menu',
          },
          {
            value: 'tabs',
            label: 'Tabs',
          },
          {
            value: 'breadcrumb',
            label: 'Breadcrumb',
          },
          {
            value: 'dropdown',
            label: 'Dropdown',
          },
          {
            value: 'steps',
            label: 'Steps',
          },
        ],
      },
      {
        value: 'others',
        label: 'Others',
        children: [
          {
            value: 'dialog',
            label: 'Dialog',
          },
          {
            value: 'tooltip',
            label: 'Tooltip',
          },
          {
            value: 'popover',
            label: 'Popover',
          },
          {
            value: 'card',
            label: 'Card',
          },
          {
            value: 'carousel',
            label: 'Carousel',
          },
          {
            value: 'collapse',
            label: 'Collapse',
          },
        ],
      },
    ],
  },
  {
    value: 'resource',
    label: 'Resource',
    children: [
      {
        value: 'axure',
        label: 'Axure Components',
      },
      {
        value: 'sketch',
        label: 'Sketch Templates',
      },
      {
        value: 'docs',
        label: 'Design Documentation',
      },
    ],
  },
];
const changeCascader = (values: CascaderNodePathValue) => {
  // console.log('');
  // console.log('🏄 # -----------');
  // console.log('🏄 # ----------- changeCascader # values', values);
};
const closeCascader = () => {
  // console.log('');
  // console.log('🏄 # -----------');
  // console.log(
  //   '🏄 # ----------- closeCascader # cascaderValue',
  //   cascaderValue.value
  // );
};

// ----------------

let id = 0;

const cascaderProps: CascaderProps = {
  lazy: true,
  lazyLoad(node, resolve) {
    const { level } = node;
    setTimeout(() => {
      const nodes = Array.from({ length: level + 1 }).map(() => ({
        value: ++id,
        label: `Option - ${id}`,
        leaf: level >= 2,
      }));
      // console.log('🏄 # lazyLoad # nodes', nodes);
      // Invoke `resolve` callback to return the child nodes data and indicate the loading is finished.
      resolve(nodes);
    }, 1000);
  },
};

watch(
  () => cascaderValue.value,
  (val) => {
    console.log('🏄 # watch # cascaderValue', val);
  }
);

// const value = ref('');
// const value = ref('guide');
// const value = ref('disciplines');
const value = ref('consistency');
const handleChange = (value: string) => {
  console.log('🏄 # handleChange # value', value);
};
</script>

<template>
  <ElCard class="cc-padding">
    <div>级联组件尝试</div>
    <div class="cascader-box">
      <YeoCascader
        v-model="cascaderValue"
        :options="cascaderOptions"
        @change="changeCascader"
        @close="closeCascader"
      />
      <!-- <YeoCascader v-model="cascaderValue" :props="cascaderProps" /> -->
    </div>
    <!-- 对比 -->
    <div class="cascader-box">
      <el-cascader
        v-model="value"
        :options="cascaderOptions"
        @change="handleChange"
      />
    </div>
  </ElCard>
</template>

<style lang="scss">
.cc-padding {
  margin: 12px;
  width: 620px;
  text-align: left;
}
.cascader-box {
  margin-top: 12px;
  width: 100%;
  display: inline-flex;
}
</style>
