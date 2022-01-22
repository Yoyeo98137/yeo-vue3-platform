<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import HelloWorld from './components/HelloWorld.vue'
import { useStore } from "@/stores"

// Note that store is an object wrapped with reactive,
// meaning there is no need to write .value
const store = useStore()

console.log('🏄 # store', store)
console.log('🏄 # store', store.name)
</script>

<template>
  <img alt="logo" src="./assets/logo.png" />
  <HelloWorld :msg="`Now is ${store.name} Platform 🤞`" />
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
