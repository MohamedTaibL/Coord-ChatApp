import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/database';
import { ref, onUnmounted } from 'vue';

const firebaseConfig = {
  apiKey: "AIzaSyCrM2IId22aDlrMVA_s9_G6M461TuQHG3w",
  authDomain: "chat-app-2e99b.firebaseapp.com",
  databaseURL: "https://chat-app-2e99b-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "chat-app-2e99b",
  storageBucket: "chat-app-2e99b.firebasestorage.app",
  messagingSenderId: "531571521427",
  appId: "1:531571521427:web:f591ddefbe028e2ac69a66"
}


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
    if (user) {
      const uid = user.uid;
      const userStatusDatabaseRef = firebase.database().ref(`/status/${uid}`);
  
      const isOfflineForDatabase = {
        state: 'offline',
        last_changed: firebase.database.ServerValue.TIMESTAMP,
      };
  
      const isOnlineForDatabase = {
        state: 'online',
        last_changed: firebase.database.ServerValue.TIMESTAMP,
      };
  
      const connectedRef = firebase.database().ref('.info/connected');
      connectedRef.on('value', snapshot => {
        if (snapshot.val() === false) return;
  
        userStatusDatabaseRef
          .onDisconnect()
          .set(isOfflineForDatabase)
          .then(() => {
            userStatusDatabaseRef.set(isOnlineForDatabase);
          });
      });
    }
  });

export function useUserPresence(otherUserId) {
  const isOnline = ref(false);
  const userStatusRef = firebase.database().ref('status/' + otherUserId);

  const callback = snapshot => {
    const status = snapshot.val();
    if (status !== null) {
      isOnline.value = status.state === 'online';
    } else {
      isOnline.value = false;  // Default to offline if no status
    }
  };

  // Set up the listener
  userStatusRef.on('value', callback);

  // Cleanup when the component is unmounted
  onUnmounted(() => {
    userStatusRef.off('value', callback);
  });

  return isOnline;
}

export { auth, db, rtdb};
