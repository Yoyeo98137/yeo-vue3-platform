<template>
  <ElMain>
    <div class="components-box">
      <!-- 表单 -->
      <YeoForm :model="yeoModel" :itemsConfig="yeoItems" />
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
import { TypeItemConfig } from '@/components/global/types';
import YeoForm from '@/components/global/YeoForm.vue';

const yeoModel = reactive({
  userName: '',
  userEmail: '',
  userAddress: '',
  userIsRender: 'close',
  userRender: '',
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
    span: 12,
    attrs: {
      label: '用户邮箱',
      prop: 'userEmail',
    },
    childAttrs: {},
  },
  {
    tag: 'input',
    span: 12,
    attrs: {
      label: '用户地址',
      prop: 'userAddress',
    },
    childAttrs: {},
  },
  {
    tag: 'input',
    span: 8,
    attrs: {
      label: '动态渲染开关',
      prop: 'userIsRender',
    },
    childAttrs: {},
  },
  {
    tag: 'input',
    span: 24,
    attrs: {
      label: '动态渲染',
      prop: 'userRender',
    },
    childAttrs: {},
    isRender: (model) => model.userIsRender === 'open',
  },
];

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
