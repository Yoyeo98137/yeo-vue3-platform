<template>
  <ElMain>
    <div class="components-box">
      <!-- 表单 -->
      <YeoForm :model="yeoModel" :itemsConfig="yeoItems" labelWidth="106px" />
      <ElButton type="primary" size="large" @click="handleSubmit"
        >提交</ElButton
      >
      <!-- todo -->
      <ElButton type="primary" size="large" @click="handleReset">重置</ElButton>
    </div>
  </ElMain>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import { TypeItemConfig } from '@/components/global/formConfig/types';
import YeoForm from '@/components/global/YeoForm.vue';

const yeoModel = reactive({
  userName: '',
  userEmail: '',
  userSex: 1,
  userAddress: '',
  userSelectional: 1,
});
const yeoItems: TypeItemConfig = [
  {
    tag: 'input',
    attrs: {
      label: '用户名称',
      prop: 'userName',
    },
    childAttrs: {},
  },
  {
    tag: 'input',
    span: 18,
    attrs: {
      label: '用户邮箱',
      prop: 'userEmail',
    },
    childAttrs: {},
    getChildAttrs: (model) => (model.userSex === 1 ? {} : { disabled: true }),
  },
  {
    tag: 'radio',
    attrs: {
      label: '用户性别',
      prop: 'userSex',
    },
    options: [
      {
        label: '男',
        value: 1,
      },
      {
        label: '女',
        value: 0,
      },
    ],
  },
  {
    tag: 'input',
    span: 24,
    attrs: {
      label: '用户地址',
      prop: 'userAddress',
    },
    childAttrs: {
      type: 'textarea',
    },
    isRender: (model) => model.userSex === 1,
  },
  {
    tag: 'select',
    span: 24,
    attrs: {
      label: '用户选项',
      prop: 'userSelectional',
    },
    options: async () => await todoApi(),
  },
];

const todoApi = () => {
  console.log('await todoApi start');

  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('await todoApi over');
      const data = [
        { label: '全部', value: 0 },
        { label: '其他', value: 1 },
      ];
      // * 要记得 “结束” 这个 Promise
      resolve(data);
    }, 3200);
  });
};
const handleSubmit = () => {
  console.log('🏄 # handleSubmit # yeoModel', yeoModel);
};
const handleReset = () => {
  //
};
</script>

<style>
.components-box {
  width: 45%;
  text-align: left;
}
</style>
