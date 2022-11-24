<script>
  export default {
    props: {
      label: {
        type: String,
        required: true
      }
    },
    emits: ['update:modelValue']
  }
</script>

<template>
  <div class="flex flex-col">
    <label>{{ label }}</label>
    
    <input 
    type="text" 
    class="border border-blue-300 rounded p-2"
    @input="$emit('update:modelValue', $event.target.value)" />
  </div>
</template>
