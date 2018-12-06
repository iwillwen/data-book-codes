import Vue from 'vue'
import Vuex from 'vuex'
import iView from 'iview'
import 'iview/dist/styles/iview.css'

Vue.use(Vuex)
Vue.use(iView, {
  size: 'large'
})
Vue.config.productionTip = false

const App = require('./App.vue')

new Vue({
  render: h => h(App.default),
}).$mount('#app')
