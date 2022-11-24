<script>
  export default {
    data () {
      return {
        form: {
          turnover: {
            text: 'Chiffre d\'affaires',
            value: 0
          },
          variableCosts: {
            text: 'Charges variables',
            value: 0
          },
          breakEvenPoint: {
            text: 'Seuil de rentabilité',
            value: 0
          },
        }
      }
    },
    computed: {
      contributionMargin() {
        return {
          text: 'Marge sur coûts variables',
          value: this.form.turnover.value - this.form.variableCosts.value
        }
      }
    }
  }
</script>


<template>
  <div class="container mx-auto my-auto">
    <div class="py-10 flex items-center">
      <Icon name="ic:outline-calculate" class="w-10 h-10 mr-5" />
      <h1 class="text-3xl">Calcul du seuil de rentabilité</h1>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Form :title="'Marge sur coût variable'">
        <FormInput
        :type="'number'"
        :label="form.turnover.text"
        v-model.trim="form.turnover.value" />

        <FormInput
        :type="'number'"
        :label="form.variableCosts.text"
        v-model.trim="form.variableCosts.value" />
        
        <Result
        :label="contributionMargin.text"
        :value="contributionMargin.value" />
      </Form>

      <Form :title="'Marge sur coût variable'">
        <FormInput
        :type="'number'"
        :label="form.turnover.text"
        v-model.trim="form.turnover.value" />

        <FormInput
        :type="'number'"
        :label="form.variableCosts.text"
        v-model.trim="form.variableCosts.value" />
        
        <Result
        :label="contributionMargin.text"
        :value="contributionMargin.value" />
      </Form>

      <Form :title="'Seuil de rentabilité'">
        <FormInput
        :type="'number'"
        :label="form.turnover.text"
        v-model.trim="form.turnover.value" />

        <FormInput
        :type="'number'"
        :label="form.variableCosts.text"
        v-model.trim="form.variableCosts.value" />
        
        <Result
        :label="contributionMargin.text"
        :value="contributionMargin.value" />
      </Form>
    </div>
  </div>
</template>
