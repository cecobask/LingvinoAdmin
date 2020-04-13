import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import '@babel/polyfill';
import firebase from '@/firebase';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import JsonEditor from 'vue-json-edit'

Vue.config.productionTip = false;
Vue.use(Loading, { color: 'red', opacity: 0.3 });
Vue.use(JsonEditor)

Vue.filter('capitalize', function (value) {
    if (!value) return ''
    value = value.toString()
    return value.charAt(0).toUpperCase() + value.slice(1)
})

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
