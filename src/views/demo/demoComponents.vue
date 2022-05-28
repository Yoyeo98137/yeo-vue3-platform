<template>
  <ElMain>
    <!-- 表单 -->
    <YeoForm :model="yeoModel" :itemsConfig="yeoItems" :inline="true" />

    <ElButton type="primary" size="large" @click="handleSubmit">提交</ElButton>
  </ElMain>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import { TypeItemConfig } from '@/components/global/types';
import YeoForm from '@/components/global/YeoForm.vue';

const yeoModel = reactive({
  userName: '',
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
];

const handleSubmit = () => {
  console.log('🏄 # handleSubmit # yeoModel', yeoModel);
};
</script>

<style>
/*  */
</style>
