<template>
  <ElMain>
    <div class="components-box">
      <!-- 表单 -->
      <YeoForm
        ref="refDemoForm"
        :model="yeoModel"
        :itemsConfig="yeoItems"
        labelWidth="106px"
      >
        <template #slotTest="{ model }">
          <span>This is Slot.</span>
          <span>{{ JSON.stringify(model) }}</span>
        </template>
      </YeoForm>
      <ElButton type="primary" size="large" @click="handleSubmit"
        >提交</ElButton
      >
      <!-- todo -->
      <ElButton type="primary" size="large" @click="handleReset">重置</ElButton>
    </div>
  </ElMain>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { TypeItemConfig } from '@/components/global/formConfig/types';
import { emptyString } from '@/utils/ifType';
import YeoForm from '@/components/global/YeoForm.vue';

type TypeYeoFormRef = InstanceType<typeof YeoForm>;

const refDemoForm = ref<TypeYeoFormRef>();
const yeoModel = reactive({
  userName: '',
  userEmail: '',
  userSex: 1,
  userAddress: '',
  userSelectional: 1,
  // todo 有个问题，如果是 0 的话好像回显不对
  userSelectional2: 6,
  userSlot: '',
});

const validateTest = (rule: any, value: any, callback: any) => {
  if (emptyString(value)) {
    callback(new Error('请输入用户邮箱!'));
  } else {
    callback();
  }
};
const yeoItems: TypeItemConfig = [
  {
    tag: 'input',
    attrs: {
      label: '用户名称',
      prop: 'userName',
      rules: {
        trigger: 'change',
        required: true,
        message: '请输入用户名称!',
      },
    },
    childAttrs: {},
  },
  {
    tag: 'input',
    span: 18,
    attrs: {
      label: '用户邮箱',
      prop: 'userEmail',
      rules: {
        trigger: 'change',
        required: true,
        validator: validateTest,
      },
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
    // options: async () => todoApi(),
    // options: () => todoApi(),
  },
  {
    tag: 'select',
    span: 24,
    attrs: {
      label: '用户选项2',
      prop: 'userSelectional2',
    },
    options: async () => await todoApi2(),
    // options: async () => todoApi(),
    // options: () => todoApi(),
  },
  {
    tag: 'input',
    span: 24,
    slotKey: 'slotTest',
    attrs: {
      label: '测试插槽',
      prop: 'userSlot',
    },
  },
];

const todoApi = () => {
  console.log('await GG todoApi start');

  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('await GG todoApi over');
      const data = [
        { label: '全部', value: 0 },
        { label: '其他', value: 1 },
      ];
      // * 要记得 “结束” 这个 Promise
      resolve(data);
    }, 2066);
  });
};
const todoApi2 = () => {
  console.log('await GG todoApi2 start');

  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('await GG todoApi2 over');
      const data = [{ label: '全部', value: 6 }];
      // * 要记得 “结束” 这个 Promise
      resolve(data);
    }, 626);
  });
};
const handleSubmit = () => {
  refDemoForm.value?.refYeoForm?.validate?.((boolean) => {
    console.log('🏄 # handleSubmit # yeoModel', yeoModel);
    console.log('🏄 # handleSubmit # boolean', boolean);
  });
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
