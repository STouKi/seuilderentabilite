<script>
  export default {
    props: {
      title: {
        type: String,
        required: true
      }
    }
  }
</script>

<template>
  <form class="rounded border border-cyan-500">
    <div class="p-6 bg-gradient-to-r from-cyan-500 to-blue-500">
      <h2 class="text-white">{{ title }}</h2>
    </div>
    
    <div class="p-10 flex flex-col gap-4">
      <slot />
    </div>
  </form>
</template>