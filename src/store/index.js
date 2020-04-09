import Vue from 'vue';
import Vuex from 'vuex';
import firebase from '@/firebase';
import router from '@/router';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        user: null,
        authError: null,
        pastWotds: [],
        selectionWotds: []
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
        },
        setSelectionWotds(state, payload) {
            state.selectionWotds = payload;
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
                .ref('/wordOfTheDay')
                .once('value')
                .then(snapshot => {
                    commit('setPastWotds', getPastWotds(snapshot));
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
        },
        selectionWotds(state) {
            return state.selectionWotds;
        }
    }
});

function getPastWotds(snapshot) {
    const pastWordsSnap = snapshot.child('past').val();
    let pastWords = [
        {
            id: 'past',
            name: 'past',
            children: []
        }
    ];
    for (const date in pastWordsSnap) {
        if (Object.prototype.hasOwnProperty.call(pastWordsSnap, date)) {
            let word = {
                id: `past/${date}`,
                name: date,
                value: JSON.stringify(snapshot.child(`past/${date}`)),
                children: []
            };
            let values = Object.entries(pastWordsSnap[date]);
            values.forEach(val => {
                word.children.push({
                    id: `past/${date}/${val[0]}`,
                    name: val[0],
                    value: val[1],
                    children: [
                        {
                            id: `past/${date}/${val[0]}/last`,
                            name: val[1],
                            label: val[0],
                            value: val[1]
                        }
                    ]
                });
            });
            pastWords[0].children.push(word);
        }
    }
    return pastWords;
}

