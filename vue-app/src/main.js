require('bootstrap/dist/css/bootstrap.css');
require('bootstrap-vue/dist/bootstrap-vue.css');
require('video.js/dist/video-js.min.css');

import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';
import Home from './components/Home.vue';
import WatchChannel from './components/WatchChannel.vue';
import Profile from './components/Profile.vue';
import { BootstrapVue, BIconPlus, BIconCircleFill } from 'bootstrap-vue';

// import videojs from 'video.js/dist/video.min.js';
import videojs from './assets/js/Youtube.js';
window.videojs = videojs;

Vue.use(VueRouter);
Vue.use(BootstrapVue);
Vue.component('BIconPlus', BIconPlus);
Vue.component('BIconCircleFill', BIconCircleFill);

Vue.config.productionTip = false;

const routes = [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/channel/:channelId',
      name: 'WatchChannel',
      component: WatchChannel
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile
    }
];

const router = new VueRouter({
  routes
});

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
