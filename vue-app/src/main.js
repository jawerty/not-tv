require('bootstrap/dist/css/bootstrap.css');
require('bootstrap-vue/dist/bootstrap-vue.css');

import Vue from 'vue';
import App from './App.vue';
import { BootstrapVue, BIconPlus, BIconCircleFill } from 'bootstrap-vue';

Vue.use(BootstrapVue);
Vue.component('BIconPlus', BIconPlus);
Vue.component('BIconCircleFill', BIconCircleFill);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#app');
