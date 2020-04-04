import Vue from 'vue';
import Vuex from 'vuex';
import firebase from '@/firebase';
import router from '@/router';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        user: null,
        authError: null
    },

    mutations: {
        setUser(state, payload) {
            state.user = payload;
        },
        setAuthError(state, payload) {
            state.authError = payload;
        }
    },

    actions: {
        loginAction({ commit }, payload) {
            firebase.auth
                .signInWithEmailAndPassword(payload.email, payload.password)
                .then(async res => {
                    commit('setUser', res.user.uid);
                    commit('setAuthError', null);
                    await router.replace('/');
                })
                .catch(err => {
                    if (err.code.startsWith('auth'))
                        commit('setAuthError', err.message);
                });
        },
        logoutAction({ commit }) {
            firebase.auth
                .signOut()
                .then(async () => {
                    commit('setUser', null);
                    commit('setAuthError', null);
                    await router.replace('/login');
                })
                .catch(err => {
                    if (err.code.startsWith('auth'))
                        commit('setAuthError', err.message);
                });
        }
    },

    getters: {
        user(state) {
            return state.user;
        },
        authError(state) {
            return state.authError;
        }
    }
});
