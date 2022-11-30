<script>
  export default {
    data () {
      return {
        form: {
          turnover: {
            text: 'Chiffre d\'Affaires',
            value: 0
          },
          fixedExpenses: {
            text: 'Charges Fixes',
            value: 0
          },
          variableCosts: {
            text: 'Charges Variables',
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
          text: 'Seuil de Rentabilité',
          value: value.toFixed(2)
        }
      }
    }
  }
</script>

<template>
  <div class="container mx-auto p-4 lg:p-10 flex flex-col gap-10">
    <Header />

    <Formula equation="Seuil de rentabilité = Charges fixes / Taux de marge sur coûts variables" />

    <div class="flex flex-col gap-4 bg-white p-3 lg:p-6 rounded shadow">
      <p class="text-sm">Indiquez votre <strong>Chiffre d'Affaires</strong>, vos <strong>Charges Fixes</strong> et vos <strong>Charges Variables</strong> pour obtenir votre <strong>Seuil de Rentabilité</strong>.</p>

      <form class="grid grid-cols-1 lg:grid-cols-3 place-items-end gap-4">
        <FormInput
        type='number'
        :label="form.turnover.text"
        v-model.trim="form.turnover.value" />

        <FormInput
        type='number'
        :label="form.fixedExpenses.text"
        v-model.trim="form.fixedExpenses.value" />

        <FormInput
        type='number'
        :label="form.variableCosts.text"
        v-model.trim="form.variableCosts.value" />

        <Result
        color="green"
        :label="`Votre ${ breakEvenPoint.text } est de`"
        :value="breakEvenPoint.value" />

        <!-- <Button /> -->
      </form>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Form :title="contributionMargin.text">
        <Formula size="small" equation="Marge sur coûts variables = <br /> Chiffre d'affaires - Charges variables" />

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
        <Formula size="small" equation="Taux de marge sur coûts variables = <br /> Marge sur coûts variables / Chiffre d'Affaire" />

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
        <Formula size="small" equation="Seuil de rentabilité = <br /> Charges fixes / Taux de marge sur coûts variables" />

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
    
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div class="hidden lg:block" />
      <div class="hidden lg:block" />
      <!-- <Button /> -->
    </div>
  </div>
</template>
