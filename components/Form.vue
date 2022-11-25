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
  <form class="bg-white rounded shadow">
    <div class="p-3 lg:p-6 bg-gradient rounded-t">
      <h2 class="text-white">{{ title }}</h2>
    </div>
    
    <div class="p-3 lg:p-6 flex flex-col gap-4">
      <slot />
    </div>
  </form>
</template>