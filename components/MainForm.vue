<script>
  export default {
    props: {
      
    }
  }
</script>

<template>
  <form class="grid grid-cols-1 lg:grid-cols-3">
    <FormInput
    :type="'number'"
    :label="form.turnover.text"
    v-model.trim="form.turnover.value" />
  </form>
</template>