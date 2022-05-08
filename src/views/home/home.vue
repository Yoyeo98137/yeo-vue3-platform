<template>
  <img alt="logo" src="@/assets/logo.png" />

  <HelloWorld :msg="`Now is ${store.name} Platform 🤞`" />
  <ElButton type="primary" size="large" @click="jumpToAbout">Go to /About</ElButton>
  <ElButton type="primary" size="large" @click="jumpToTestSWR">Go to /TestSWR</ElButton>
  <ElButton type="primary" size="large" @click="jumpToMoreRequest">Go to /MoreRequest</ElButton>
  <ElButton type="primary" size="large" @click="jumpToPaginationRequest">Go to /PaginationRequest</ElButton>

  <div style="margin-top: 16px;">
    <p>{{ "modelCascader - " + modelCascader }}</p>
    <div class="cascader-container">
      <ElCascader
        v-if="renderCascader"
        v-model="modelCascader"
        :options="optionsCascader"
        :props="props"
        :showAllLevels="false"
        clearable
        collapseTags
        @change="onChangeCascaderr"
      />
      <!-- loading 占位 -->
      <div
        v-else
        v-loading="true"
        element-loading-text="Loading..."
        element-loading-svg-view-box="-10, -10, 120, 120"
        class="cascader-seat"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import HelloWorld from '@/components/HelloWorld.vue'

import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from "@/stores"

interface ModelTarget {
  label: string
  value: string
  children?: Array<any>
}
type TypeModelArr = Array<ModelTarget>
type TypeModelPromise = (val: string) => Promise<Array<any>>

// Note that store is an object wrapped with reactive,
// meaning there is no need to write .value
const store = useStore()

console.log('🏄 # store', store)
console.log('🏄 # store', store.name)

// *Test Router
const router = useRouter()
const jumpToAbout = () => {
  router.push({
    name: 'about',
    // query: {
    //   ...route.query,
    // },
  })
}
const jumpToTestSWR = () => {
  router.push({
    name: 'demo',
  })
}
const jumpToMoreRequest = () => {
  router.push({
    name: 'moreRequest',
  })
}
const jumpToPaginationRequest = () => {
  router.push({
    name: 'paginationRequest',
  })
}

/**
 * - [x] 单选
 * - [x] 正常回显
 * - [x] 正常回显 + 懒加载
 * - [x] 动态回显：需要回显的选项中，存在有需要 lazyLoad 之后才有数据的选项
 * - [x] 多选...
 */

// *Test Cascader
const modelToCity: any = {

  "0100": [
    {
      value: "0110",
      label: '广州市',
      isLeaf: false
    },
    {
      value: "0120",
      label: '深圳市',
      isLeaf: false,
    },
    {
      value: "0130",
      label: '惠州市',
      isLeaf: true
    },
  ],

  "0110": [
    {
      value: "0111",
      label: '天河区',
      isLeaf: true
    },
  ],
  "0120": [
    {
      value: "0121",
      label: '南山区',
      isLeaf: true
    },
    {
      value: "0122",
      label: '宝安区',
      isLeaf: true
    },
  ],

  "0200": [
    {
      value: "0110",
      label: '长沙市',
      isLeaf: true
    },
  ]
}
const props = {
  lazy: true,
  multiple: true,
  lazyLoad: async (node: any, resolve: any) => {
    const { value } = node
    const nodes = await getModelApi(value)

    // Invoke `resolve` callback to return the child nodes data and indicate the loading is finished.
    console.log('🏄 # setTimeout # nodes', nodes)
    resolve(nodes)
  },
}

const renderCascader = ref(false)
const modelCascader: any = ref([])
const optionsCascader: any = ref([])
const onChangeCascaderr = (val: any) => {
  console.log('🏄 # onChangeCascaderr # val', val)
}
/** 模拟接口 */
const getModelApi: TypeModelPromise = async (val) => {
  return await new Promise((resolve) => {
    setTimeout(() => {
      const model = modelToCity[val].map((ele: any) => {
        return {
          ...ele,
          leaf: ele.isLeaf
        }
      })
      resolve(model)
    }, 626);
  })
}
onMounted(async () => {

  // *动态回显：需要回显的选项中，存在有需要 lazyLoad 之后才有数据的选项

  // 保留赋值 “源数组” 的引用
  let updateModel: TypeModelArr = []
  const updateTarget = ["0100", "0120", "0121"]

  // 1 初始化第一层数据
  const fstModel: TypeModelArr = [
    {
      value: "0100",
      label: '广东省',
    },
    {
      value: "0200",
      label: '湖南省',
    },
  ]
  updateModel = fstModel

  // 2 通过需要回显的字段，先单独读取对应的列表
  // 循环到 前一级，因为最后一级代表的是 叶子节点
  let i = 0, curModel = updateModel
  while (i < updateTarget.length - 1) {
    const curTarget = updateTarget[i]
    // 拿到 model 中要插入数据的下标
    const findInsertIdx = curModel.findIndex(ele => ele.value === curTarget)

    // 通过目标 “id” 读取对应接口
    const resTarget = await getModelApi(curTarget)
    // 插入数据
    curModel[findInsertIdx].children = resTarget

    // 向后更新对应下标的 target
    curModel = fstModel[findInsertIdx].children as TypeModelArr
    i++
  }

  // 3 然后再插入到初始数据源 options 中（前面两部也可以先用新建对象装着，最后统一赋值）
  optionsCascader.value = updateModel
  modelCascader.value = ["0100", "0120", "0121"]

  // 4 最后打开级联组件渲染限制
  renderCascader.value = true
})
</script>

<style>
.cascader-container {
  margin: 0 auto;
  width: 362px;
  height: 32px;
}
.el-cascader,
.cascader-seat {
  width: 100%;
  height: 100%;
}
.cascader-seat {
  box-sizing: border-box;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background-color: #ffffff;
}
.el-loading-spinner {
  display: flex;
  align-items: center;
}
.el-loading-spinner .path {
  stroke: #909399;
}
.el-loading-text {
  color: #909399 !important;
}
</style>