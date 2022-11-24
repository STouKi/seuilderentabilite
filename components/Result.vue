
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
      },
      color: {
        type: String,
        required: false
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
    class="rounded p-2"
    :class="{ 'bg-green-300': color === 'green', 'border border-blue-300': color !== 'green' }"
    :value="value" />
  </div>
</template>