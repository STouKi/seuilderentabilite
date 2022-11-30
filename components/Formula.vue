<script>
 export default {
   props: {
      size: {
        type: String,
        required: false
      },
      equation: {
        type: String,
        required: true
      }
   }
 }
</script>


<template>
  <div 
  class="bg-board rounded"
  :class="{ 'p-2': size === 'small', 'px-3 lg:px-7 py-3 lg:py-6': size !== 'small' }">
    <p 
    class="formula text-center text-white"
    :class="{ 'text-sm': size === 'small', 'text-xl lg:text-3xl': size !== 'small' }"
    v-html="equation">
    </p>
  </div>
</template>