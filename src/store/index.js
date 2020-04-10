import Vue from 'vue';
import Vuex from 'vuex';
import firebase from '@/firebase';
import router from '@/router';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        user: null,
        authError: null,
        wotds: []
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
                        [getPastWotds(snapshot), getSelectionWotds(snapshot)].filter(Boolean)
                    );
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
        wotds(state) {
            return state.wotds;
        }
    }
});

function getSelectionWotds(snapshot) {
    const wordsSelectionSnap = snapshot.child('selection');
    const wordsSelection =
              {
                  id: 'selection',
                  name: 'selection',
                  children: []
              };
    wordsSelectionSnap.forEach(word => {
        wordsSelection.children.push(
            {
                id: `selection/${word.key}`,
                name: word.val(),
                label: 'word',
                value: word.val()
            }
        );
    });
    
    return wordsSelection.children.length ? wordsSelection : null;
}

function getPastWotds(snapshot) {
    const pastWordsSnap = snapshot.child('past').val();
    let pastWords =
            {
                id: 'past',
                name: 'past',
                children: []
            };
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
            pastWords.children.push(word);
        }
    }
    
    pastWords.children.sort((a, b) => {
            const dateStrA = a.name.split('-');
            const dateStrB = b.name.split('-');
            return new Date(dateStrA[2], dateStrA[1], dateStrA[0])
                   - new Date(dateStrB[2], dateStrB[1], dateStrB[0]);
        })
        .reverse();
    
    return pastWords.children.length ? pastWords : null;
}

