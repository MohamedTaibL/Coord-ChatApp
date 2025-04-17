import { createRouter, createWebHashHistory } from 'vue-router'
import LandingView from '../views/LandingView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: LandingView
  },
  {
    path: '/signup',
    name: 'signup',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/SignView.vue')
  },
  {
    path : '/login',
    name : 'login',
    component : () => import('../views/LogView.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
