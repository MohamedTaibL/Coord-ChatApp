<template>
  <LeftNavBar v-if="boolean" />
  <router-view />
</template>

<script setup>
import LeftNavBar from './components/LeftNavBar.vue'
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const routername = ref(router.currentRoute.value.name)
const restrictedRoutes = ref(['signup', 'login', 'landing'])
const boolean = ref(false)

// Watch for route changes
watch(
  () => router.currentRoute.value,
  (to) => {
    
    routername.value = to.name
    console.log('Current route:', to.name)
    boolean.value = !restrictedRoutes.value.includes(to.name)
  },
)

onMounted(() =>{
  console.log("i got remounted")
  boolean.value = restrictedRoutes.value.includes(router.currentRoute.value.name)
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>