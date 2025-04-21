import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { db as firestore, auth } from '@/Firebase/config';
import firebase from 'firebase/app';

let app;
let logedinuser = null;  // Variable to store the logged-in user

auth.onAuthStateChanged(user => {
  if (!app) {
    app = createApp(App);
    app.use(router);
    app.mount('#app');
  }

  const isOfflineForFirestore = {
    state: 'offline',
    last_changed: firebase.firestore.FieldValue.serverTimestamp(),
  };
  const isOnlineForFirestore = {
    state: 'online',
    last_changed: firebase.firestore.FieldValue.serverTimestamp(),
  };

  // Function to update user status in Firestore
  const updateUserStatus = (status) => {
    if (logedinuser) {
      const userStatusRef = firestore.collection('users').doc(logedinuser.uid);
      userStatusRef.update(status).catch(error => {
        console.error('Error updating user status: ', error);
      });
    }
  };

  // Initial check: Set the initial status based on the current network status
  const handleInitialStatus = () => {
    if (navigator.onLine) {
      updateUserStatus(isOnlineForFirestore);
    } else {
      updateUserStatus(isOfflineForFirestore);
    }
  };

  // Handle online and offline events
  const handleOnlineStatus = () => {
    updateUserStatus(isOnlineForFirestore);
  };

  const handleOfflineStatus = () => {
    updateUserStatus(isOfflineForFirestore);
  };

  // Call Firebase Cloud Function for offline status before unload
  const handleBeforeUnload = () => {
    if (logedinuser) {
      // Call Cloud Function to update status
      fetch('https://<REGION>-<PROJECT_ID>.cloudfunctions.net/updateUserOfflineStatus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: logedinuser.uid,
        }),
      }).then(response => {
        if (response.ok) {
          console.log('User status updated successfully');
        } else {
          console.error('Failed to update user status');
        }
      }).catch(error => {
        console.error('Error calling cloud function:', error);
      });
    }
  };

  if (user) {
    logedinuser = user;  // Store the logged-in user
    
    // Set initial status when the user logs in
    handleInitialStatus();

    // Listen to online/offline events
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOfflineStatus);

    // Update status on tab/window close using sendBeacon
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Listen to real-time updates from Firestore
    const userStatusRef = firestore.collection('users').doc(user.uid);
    userStatusRef.onSnapshot(doc => {
      if (doc.exists) {
        const userStatus = doc.data().state;
        console.log('User status from Firestore:', userStatus); // Debug log

        if (userStatus === 'offline') {
          router.push('/');
        }
      }
    });
  } else {
    // If no user is logged in, restrict access to non-restricted pages
    const restrictedPages = ['login', 'signup', 'landing'];
    if (!restrictedPages.includes(router.currentRoute.value.name)) {
      router.push('/');
    }

    // If the user logs out, update their status to offline in Firestore
    if (logedinuser) {
      updateUserStatus(isOfflineForFirestore);  // Set the logged-in user's status to offline
      logedinuser = null;  // Clear the logged-in user reference
    }

    // Clean up event listeners when the user logs out
    window.removeEventListener('online', handleOnlineStatus);
    window.removeEventListener('offline', handleOfflineStatus);
    window.removeEventListener('beforeunload', handleBeforeUnload);
  }
});
