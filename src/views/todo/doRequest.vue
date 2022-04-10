<template>
  <ElMain>
    <p>This is DoRequest.</p>

    <ElCard v-loading="baseLoading" class="do-card">
      <p>{{ baseData?.message || "--" }}</p>
    </ElCard>

    <ElButton
      type="primary"
      size="large"
      :disabled="manualLoading"
      @click="handleRequest"
    >handle runRequest</ElButton>
    <ElCard v-loading="manualLoading" class="do-card">
      <p>{{ manualData?.message || "--" }}</p>
    </ElCard>

    <ElButton
      type="primary"
      size="large"
      :disabled="nmllDelayLoading"
      @click="handleDelayTestRun"
    >handle delayRequest</ElButton>
    <ElCard class="do-card">
      <p v-loading="nmllDelayLoading">NO Delay: {{ nmllDelayData || "--" }}</p>
      <p v-loading="delayLoading">OPEN Delay: {{ delayData || "--" }}</p>
    </ElCard>
  </ElMain>
</template>

<script lang="ts" setup>
import { watch } from 'vue';
import { useRequest } from '@/hooks';

// *Axios - Demo
const getDataApi = (count: number = 0, name: string) => {
  console.log('🏄 # come in # getDataApi # count: ', count)
  console.log('🏄 # getDataApi # name', name)

  return new Promise(resolve => {
    console.log('🏄 # come in # getDataApi # callback #')

    setTimeout(() => {
      const res = {
        state: true,
        message: `Hello message!${count ? " - " + count : ""}`,
      }
      resolve(res)
    }, 1600);
  })
}

// ? 这样重新定义参数字段接收的方式，能否保证调用函数时正确的 ts 类型推断 ?

// 自动请求
const { loading: baseLoading, data: baseData, run: isAutoSelfRun } = useRequest(getDataApi, {
  defaultParams: [99, "yeo"]
})
// 手动请求
let handleCount = 1
const { loading: manualLoading, data: manualData, run: runRequest } = useRequest(getDataApi, { manual: true })
const handleRequest = () => {
  // isAutoSelfRun(handleCount++, "yeo")
  runRequest(handleCount++, "yeo")
}

// watch(
//   () => data.value,
//   (val => {
//     console.log('🏄 # watch # data # val', val)
//   }),
//   {
//     immediate: true
//   }
// )

const getNowTimer = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(new Date().getTime());
    }, 500);
  });
}
const { loading: nmllDelayLoading, data: nmllDelayData, run: nmlDelayRun } = useRequest(getNowTimer, { manual: true })
// 延迟加载状态
const { loading: delayLoading, data: delayData, run: delayRun } = useRequest(getNowTimer, { manual: true, loadingDelay: 600 })
const handleDelayTestRun = () => {
  nmlDelayRun()
  delayRun()
}

</script>

<style>
.do-card {
  margin: 12px auto;
  width: 412px;
}
</style>