<script lang="ts" setup>
//
</script>

<template>
  <ElSelect v-bind="$attrs">
    <template v-for="fSelect in ($attrs.options as any)" :key="fSelect.value">
      <ElOption :label="fSelect.label" :value="fSelect.value"></ElOption>
    </template>
  </ElSelect>
</template>

<style scoped>
/*  */
</style>
