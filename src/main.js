import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { db as firestore, auth } from '@/Firebase/config';
import firebase from 'firebase/app';

let app;

auth.onAuthStateChanged(user => {

  if (!app) {
    app = createApp(App);
    app.use(router);
    app.mount('#app');
  }

  if (user) {
    const userStatusRef = firestore.collection('users').doc(user.uid);
    const isOfflineForFirestore = {
      state: 'offline',
      last_changed: firebase.firestore.FieldValue.serverTimestamp(),
    };
    const isOnlineForFirestore = {
      state: 'online',
      last_changed: firebase.firestore.FieldValue.serverTimestamp(),
    };

    // Online and offline event listeners
    window.addEventListener('online', () => {
      userStatusRef.set(isOnlineForFirestore, { merge: true }).catch(error => {
        console.error('Error setting online status: ', error);
      });
    });

    window.addEventListener('offline', () => {
      userStatusRef.set(isOfflineForFirestore, { merge: true }).catch(error => {
        console.error('Error setting offline status: ', error);
      });
    });

    // Initial check (check user status on app load)
    if (navigator.onLine) {
      userStatusRef.set(isOnlineForFirestore, { merge: true }).catch(error => {
        console.error('Error setting online status: ', error);
      });
    } else {
      userStatusRef.set(isOfflineForFirestore, { merge: true }).catch(error => {
        console.error('Error setting offline status: ', error);
      });
    }

    // Handle user window/tab close
    window.addEventListener('beforeunload', () => {
      userStatusRef.set(isOfflineForFirestore, { merge: true }).catch(error => {
        console.error('Error setting offline status on unload: ', error);
      });
    });

    // Real-time status listener
    userStatusRef.onSnapshot(doc => {
      if (doc.exists) {
        const userStatus = doc.data().state;
        if (userStatus === 'offline') {
          // Logic for user going offline
        }
      }
    });
  } else {
    const restrictedPages = ['login', 'signup', 'landing'];
    if (!restrictedPages.includes(router.currentRoute.value.name)) {
      router.push('/');
    }
  }
});