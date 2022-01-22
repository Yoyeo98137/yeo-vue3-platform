<script setup lang="ts">

defineProps<{ msg: string }>()
</script>

<template>
  <h1>{{ msg }}</h1>
  <el-button type="primary" size="large">Year !</el-button>
</template>

<style scoped>
</style>
