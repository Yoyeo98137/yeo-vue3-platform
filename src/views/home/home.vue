<template>
  <img alt="logo" src="@/assets/logo.png" />

  <HelloWorld :msg="`Now is ${store.name} Platform 🤞`" />
  <ElButton type="primary" size="large" @click="jumpToAbout">Go to /About</ElButton>
</template>

<script setup lang="ts">
import HelloWorld from '@/components/HelloWorld.vue'

import { useStore } from "@/stores"
import { useRouter } from 'vue-router';

// Note that store is an object wrapped with reactive,
// meaning there is no need to write .value
const store = useStore()

console.log('🏄 # store', store)
console.log('🏄 # store', store.name)

const router = useRouter()

const jumpToAbout = () => {
  router.push({
    name: 'about',
    // query: {
    //   ...route.query,
    // },
  })
}
</script>