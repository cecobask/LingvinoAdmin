import Vue from 'vue';
import Vuex from 'vuex';
import firebase from 'firebase';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        user: null,
        status: null,
        error: null
    },

    mutations: {
        setUser(state, payload) {
            state.user = payload;
        },
        removeUser(state) {
            state.user = null;
        },
        setStatus(state, payload) {
            state.status = payload;
        },
        setError(state, payload) {
            state.error = payload;
        }
    },

    actions: {
        loginAction({ commit }, payload) {
            firebase
                .auth()
                .signInWithEmailAndPassword(payload.email, payload.password)
                .then(res => {
                    commit('setUser', res.user.uid);
                    commit('setStatus', 'success');
                    commit('setError', null);
                    console.log(res);
                })
                .catch(err => {
                    commit('setStatus', 'failure');
                    commit('setError', err.message);
                    console.log(err);
                });
        },
        logoutAction({ commit }) {
            firebase
                .auth()
                .signOut()
                .then(() => {
                    commit('setUser', null);
                    commit('setStatus', 'success');
                    commit('setError', null);
                })
                .catch(err => {
                    commit('setStatus', 'failure');
                    commit('setError', err.message);
                });
        }
    },

    getters: {
        user(state) {
            return state.user;
        },
        status(state) {
            return state.status;
        },
        error(state) {
            return state.error;
        }
    }
});
