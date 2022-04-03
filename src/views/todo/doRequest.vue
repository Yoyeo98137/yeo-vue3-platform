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
  </ElMain>
</template>

<script lang="ts" setup>
import { watch } from 'vue';
import { useRequest } from '@/hooks';

// *Axios - Demo
const getDataApi = (count: number = 0, name?: string) => {
  console.log('🏄 # come in # getDataApi # count: ', count)
  console.log('🏄 # getDataApi # name', name)

  return new Promise((resolve) => {
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

// 自动请求
const { loading: baseLoading, data: baseData } = useRequest(getDataApi, {
  defaultParams: [99, "yeo"]
})
// 手动请求
let handleCount = 1
const { loading: manualLoading, data: manualData, run: runRequest } = useRequest(getDataApi, { manual: true })
const handleRequest = () => {
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

</script>

<style>
.do-card {
  margin: 12px auto;
  width: 412px;
}
</style>