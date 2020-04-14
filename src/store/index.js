import Vue from 'vue';
import Vuex from 'vuex';
import firebase from '@/firebase';
import router from '@/router';
import {
    formatPastWotds,
    formatQuizData,
    formatSelectionWotds,
    formatTranslatorData
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
        },
        translatorData: []
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
        },
        setTranslatorData(state, payload) {
            state.translatorData = payload;
        }
    },
    
    actions: {
        loginAction({ commit, dispatch }, payload) {
            const loader = Vue.$loading.show();
            firebase.auth
                .signInWithEmailAndPassword(payload.email, payload.password)
                .then(res => {
                    firebase.database.ref(`users/${res.user.uid}`)
                        .once('value')
                        .then(async userData => {
                            if (userData.child('admin').val()) {
                                commit('setUser', res.user.uid);
                                commit('setAuthError', null);
                                await router.replace('/');
                            } else {
                                dispatch('logoutAction', {loginOut: true})
                                commit('setAuthError', 'This user is not an admin.');
                            }
                        });
                    loader.hide();
                })
                .catch(err => {
                    loader.hide();
                    if (err.code.startsWith('auth'))
                        commit('setAuthError', err.message);
                });
        },
        logoutAction({ commit }, payload) {
            const loader = Vue.$loading.show();
            firebase.auth
                .signOut()
                .then(async () => {
                    commit('setUser', null);
                    if (!payload.loginOut) commit('setAuthError', null);
                    await router.replace('/login');
                    loader.hide();
                })
                .catch(err => {
                    loader.hide();
                    if (err.code && err.code.startsWith('auth'))
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
                            formatSelectionWotds(snapshot)
                        ].filter(Boolean)
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
                        formatted: [formatQuizData(snapshot)],
                        raw: snapshot.val()
                    });
                });
        },
        fetchTranslatorData({ commit }) {
            const loader = Vue.$loading.show();
            firebase.database
                .ref('users')
                .once('value')
                .then(snapshot => {
                    loader.hide();
                    commit('setTranslatorData', formatTranslatorData(snapshot));
                });
        }
    }
});

