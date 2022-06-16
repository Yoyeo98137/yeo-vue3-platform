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
  </ElMain>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { useRequest } from '@/hooks';

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
  // manual: true,
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
</script>

<style>
.yeo-demo {
  margin: 0 auto;
  margin-top: 10px;
  width: 750px;
  text-align: left;
}
</style>
