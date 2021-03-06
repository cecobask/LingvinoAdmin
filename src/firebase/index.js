import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/functions';

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
const database = firebase.database();
const functions = firebase.functions();

export default {
    auth,
    database,
    functions
};
