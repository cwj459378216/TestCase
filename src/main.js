import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './plugins/JsonViewer.js'
import './plugins/diff.js'
import './assets/css/global.css'
import 'vue-json-viewer/style.css'

import axios from 'axios'
axios.defaults.baseURL = '/api'

Vue.prototype.$http = axios
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
