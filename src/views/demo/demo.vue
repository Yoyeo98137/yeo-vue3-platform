<template>
  <ElMain class="yeo-demo">
    <ElCard v-loading="loading" :style="{ margin: '10px' }">
      <div>data ---: {{ data || '.................' }}</div>
      <div>loading ---: {{ loading }}</div>
      <ElButton style="margin-top: 10px" type="primary" @click="handleRun"
        >手动发起请求</ElButton
      >
    </ElCard>

    <ElCard :style="{ margin: '10px' }">
      <ul>
        <li v-for="user in userList" :key="user.id" style="width: 50%">
          <div style="display: flex; justify-content: space-between">
            <span>{{ user.name }}</span>
            <ElButton
              :loading="sQueries[user.id] && sQueries[user.id].loading"
              @click="handleSRun(user.id)"
            >
              Update
            </ElButton>
          </div>
        </li>
      </ul>
    </ElCard>

    <ElCard :style="{ margin: '10px' }">
      <div>vData ---: {{ vData || '.............' }}</div>
      <ElInput v-model="vReactive.val" />
      <!-- <ElInput v-model="vRef" /> -->
      <ElButton :loading="vLoading" @click="vRefresh">Refresh</ElButton>
    </ElCard>

    <ElCard :style="{ margin: '10px' }">
      <div>loadingPagination: {{ loadingPagination }}</div>
      <div>dataPagination: {{ dataPagination || '.............' }}</div>
      <ElInput v-model="testRefVal2.val2" />
      <ElPagination
        v-model:currentPage="currentPage"
        v-model:page-size="pageSize"
        :pageSizes="[10, 20, 30, 40]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="40"
        @sizeChange="handleSizeChange"
        @currentChange="handleCurrentChange"
      />
    </ElCard>
  </ElMain>
</template>

<script lang="ts" setup>
import { ref, computed, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { useRequest, usePagination } from '@/hooks';

// const getNowTimer = () => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve(new Date().getTime());
//     }, 500);
//   });
// };

const todoHandle = (title: string, subTitle: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        title,
        subTitle,
      });
    }, 1026);
    // }, 322)
  });
};
const isReady = ref(false);
const handleRun = () => {
  // isReady.value = true;
  // refresh()
  run('runTitle', 'runSubTitle');
};
const configRefresh = ref();
const { data, loading, run, refresh } = useRequest(todoHandle, {
  defaultParams: ['handleTitle', 'handleSubTitle'],
  // ready: isReady,
  manual: true,
  // refreshDeps: [configRefresh],
  // loadingDelay: 500,
});

// ---------------

const userList = [
  { id: 1, name: 'HuaQiang' },
  { id: 2, name: 'ZhangSan' },
  { id: 3, name: 'MaDongMei' },
];
const handleSRun = (id: number) => {
  configRefresh.value = id;
  sRun(id);
};
const showMessage = (msg: string) => {
  ElMessage({
    message: msg,
    type: 'success',
  });
};
const userStatus = (userId: number) => {
  return new Promise<string>((resolve) => {
    setTimeout(() => {
      const name = userList.find((i) => i.id === userId)?.name;
      resolve(`${name} status update successfully`);
    }, 1000);
  });
};
const { run: sRun, queries: sQueries } = useRequest(userStatus, {
  manual: true,
  queryKey: (id) => String(id),
  onSuccess: (data) => {
    showMessage(data);
  },
});

// ---------------

// // const vRequest = (str1: any, str2: any) => {
const vRequest = (v1: any, v2: any) => {
  console.log('🏄 #### vRequest #### v1', v1);
  console.log('🏄 #### vRequest #### v2', v2);

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 1026);
  });
};
const vRef = ref('xxxxx');
const vReactive = reactive({
  val: '',
  val2: 'test reactive ---- val2',
  // ...
});
const {
  data: vData,
  loading: vLoading,
  refresh: vRefresh,
} = useRequest(vRequest, {
  manual: true,
  // √
  // defaultParams: ["1", "2"],
  // √
  // defaultParams: [vRef, 'is normal'],
  // √
  defaultParams: [vReactive, vRef],
});

// ---------------

const currentPage = ref(1);
const pageSize = ref(10);
const handleSizeChange = (val: number) => {
  pagination.updatePagination({
    page: currentPage.value,
    pageSize: pageSize.value,
  });
  console.log('🏄 #### handleSizeChange #### val', val);
};
const handleCurrentChange = (val: number) => {
  pagination.updatePagination({
    page: currentPage.value,
    pageSize: pageSize.value,
  });
  console.log('🏄 #### handleCurrentChange #### val', val);
};

const todoPagination = (p2: any) => {
  // console.log('🏄 # todoPagination # p1', p1);
  console.log('🏄 # todoPagination # p2', p2);
  console.log('🏄 # todoPagination # pagination', pagination);

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(p2);
    }, 1026);
  });
};
const testRefVal2 = reactive({
  val2: '',
  msg2: 'this is test msg......',
});
const {
  data: dataPagination,
  loading: loadingPagination,
  pagination,
} = usePagination(todoPagination, {
  manual: true,
  defaultParams: [testRefVal2],
});
</script>

<style>
.yeo-demo {
  margin: 0 auto;
  margin-top: 10px;
  width: 750px;
  text-align: left;
}
</style>
