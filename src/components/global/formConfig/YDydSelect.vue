<script lang="ts" setup>
//
</script>

<template>
  <ElSelect v-bind="$attrs">
    <template
      v-for="(fSelect, fIndex) in ($attrs.options as any)"
      :key="fIndex"
    >
      <ElOption :label="fSelect.label" :value="fSelect.value"></ElOption>
    </template>
  </ElSelect>
</template>

<style lang="scss">
//
</style>
