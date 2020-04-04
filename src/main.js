import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import '@babel/polyfill';
import '@/firebase';
import firebase from '@/firebase';

Vue.config.productionTip = false;

// Handle page reloads.
let app;
firebase.auth.onAuthStateChanged(user => {
    if (!app) {
        app = new Vue({
            router,
            store,
            vuetify,
            render: h => h(App)
        }).$mount('#app');
        store.commit('setUser', user ? user.uid : null);
    }
});
