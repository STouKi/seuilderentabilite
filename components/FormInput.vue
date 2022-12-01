<script>
  export default {
    props: {
      type: {
        type: String,
        required: true
      },
      label: {
        type: String,
        required: true
      },
      id: {
        type: String,
        required: true
      }
    },
    emits: ['update:modelValue']
  }
</script>

<template>
  <div class="flex flex-col w-full">
    <label :for="id">{{ label }}</label>
    
    <input
    :id="id"
    :type="type" 
    class="border border-blue-300 rounded p-2"
    @input="$emit('update:modelValue', $event.target.value)" />
  </div>
</template>
