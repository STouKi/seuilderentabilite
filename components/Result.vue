
<script>
  export default {
    props: {
      label: {
        type: String,
        required: true
      },
      value: {
        type: Number,
        required: true
      }
    }
  }
</script>

<template>
  <div class="flex flex-col">
    <label>{{ label }}</label>
    
    <input
    disabled
    type="number" 
    class="border border-blue-300 rounded p-2"
    :value="value" />
  </div>
</template>