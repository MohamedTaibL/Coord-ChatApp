import { createRouter, createWebHashHistory } from 'vue-router'
import LandingView from '../views/LandingView.vue'

const routes = [
  {
    path: '/',
    name: 'landing',
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
  },
  {
    path :'/home',
    name : 'home',
    component : () => import('../views/HomeView.vue')
  },
  {
    path : '/community/:id',
    name : 'community',
    component : () => import('@/views/CommunityChatView.vue')
  },
  {
    path: '/private/:id',
    name : 'private',
    component : () => import('@/views/PrivateChatView.vue')
    
  },
  {
    path: '/createcommunity',
    name : 'createcommunity',
    component : () => import('@/views/CreateCommunityView.vue')
  },
  {
    path: '/creategroup',
    name: 'creategroup',
    component : () => import('@/views/CreateGroupView.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
