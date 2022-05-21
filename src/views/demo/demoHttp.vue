<template>
  <ElMain>
    <p>测试 axios</p>
  </ElMain>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue';
import { getHttpDemoGetApi, getHttpDemoPostApi } from "@/api/httpDemo"

let loopCount = 0
let loopTimer: any = null

onMounted(() => {
  getHttpDemoGetApi(666)
    .then(res => {
      console.log('🏄 # getHttpDemoGetApi # res', res)
    }).catch((err) => {
      console.log('🏄 # getHttpDemoGetApi # err', err)
    })

  loopTimer = setInterval(() => {
    // if (loopCount === 5) {
    if (loopCount === 2) {
      clearInterval(loopTimer)
      return
    }

    loopCount++
    getHttpDemoPostApi()
      .then(res => {
        console.log('🏄 # getHttpDemoPostApi # res', res)
      }).catch((err) => {
        console.log('🏄 # getHttpDemoPostApi # err', err)
      })

  }, 1024)
})

onUnmounted(() => {
  loopTimer && clearInterval(loopTimer)
})
</script>

<style>
</style>