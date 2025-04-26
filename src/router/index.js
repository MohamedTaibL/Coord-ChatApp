import { createRouter, createWebHashHistory } from 'vue-router'
import LandingView from '../views/LandingView.vue'
import { auth, db } from '@/Firebase/config' // Adjust the path if needed

// User state
let isLoggedIn = false

const routes = [
  {
    path: '/',
    name: 'landing',
    component: LandingView
  },
  {
    path: '/signup',
    name: 'signup',
    component: () => import('../views/SignView.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LogView.vue')
  },
  {
    path: '/community/:id?',
    name: 'community',
    component: () => import('@/views/CommunityChatView.vue')
  },
  {
    path: '/new/:id?',
    name: 'new',
    component: () => import('@/views/NewChatView.vue')
  },
  {
    path: '/private/:id?',
    name: 'private',
    component: () => import('@/views/PrivateChatView.vue')
  },
  {
    path: '/createcommunity',
    name: 'createcommunity',
    component: () => import('@/views/CreateCommunityView.vue')
  },
  {
    path: '/creategroup',
    name: 'creategroup',
    component: () => import('@/views/CreateGroupView.vue')
  },
  {
    path: '/viewprofile/:id',
    name: 'viewprofile',
    component: () => import('@/views/ProfileView.vue')
  },
  {
    path: '/editdetails/:id',
    name: 'editdetails',
    component: () => import('@/views/EditDetailsView.vue')
  },
  {
  path: '/detailsview/:id',
  name: 'detailsview',
    component: () => import('@/views/DetailsView.vue')
  },
  
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const publicPages = ['landing', 'signup', 'login']
  const isPublic = publicPages.includes(to.name)

  if (!isPublic) {
    if (!isLoggedIn) {
      next({ name: 'login' })
    } else {
      next()
    }
  } else {
    // 🛠 Important: public route, always allow
    next()
  }
})

// Auth listener
auth.onAuthStateChanged(async (user) => {
  if (user) {
    isLoggedIn = true
  } else {
    isLoggedIn = false
  }
})

export default router
