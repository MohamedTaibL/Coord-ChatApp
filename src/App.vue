<template>
  <LeftNavBar v-if="boolean" class="NavBar"/>
  <router-view class="router-view" />
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
    boolean.value = !restrictedRoutes.value.includes(to.name)
  },
)

onMounted(() =>{
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
  display: flex;
  flex-direction: row;
  height: 100vh;
  overflow: hidden; /* Keep this to prevent global scrollbars */
}

.router-view {
  flex: 2;
  overflow-y: auto; /* Allow vertical scrolling inside router-view */
  overflow-x: hidden;
  height: 100vh; /* Ensure full height for consistent scroll */
}
</style>