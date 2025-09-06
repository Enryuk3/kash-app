import { defineNuxtPlugin } from '#app'
import Highcharts from 'highcharts'
import HighchartsVue from 'highcharts-vue'
// Import any necessary Highcharts modules, e.g., stock charts
// import stockInit from 'highcharts/modules/stock';

export default defineNuxtPlugin({
  name: 'highcharts-vue',
  parallel: true,
  setup(nuxtApp) {
    if (typeof Highcharts === 'object') {
      // Initialize any Highcharts modules here if needed
      // stockInit(Highcharts);
    }
    nuxtApp.vueApp.use(HighchartsVue)
  },
})
