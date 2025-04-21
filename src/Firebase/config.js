import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/database';

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

// Monitor authentication state change
auth.onAuthStateChanged(user => {
  if (user) {
    // User is logged in, update their status in Realtime Database
    const userId = user.uid;
    const userStatusRef = rtdb.ref('users/' + userId);

    const userStatus = {
      state: 'online',
      last_changed: firebase.database.ServerValue.TIMESTAMP
    };

    // Set or update the user's status to 'online'
    userStatusRef.set(userStatus)
      .then(() => {
        console.log('User status set to online');
      })
      .catch((error) => {
        console.error('Error setting user status:', error);
      });

    // Automatically mark user as 'offline' when they disconnect (e.g., when the tab/window is closed)
    userStatusRef.onDisconnect().set({
      state: 'offline',
      last_changed: firebase.database.ServerValue.TIMESTAMP
    });

    // Optionally, listen to changes in user status
    userStatusRef.on('value', snapshot => {
      const status = snapshot.val();
      console.log('User status:', status.state); // Logs 'online' or 'offline'
    });
  } else {
    // User is logged out, handle status cleanup if necessary
    console.log('User is logged out.');
  }
});

export { auth, db, rtdb };
