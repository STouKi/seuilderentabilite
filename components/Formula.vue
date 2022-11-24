<script>
 export default {
   props: {
      size: {
        type: String,
        required: true
      },
      equation: {
        type: String,
        required: true
      }
   }
 }
</script>


<template>
  <div class="mb-4 md:mb-10 px-3 md:px-7 py-3 md:py-6 bg-board ring-1 ring-gray-900/5 rounded-0 md:rounded-lg leading-none space-x-6 mx-auto">    
    <p class="formula text-center text-white text-2xl md:text-3xl">{{ equation }}</p>
  </div>
</template>