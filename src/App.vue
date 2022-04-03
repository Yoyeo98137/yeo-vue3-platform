<template>
  <!-- 路由匹配到的组件将渲染在这里 -->
  <router-view />
</template>

<script setup lang="ts">
// 
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

/* element 的样式有覆盖问题 */
.el-loading-spinner {
  display: block;
}
.el-loading-spinner .path {
  stroke: #409eff;
}
</style>
