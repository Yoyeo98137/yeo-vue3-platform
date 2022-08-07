<script lang="ts" setup>
import { ref } from 'vue';
import YeoCascader from '@/components/global/cascader';

import type { CascaderProps } from '@/components/global/cascader';
import type { YeoCascaderInstance } from '@/components/global/cascader';

const cascaderValue = ref('');
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

// ------ 基于现有的业务

const chooseRef = ref<YeoCascaderInstance>();
const chooseValue = ref('');
const chooseOptions = ref(cascaderOptions);

let id = 0;
const chooseProps: CascaderProps = {
  checkStrictly: true,
  lazy: true,
  lazyLoad(node, resolve) {
    const { level } = node;
    setTimeout(() => {
      const nodes = Array.from({ length: level + 1 }).map(() => ({
        value: ++id,
        label: `Option - ${id}`,
        leaf: level >= 2,
      }));
      resolve(nodes);
    }, 1000);
  },
};

const changeChooseVal = (val: string) => {
  console.log('🏄 # 绑定值改变了 # changeChooseVal # val', val);
};
const handleSendSubmit = () => {
  const checkeds = chooseRef.value?.getCheckedNodes(false);
  const labels = chooseRef.value?.getCheckedLabels(false);
  const isAllNodeLoaded = chooseRef.value?.isAllNodeLoaded;

  if (!isAllNodeLoaded) return;

  console.log('🏄 # handleSendSubmit # checkeds', checkeds);
  console.log('🏄 # handleSendSubmit # labels', labels);
  console.log('🏄 # handleSendSubmit # isAllNodeLoaded', isAllNodeLoaded);
};
</script>

<template>
  <ElCard class="cc-padding">
    <div>级联组件尝试</div>
    <div class="cascader-box">
      <YeoCascader
        ref="chooseRef"
        v-model="chooseValue"
        :options="chooseOptions"
        :props="{
          checkStrictly: true,
        }"
        @change="changeChooseVal"
      />
      <!-- <YeoCascader
        ref="chooseRef"
        v-model="chooseValue"
        :props="chooseProps"
        @change="changeChooseVal"
      /> -->
    </div>
    <ElButton @click="handleSendSubmit">确认选择</ElButton>
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
