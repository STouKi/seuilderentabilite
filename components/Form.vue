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
  <form class="bg-white rounded-0 md:rounded shadow">
    <div class="p-3 md:p-6 bg-gradient rounded-0 md:rounded-t">
      <h2 class="text-white">{{ title }}</h2>
    </div>
    
    <div class="p-10 flex flex-col gap-4">
      <slot />
    </div>
  </form>
</template>