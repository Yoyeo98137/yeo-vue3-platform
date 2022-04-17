<template>
  <ElMain>
    <p>测试请求 hooks - ready.</p>

    <ElButton type="primary" size="large" :disabled="readyLoading" @click="handleReadyEv">handle readyRequest
    </ElButton>
    <ElButton type="primary" size="large" :disabled="readyLoading" @click="handleManualReadyEv">handle readyRequest
      manual
    </ElButton>
    <ElCard v-loading="readyLoading" class="do-card">
      <p>Ready Data: {{ readyData || "--" }}</p>
      <p>Now is Ready? {{ isReadyNow }}</p>
    </ElCard>
  </ElMain>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRequest } from '@/hooks';

const isReadyNow = ref(false)
const getNowTimer = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(new Date().getTime());
    }, 500);
  });
}
const { loading: readyLoading, data: readyData, run: readyRun } = useRequest(getNowTimer, {
  manual: true,
  ready: isReadyNow
})
const handleReadyEv = () => {
  isReadyNow.value = !isReadyNow.value
}
const handleManualReadyEv = () => {
  readyRun()
}

</script>

<style>
.do-card {
  margin: 12px auto;
  width: 412px;
}
</style>