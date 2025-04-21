import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/database';
import { ref, onUnmounted } from 'vue';

const firebaseConfig = {
  apiKey: "AIzaSyCrM2IId22aDlrMVA_s9_G6M461TuQHG3w",
  authDomain: "chat-app-2e99b.firebaseapp.com",
  projectId: "chat-app-2e99b",
  storageBucket: "chat-app-2e99b.firebasestorage.app",
  messagingSenderId: "531571521427",
  appId: "1:531571521427:web:f591ddefbe028e2ac69a66"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth();
const rtdb = firebase.database();

// Set persistence for auth session
auth.setPersistence(firebase.auth.Auth.Persistence.SESSION)
  .then(() => {
    // Persistence set successfully
  })
  .catch((error) => {
    console.log('Error setting persistence:', error);
  });

  firebase.auth().onAuthStateChanged(user => {
    if (!user) return
  
    const uid = user.uid
    const userStatusDatabaseRef = firebase.database().ref(`/status/${uid}`)
  
    const isOfflineForDatabase = {
      state: 'offline',
      last_changed: firebase.database.ServerValue.TIMESTAMP,
    }
  
    const isOnlineForDatabase = {
      state: 'online',
      last_changed: firebase.database.ServerValue.TIMESTAMP,
    }
  
    const connectedRef = firebase.database().ref('.info/connected')
    connectedRef.on('value', snapshot => {
      if (snapshot.val() === false) return
  
      userStatusDatabaseRef
        .onDisconnect()
        .set(isOfflineForDatabase)
        .then(() => {
          userStatusDatabaseRef.set(isOnlineForDatabase)
        })
    })
})


function useUserPresence(otherUserId) {
  const isOnline = ref(false)
  const userStatusRef = rtdb.ref('status/' + otherUserId) // usually under /status/, not /users/

  // Store the actual callback so we can detach it later
  const statusCallback = snapshot => {
    const status = snapshot.val()
    isOnline.value = status?.state === 'online'
  }

  userStatusRef.on('value', statusCallback)

  onUnmounted(() => {
    userStatusRef.off('value', statusCallback)
  })

  return { isOnline }
}

export { auth, db, rtdb, useUserPresence};
