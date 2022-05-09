<template>
  <ElMain>
    <p>分页 Hooks - usePagination</p>

    <ElInput v-model="testReactiveMore.inputVal" style="width: 626px;" />
    <ElPagination v-model:currentPage="pagination.page" v-model:pageSize="pagination.pageSize"
      :pageSizes="[10, 20, 30, 40]" :disabled="paginationLoading" layout="total, sizes, prev, pager, next"
      :total="testTotal" @sizeChange="handleChangePagination" @currentChange="handleChangePagination" />
    <ElButton type="primary" size="large" :loading="paginationLoading" @click="handleSearch">查询</ElButton>
    <ElButton type="primary" size="large" :loading="paginationLoading" @click="handleRefresh">重置</ElButton>
  </ElMain>
</template>

<script lang="ts" setup>
import { reactive, ref, toRefs } from 'vue';
import { usePagination } from '@/hooks';

const testReactiveMore = reactive({
  inputVal: "",
  val1: "",
  val2: "",
  val3: ""
})
const testReactive = ref("")
const testTotal = ref(50)

const getCurTimer = (params: any) => {
  console.log('🏄 # 输出参数 # params', params)

  return new Promise(resolve => {
    setTimeout(() => {
      resolve(new Date().getTime());
    }, 500);
  });
}
const { loading: paginationLoading, pagination, refresh } = usePagination(getCurTimer, {
  defaultParams: [{
    // 展开响应式
    ...toRefs(testReactiveMore)
    // inputValue: testReactive
  }]
})
const handleChangePagination = (model: any) => {
  console.log('🏄 # handleChangePagination # model', model)
  console.log('🏄 # handleChangePagination # pagination', pagination)

  handleSearch()
}
const handleSearch = () => {
  pagination.updatePagination({
    page: pagination.page,
    pageSize: pagination.pageSize,
    total: testTotal.value
  })
}
const handleRefresh = () => {
  testReactiveMore.inputVal = ""
  // testReactive.value = ""
  refresh()
}

</script>

<style>
/*  */
</style>
