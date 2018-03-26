// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import App from '@/App'
import BalanceInfo from '@/views/BalanceInfo'
import CET from '@/views/CET'
import { ConfirmPlugin, AlertPlugin } from 'vux'

Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(ConfirmPlugin)
Vue.use(AlertPlugin)

const routes = [
  {
    path: '/',
    component: BalanceInfo
  },
  {
    path: '/cet',
    component: CET
  }
]

const store = new Vuex.Store({
  state: {
    basicStore: 'sample'
  },
  strict: process.env.NODE_ENV !== 'production'
})

const router = new VueRouter({
  routes
})

FastClick.attach(document.body)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app-box')
