<script setup lang="ts">
defineProps<{
  numerator: string
  denominator: string
}>()
</script>

<template>
  <span class="inline-flex flex-col items-center align-middle">
    <span class="px-1 pb-1">{{ numerator }}</span>
    <span class="w-full rounded-full border-t-2 border-chalk/85" />
    <span class="px-1 pt-1">{{ denominator }}</span>
  </span>
</template>
