<script>
  export default {
    data () {
      return {
        form: {
          turnover: {
            text: 'Chiffre d\'affaires',
            value: 0
          },
          fixedExpenses: {
            text: 'Charges fixes',
            value: 0
          },
          variableCosts: {
            text: 'Charges variables',
            value: 0
          }
        }
      }
    },
    computed: {
      contributionMargin() {
        return {
          text: 'Marge sur coûts variables',
          value: this.form.turnover.value - this.form.variableCosts.value
        }
      },
      contributionMarginRate() {
        const value = this.contributionMargin.value / this.form.turnover.value

        return {
          text: 'Taux de marge sur coûts variables',
          value: value.toFixed(2)
        }
      },
      breakEvenPoint() {
        const value = this.form.fixedExpenses.value / this.contributionMarginRate.value
        
        return {
          text: 'Seuil de rentabilité',
          value: value.toFixed(2)
        }
      }
    }
  }
</script>

<template>
  <div class="container mx-auto py-4 md:py-10">
    <Header />

    <Formula size="small" equation="Seuil de rentabilité = Charges fixes / Taux de marge sur coûts variables" />

    <form class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-10">
      <FormInput
      :type="'number'"
      :label="form.turnover.text"
      v-model.trim="form.turnover.value" />

      <FormInput
      :type="'number'"
      :label="form.fixedExpenses.text"
      v-model.trim="form.fixedExpenses.value" />

      <FormInput
      :type="'number'"
      :label="form.variableCosts.text"
      v-model.trim="form.variableCosts.value" />
    </form>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Form :title="contributionMargin.text">
        <p class="text-sm text-white bg-gray-800 p-2 rounded">Marge sur coûts variables = Chiffre d'affaires - Charges variables</p>

        <Result
        :label="form.turnover.text"
        :value="form.turnover.value" />

        <Result
        :label="form.variableCosts.text"
        :value="form.variableCosts.value" />
        
        <Result
        :label="contributionMargin.text"
        :value="contributionMargin.value" />
      </Form>

      <Form :title="contributionMarginRate.text">
        <p class="text-sm text-white bg-gray-800 p-2 rounded">Taux de marge sur coûts variables = Marge sur coûts variables / Chiffre d'Affaire</p>

        <Result
        :label="contributionMargin.text"
        :value="contributionMargin.value" />

        <Result
        :label="form.turnover.text"
        :value="form.turnover.value" />
        
        <Result
        :label="contributionMarginRate.text"
        :value="contributionMarginRate.value" />
      </Form>

      <Form :title="breakEvenPoint.text">
        <p class="text-sm text-white bg-gray-800 p-2 rounded">Seuil de rentabilité = Charges fixes / Taux de marge sur coûts variables</p>

        <Result
        :label="form.fixedExpenses.text"
        :value="form.fixedExpenses.value" />

        <Result
        :label="contributionMarginRate.text"
        :value="contributionMarginRate.value" />

        <Result
        color="green"
        :label="breakEvenPoint.text"
        :value="breakEvenPoint.value" />
      </Form>
    </div>
    
    <div class="grid grid-cols-1 lg:grid-cols-3 md:mt-10 gap-4">
      <div></div>
      <div></div>
      <button class="bg-rose-400 hover:bg-rose-300 duration-300 p-3 md:p-6 rounded-0 md:rounded text-white">
        Télecharger gratuitement vos résultat en PDF
      </button>
    </div>
  </div>
</template>
