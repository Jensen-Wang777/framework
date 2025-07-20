import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/counter'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  // 初始化用户状态
  if (!userStore.user && userStore.token) {
    userStore.initializeUser()
  }

  // 需要登录的页面
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    next('/login')
    return
  }

  // 已登录用户访问登录/注册页面，重定向到用户资料页
  if (to.meta.requiresGuest && userStore.isLoggedIn) {
    next('/profile')
    return
  }

  next()
})

export default router
