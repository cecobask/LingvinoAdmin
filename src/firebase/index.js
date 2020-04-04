import firebase from 'firebase/app';
import 'firebase/auth';

const config = {
    apiKey: 'AIzaSyCn_iMNw-YOo9USv0HKrOARjWrW1pv7Elw',
    authDomain: 'lingvino.firebaseapp.com',
    databaseURL: 'https://lingvino.firebaseio.com',
    projectId: 'lingvino',
    storageBucket: 'lingvino.appspot.com',
    messagingSenderId: '810255866924',
    appId: '1:810255866924:web:c09f1e8b79a0e2b2eec589',
    measurementId: 'G-MPHEMYYTG0'
};

firebase.initializeApp(config);

const auth = firebase.auth();
const currentUser = auth.currentUser;
const database = firebase.database;

export default {
    auth,
    currentUser,
    database
};
