> 表单组件文档  
> 右键 .md 文件可选择预览，或者 ctrl+shift+v 打开预览

## 使用示例

### 配合表格查询

视图层

```html
<YeoForm
  ref="refFormPlus"
  :model="yeoModel"
  :itemsConfig="yeoConfig"
  inline
  search
  reset
  @onSearch="fmSearch"
  @onReset="fmReset"
/>
```

逻辑层

```ts
// 导入配置项的输入提示
import { TypeItemConfig } from '@/components/global/formConfig/utils/types';
// 获取组件实例，可以拿到组件内部方法的输入提示
type TypeYeoFormRef = InstanceType<typeof YeoForm>;

// 表单 - 表格查询场景
const refFormPlus = ref<TypeYeoFormRef>();
const yeoModel = reactive({
  userName: '',
  userSelect: 1,
  userSelect2: 0,
  userRadio: 1,
  fansNumber: '',
  timerTest: [],
  // 复合型输入框
  bindInputKey: 'actName', // 指定默认的 select 选项
  actName: '',
  actSn: '',
  // 复合型时间选择器
  bindDataKey: 'createTimer', // 指定默认的 select 选项
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
      placeholder: '请选择用户',
    },
    // 1 提供返回 Promise 的异步函数
    // 组件内置了 loading 绑定
    options: () => todoApi(),
  },
  {
    tag: 'select',
    attrs: {
      label: '用户选择2',
      prop: 'userSelect2',
    },
    // 2 提供直接返回数组的普通函数
    options: () => [
      { label: '测试值1', value: 0 },
      { label: '测试值2', value: 1 },
    ],
    // 3 直接提供数组
    // options: [{ /** */ }]
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
    // 复合型组件：options 定义的 value 对应当前选项下绑定 model 变量
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
    // 复合型组件：options 定义的 value 对应当前选项下绑定 model 变量
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
      // 要记得 “结束” 这个 Promise
      resolve(data);
    }, 2066);
  });
};
const fmSearch = () => {
  // 查询表格操作
  // getTableApi()...
};
const fmReset = () => {
  // 重置表格操作
  // onReset 回调之前，组件内部已经处理了对表单的重置操作
  // getTableApi()...
};
```

### 配合提交弹窗

视图层

```html
<ElButton
  style="display: block; margin-right: auto"
  type="primary"
  size="large"
  @click="openDialog"
  >打开弹窗</ElButton
>
<ElDialog v-model="dialogVisible" title="表单测试" width="56%">
  <YeoForm
    ref="refPopupFormPlus"
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
```

逻辑层

```ts
// 导入配置项的输入提示
import { TypeItemConfig } from '@/components/global/formConfig/utils/types';
// 获取组件实例，可以拿到组件内部方法的输入提示
type TypeYeoFormRef = InstanceType<typeof YeoForm>;

const dialogVisible = ref(false);
const refPopupFormPlus = ref<TypeYeoFormRef>();
const yeoPopupModel = reactive({
  popupName: '',
  popupRuleCfg: '',
  popupSelect: '',
  popupRadio: 2,
  popupSlot: '',
  // popupSlot: 'empty',
});
const validateTest = (rule: any, value: any, callback: any) => {
  if (!value) {
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
    childAttrs: {
      placeholder: '请输入',
    },
    span: 20,
  },
  {
    tag: 'input',
    attrs: {
      label: '自定义规则测试：',
      prop: 'popupRuleCfg',
      // 可以在 attrs 定义 rules 来覆盖全局的校检规则定义
      rules: {
        trigger: 'change',
        required: true,
        validator: validateTest,
      },
    },
    childAttrs: {
      placeholder: '请输入',
    },
    span: 20,
  },
  {
    tag: 'select',
    attrs: {
      label: '选择测试：',
      prop: 'popupSelect',
    },
    childAttrs: {
      placeholder: '请选择',
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
    // 插槽也允许配合规则检查，定义 prop 即可
    // attrs: {
    //   prop: 'popupSlot',
    // },
    isRender: (model) => model.popupRadio === 1,
    slotKey: 'slotTest',
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
      // 要记得 “结束” 这个 Promise
      resolve(data);
    }, 1226);
  });
};
const openDialog = () => {
  // 如果要做表单回显 ↓
  // 测试默认回显，resetFormModel 更新正常
  // yeoPopupModel.popupName = '测试测试测试';
  // yeoPopupModel.popupRuleCfg = '测试测';

  dialogVisible.value = true;
};
const popupSubmit = () => {
  refPopupFormPlus.value?.refYDydFormPlus?.validate?.((boolean) => {
    if (boolean) {
      alert('更新成功');
      dialogVisible.value = false;
    }
  });
};
const popupClose = () => {
  refPopupFormPlus.value?.resetFormModel();
  dialogVisible.value = false;
};
```

