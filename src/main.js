import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { auth } from './Firebase/config'

let app;

auth.onAuthStateChanged((state) => {
    if (!app) {
      app = createApp(App)
      app.use(router)
      app.mount('#app')
    }
    if(!state) {
        const names = ['login' , 'signup' , 'landing']
        if (!names.includes(router.currentRoute.value.name)){
            router.push("/")
        }
    }
});