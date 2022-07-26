<template>
  <ElMain>
    <!-- 表单 - 表格查询场景 -->
    <YeoForm
      ref="refDemoForm"
      :model="yeoModel"
      :itemsConfig="yeoConfig"
      inline
      search
      reset
      @onSearch="fmSearch"
      @onReset="fmReset"
    />

    <!-- 表单 - 提交弹窗场景 -->
    <ElButton
      style="display: block; margin-right: auto"
      type="primary"
      size="large"
      @click="openDialog"
      >打开弹窗</ElButton
    >
    <ElDialog v-model="dialogVisible" title="表单测试" width="56%">
      <YeoForm
        ref="refDemoPopupForm"
        :model="yeoPopupModel"
        :itemsConfig="yeoPopupConfig"
        :rules="yeoPopupRules"
        labelWidth="136px"
      >
        <template #slotTest="{ model }">
          <span>这条是插槽内容：</span>
          <span style="word-break: break-all">{{ JSON.stringify(model) }}</span>
        </template>
      </YeoForm>
      <template #footer>
        <ElButton type="primary" @click="popupSubmit">提交</ElButton>
        <ElButton @click="popupClose">关闭</ElButton>
      </template>
    </ElDialog>
  </ElMain>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
// 又遇到了 eml 样式丢失的问题...
// import { ElMessage } from 'element-plus';
// import { ElNotification } from 'element-plus';
import YeoForm from '@/components/global/YeoForm.vue';
import { emptyString } from '@/utils/ifType';

type TypeYeoFormRef = InstanceType<typeof YeoForm>;

// 表单 - 表格查询场景
const refDemoForm = ref<TypeYeoFormRef>();
const yeoModel = reactive({
  userName: '',
  userSelect: 1,
  userSelect2: 0,
  userRadio: 1,
  fansNumber: '',
  timerTest: [],

  // 复合型输入框
  bindInputKey: 'actName',
  actName: '',
  actSn: '',

  // 复合型时间选择器
  bindDataKey: 'createTimer',
  createTimer: '',
  actTimer: '',
});
const yeoConfig: TypeItemConfig = [
  {
    tag: 'input',
    attrs: {
      label: '用户姓名',
      prop: 'userName',
    },
  },
  {
    tag: 'dataPicker',
    attrs: {
      label: '时间测试',
      prop: 'timerTest',
    },
  },
  {
    tag: 'select',
    attrs: {
      label: '用户选择',
      prop: 'userSelect',
    },
    childAttrs: {
      placeholder: '请选择请选择请选择',
    },
    options: () => todoApi(),
  },
  {
    tag: 'select',
    attrs: {
      label: '用户选择2',
      prop: 'userSelect2',
    },
    options: () => [
      { label: '测试值1', value: 0 },
      { label: '测试值2', value: 1 },
    ],
  },
  {
    tag: 'numberInput',
    attrs: {
      label: '加粉数量',
      prop: 'fansNumber',
    },
    childAttrs: {
      style: {
        width: '182px',
      },
      placeholder: '请输入加粉数量',
    },
  },
  {
    tag: 'complexInput',
    attrs: {
      prop: 'bindInputKey',
    },
    options: [
      { label: '活动名称', value: 'actName' },
      { label: '活动ID', value: 'actSn' },
    ],
  },
  {
    tag: 'complexData',
    attrs: {
      prop: 'bindDataKey',
    },
    options: [
      { label: '创建时间', value: 'createTimer' },
      { label: '活动时间', value: 'actTimer' },
    ],
    isRender: (model) => model.userRadio === 2,
  },
  {
    tag: 'radio',
    attrs: {
      label: '用户单选',
      prop: 'userRadio',
    },
    options: [
      {
        label: '男',
        value: 1,
      },
      {
        label: '女',
        value: 2,
      },
    ],
  },
];
const todoApi = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const data = [
        { label: '全部', value: 0 },
        { label: '其他', value: 1 },
      ];
      // * 要记得 “结束” 这个 Promise
      resolve(data);
    }, 2066);
  });
};
const fmSearch = () => {
  console.log('🏄 #### fmSearch #### yeoModel', yeoModel);
};
const fmReset = () => {
  console.log('🏄 #### fmReset #### yeoModel', yeoModel);
};

// 表单 - 提交弹窗场景
const dialogVisible = ref(false);
const refDemoPopupForm = ref<TypeYeoFormRef>();
const yeoPopupModel = reactive({
  popupName: '',
  popupRuleCfg: '',
  popupSelect: '',
  popupRadio: 2,

  popupSlot: '',
  // popupSlot: 'empty',
});
const validateTest = (rule: any, value: any, callback: any) => {
  if (emptyString(value)) {
    callback(new Error('不允许输入空字符串!'));
  } else {
    callback();
  }
};
const yeoPopupConfig: TypeItemConfig = [
  {
    tag: 'input',
    attrs: {
      label: '名称测试：',
      prop: 'popupName',
    },
    span: 20,
  },
  {
    tag: 'input',
    attrs: {
      label: '自定义规则测试：',
      prop: 'popupRuleCfg',
      rules: {
        trigger: 'change',
        required: true,
        validator: validateTest,
      },
    },
    span: 20,
  },
  {
    tag: 'select',
    attrs: {
      label: '选择测试：',
      prop: 'popupSelect',
    },
    span: 20,
    options: () => todoPopupApi(),
  },
  {
    tag: 'radio',
    attrs: {
      label: '单选测试：',
      prop: 'popupRadio',
    },
    options: () => [
      { label: '男', value: 1 },
      { label: '女', value: 2 },
    ],
  },
  {
    // 插槽也允许配合规则检查
    // attrs: {
    //   prop: 'popupSlot',
    // },
    isRender: (model) => model.popupRadio === 1,
    slotKey: 'slotTest',
    // original: true
  },
];

const yeoPopupRules = {
  popupName: {
    trigger: 'change',
    required: true,
    message: '请输入名称!',
  },
  popupSelect: {
    trigger: 'change',
    required: true,
    message: '请选择!',
  },
  popupRadio: {
    trigger: 'change',
    required: true,
    message: '请选择!',
  },
  // popupSlot: {
  //   trigger: 'change',
  //   required: true,
  //   message: '检查插槽!',
  // },
};
const todoPopupApi = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const data = [
        { label: '选项一', value: 0 },
        { label: '选项二', value: 1 },
      ];
      // * 要记得 “结束” 这个 Promise
      resolve(data);
    }, 1226);
  });
};
const openDialog = () => {
  // 测试默认回显，resetFormModel 更新正常
  // yeoPopupModel.popupName = '测试测试测试';
  // yeoPopupModel.popupRuleCfg = '测试测';

  dialogVisible.value = true;
};
const popupSubmit = () => {
  refDemoPopupForm.value?.refYeoForm?.validate?.((boolean) => {
    console.log('🏄 # popupSubmit # boolean', boolean);
    console.log('🏄 # popupSubmit # yeoPopupModel', yeoPopupModel);
    if (boolean) {
      alert('更新成功');
      dialogVisible.value = false;
    }
  });
};
const popupClose = () => {
  refDemoPopupForm.value?.resetFormModel();
  dialogVisible.value = false;
};
</script>

<style>
/*  */
</style>