## 参数、事件及导出

### 参数

- 直接继承了所有的 **el-form** 内置属性及事件
- itemsConfig：配置项内容（数组内嵌对象），用于生成指定的 **el-form-item**
- model：绑定的响应式对象
- rules?：全局规则
- autoFillPlaceholder?: 是否根据 label 自动填充 placeholder，默认 true
- gutter?：同步内置的 **el-row** 布局属性
- search?：布尔值，渲染查询按钮
- searchContext?：查询按钮文案
- reset?：布尔值，渲染重置按钮
- resetContext?：重置按钮文案

### 事件

- onSearch：配合属性 **search** 渲染的按钮点击回调
- onReset：配合属性 **reset** 渲染的按钮点击回调，触发回调前内置了表单重置逻辑

### 导出

- refYDydFormPlus：提供表单组件的 ref 调用
- resetFormModel：提供手动重置表单的方法

## 其余补充

### 类型提示

```ts
// 导入配置项 itemsConfig 的输入提示
import { TypeItemConfig } from '@/components/global/formConfig/utils/types';
// 获取组件实例，可以拿到组件内部方法的输入提示
type TypeYeoFormRef = InstanceType<typeof YeoForm>;
```

### 配置项 itemsConfig

```ts
/** 指定要生成的表单控件，对应配置表的枚举 */
tag?: KeyChildConfig

/** 通过 v-bind 继承给 el-form-item 的属性以及事件 */
attrs?: {
  prop: string
  label?: string
  required?: boolean
  [propName: string]: any
}
/** 通过 v-bind 继承给 具体表单控件（比如 el-input） 的属性以及事件 */
childAttrs?: {
  placeholder?: string
  [propName: string]: any
}

/** 具名插槽定义 */
slotKey?: string
/** 控制 Layout 布局：Col - span */
span?: number

/**
 * 为了兼容之前包裹了 el-form-item 的业务组件能正常使用
 * 通过开启这个字段来跳过内置的 el-form-item 包裹逻辑
 * 仅应该配合 slotKey 的场景来使用
 */
original?: boolean

/**
 * 动态读取列表数据项，并内置了 loading 绑定
 * 支持 普通数组、返回数组的普通函数、返回 Promise 的异步函数
 * [] | () => [] | () => Promise
 */
options?: Array<propOptions> | (() => void) | (() => Promise<any>)

/** 动态控制 组件节点的渲染 */
isRender?: (model: any) => boolean

/** 动态控制 组件属性 childAttrs 的绑定 */
getChildAttrs?: (model: any) => any
```

### 插槽变量

```html
<template #slotUsers="{ model }"> {{ model }} </template>
```

### 分栏布局

```ts
// 通过指定 span 值即可
const demoConfig: TypeItemConfig = [
  // 两栏
  {
    // ...
    span: 12,
  },
  {
    // ...
    span: 12,
  },

  // or 三栏，以此类推
  // {
  //   span: 8,
  // },
  // {
  //   span: 8,
  // },
  // {
  //   span: 8,
  // },
];
```
