<template>
  <ElMain v-loading="loading">
    <div>This is Demo</div>
    <div>
      data -
      <span style="color: red;">{{ data }}</span>
    </div>

    <div class="doc-box">
      <p>TodoList -</p>
      <p>- 模拟请求（promise）状态控制</p>
      <p>- data loading error 抛出</p>
      <p>- ... ...</p>
    </div>

    <div class="doc-box">
      <p>Doc -</p>
      <p>- @see: https://zhuanlan.zhihu.com/p/93824106?from_voters_page=true</p>
      <p>- @see: https://zhuanlan.zhihu.com/p/89570321</p>
      <p>- @see: https://github.com/vercel/swr</p>
    </div>
  </ElMain>
</template>

<script lang="ts" setup>
/*

  api: https://xxx

  // old
  const apiXXXName = () => {
    return new Promise(() => ...)
  }

  // new
  const { data, loading, error } = useSWR("api/xxx")

  get Params: 
  - apiName / apiLink / ...
  - request config {}
  - ...

  return refs: 
  - data
  - loading
  - error

  TodoList: 
  - [x] 简易 demo、数据通信
  - [ ] 配合 axios
  - [ ] 节流、防抖开关
*/

import { useSWR } from "../../hooks"

// get Fetch data/loading
const { data, loading } = useSWR()

</script>

<style>
.doc-box {
  margin: 0 auto;
  margin-top: 10px;
  width: 702px;
  text-align: left;
}
</style>