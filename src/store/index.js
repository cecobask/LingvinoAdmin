import Vue from 'vue';
import Vuex from 'vuex';
import firebase from '@/firebase';
import router from '@/router';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        user: null,
        authError: null,
        wotds: [],
        quizData: []
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
                        [formatPastWotds(snapshot), formatSelectionWotds(snapshot)].filter(Boolean)
                    );
                });
        },
        fetchQuizData({ commit }) {
            firebase.database
                .ref('quizGame/topics')
                .once('value')
                .then(snapshot => {
                    commit('setQuizData', formatQuizData(snapshot))
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

function formatQuizData(snapshot) {
    const topics = []
    snapshot.forEach(topicSnapshot => {
        const topic = {
            id: topicSnapshot.key,
            name: topicSnapshot.key,
            value: JSON.stringify(snapshot.child(topicSnapshot.key)),
            children: []
        }
        topicSnapshot.forEach(languageSnapshot => {
            const languageRef = `${topic.id}/${languageSnapshot.key}`;
            const lang = {
                id: languageRef,
                name: languageSnapshot.key,
                value: JSON.stringify(snapshot.child(languageRef)),
                children: []
            }
            topic.children.push(lang);
            languageSnapshot.forEach(questionSnapshot => {
                const questionRef = `${lang.id}/${questionSnapshot.key}`;
                const question = {
                    id: questionRef,
                    name: questionSnapshot.key,
                    value: JSON.stringify(snapshot.child(questionRef)),
                    children: []
                }
                lang.children.push(question);
                questionSnapshot.forEach(answersSnapshot => {
                    const answerRef = `${question.id}/${answersSnapshot.key}`;
                    const answers = {
                        id: answerRef,
                        name: answersSnapshot.key,
                        value: answersSnapshot.val(),
                        children: [{
                            id: `${answerRef}/last`,
                            name: answersSnapshot.val(),
                            label: answersSnapshot.key,
                            value: answersSnapshot.val()
                        }]
                    }
                    question.children.push(answers)
                })
            })
        })
        topics.push(topic);
    })
    return topics;
}

function formatSelectionWotds(snapshot) {
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

function formatPastWotds(snapshot) {
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

