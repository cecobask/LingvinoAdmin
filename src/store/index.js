import Vue from 'vue';
import Vuex from 'vuex';
import firebase from '@/firebase';
import router from '@/router';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        user: null,
        authError: null,
        pastWotds: []
    },
    
    mutations: {
        setUser(state, payload) {
            state.user = payload;
        },
        setAuthError(state, payload) {
            state.authError = payload;
        },
        setPastWotds(state, payload) {
            state.pastWotds = payload;
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
        },
        fetchWotds({ commit }) {
            firebase.database
                .ref('/wordOfTheDay/past')
                .once('value')
                .then(snapshot => {
                    const wordsSnap = snapshot.val();
                    let pastWords = [
                        {
                            id: 'past',
                            name: 'past',
                            children: []
                        }
                    ];
                    for (const date in wordsSnap) {
                        if (Object.prototype.hasOwnProperty.call(wordsSnap,
                            date)) {
                            let word = {
                                id: date,
                                name: date,
                                children: []
                            };
                            let values = Object.entries(wordsSnap[date]);
                            values.forEach(val => {
                                word.children.push({
                                    id: `${date}/${val[0]}`,
                                    name: val[0],
                                    children: [
                                        {
                                            id: `${date}/${val[0]}`,
                                            name: [val[1]]
                                        }
                                    ]
                                });
                            });
                            pastWords[0].children.push(word);
                        }
                    }
                    
                    commit('setPastWotds', pastWords);
                });
        }
    },
    
    getters: {
        user(state) {
            return state.user;
        },
        authError(state) {
            return state.authError;
        },
        pastWotds(state) {
            return state.pastWotds;
        }
    }
});

