import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { auth } from '@/Firebase/config';
import firebase from 'firebase/app';

let app;

auth.onAuthStateChanged(user => {
  if (!app) {
    app = createApp(App);
    app.use(router);
    app.mount('#app');
  }
}
)