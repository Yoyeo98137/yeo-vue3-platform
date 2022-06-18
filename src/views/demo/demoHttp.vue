<template>
  <ElMain>
    <p>测试 axios</p>
  </ElMain>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue';
import { getHttpDemoGetApi, getHttpDemoPostApi } from '@/api/httpDemo';

// // Demo NPM
// // 识别不到 新增的模块...（代码倒是可以执行）
// import { add, echo } from '@yeo/lodash';

let loopCount = 0;
let loopTimer: any = null;

onMounted(() => {
  // // WTF? 我都还没有定义声明文件怎么就有 ts 提示了？
  // const res = add(2, 23);
  // console.log('🏄 # onMounted # NPM # res', res);

  // echo("This is Echo...")

  // getHttpDemoGetApi(666)
  //   .then(res => {
  //     console.log('🏄 # getHttpDemoGetApi # res', res)
  //   }).catch((err) => {
  //     console.log('🏄 # getHttpDemoGetApi # err', err)
  //   })

  // loopTimer = setInterval(() => {
  //   // if (loopCount === 5) {
  //   if (loopCount === 2) {
  //     clearInterval(loopTimer)
  //     return
  //   }

  //   loopCount++
  //   getHttpDemoPostApi()
  //     .then(res => {
  //       console.log('🏄 # getHttpDemoPostApi # res', res)
  //     }).catch((err) => {
  //       console.log('🏄 # getHttpDemoPostApi # err', err)
  //     })

  // }, 1024)
});

onUnmounted(() => {
  // loopTimer && clearInterval(loopTimer)
});
</script>

<style></style>
