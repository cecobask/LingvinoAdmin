import Vue from 'vue';
import Vuex from 'vuex';
import firebase from '@/firebase';
import router from '@/router';
import {
    formatPastWotds,
    formatQuizData,
    formatSelectionWotds
} from '@/helpers';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        user: null,
        authError: null,
        wotds: [],
        quizData: {
            formatted: [],
            raw: {}
        }
    },
    
    mutations: {
        setUser(state, payload) {
            state.user = payload;
        },
        setAuthError(state, payload) {
            state.authError = payload;
        },
        setWotds(state, payload) {
            state.wotds = payload;
        },
        setQuizData(state, payload) {
            state.quizData = payload;
        }
    },
    
    actions: {
        loginAction({ commit }, payload) {
            const loader = Vue.$loading.show();
            firebase.auth
                .signInWithEmailAndPassword(payload.email, payload.password)
                .then(async res => {
                    commit('setUser', res.user.uid);
                    commit('setAuthError', null);
                    await router.replace('/');
                    loader.hide();
                })
                .catch(err => {
                    loader.hide();
                    if (err.code.startsWith('auth'))
                        commit('setAuthError', err.message);
                });
        },
        logoutAction({ commit }) {
            const loader = Vue.$loading.show();
            firebase.auth
                .signOut()
                .then(async () => {
                    commit('setUser', null);
                    commit('setAuthError', null);
                    await router.replace('/login');
                    loader.hide();
                })
                .catch(err => {
                    loader.hide();
                    if (err.code.startsWith('auth'))
                        commit('setAuthError', err.message);
                });
        },
        fetchWotds({ commit }) {
            const loader = Vue.$loading.show();
            firebase.database
                .ref('/wordOfTheDay')
                .once('value')
                .then(snapshot => {
                    loader.hide();
                    commit(
                        'setWotds',
                        [
                            formatPastWotds(snapshot),
                            formatSelectionWotds(snapshot)].filter(Boolean)
                    );
                });
        },
        fetchQuizData({ commit }) {
            const loader = Vue.$loading.show();
            firebase.database
                .ref('quizGame/topics')
                .once('value')
                .then(snapshot => {
                    loader.hide();
                    commit('setQuizData', {
                        formatted: formatQuizData(snapshot),
                        raw: snapshot.val()
                    });
                });
        }
    }
});

