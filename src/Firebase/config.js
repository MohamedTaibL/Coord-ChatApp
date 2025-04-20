import firebase from 'firebase/app'

import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/database'

const firebaseConfig = {
    apiKey: "AIzaSyCrM2IId22aDlrMVA_s9_G6M461TuQHG3w",
    authDomain: "chat-app-2e99b.firebaseapp.com",
    projectId: "chat-app-2e99b",
    storageBucket: "chat-app-2e99b.firebasestorage.app",
    messagingSenderId: "531571521427",
    appId: "1:531571521427:web:f591ddefbe028e2ac69a66"
  };


firebase.initializeApp(firebaseConfig)


const db = firebase.firestore()
const auth = firebase.auth()
const rtdb = firebase.database()

auth.setPersistence(firebase.auth.Auth.Persistence.SESSION)
  .then(() => {
  }).catch((error) => {
    // Handle Errors here.
    console.log(error);
  }); 


export {auth , db, rtdb}
