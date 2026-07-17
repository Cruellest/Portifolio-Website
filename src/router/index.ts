import { createRouter, createWebHistory } from 'vue-router'
import Homepage from '../pages/Homepage.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Homepage,
  },
  {
    path: '/print-resume',
    name: 'PrintResume',
    component: () => import('../pages/print-resume.vue'),
    // chrome: false hides the navbar and site background on print routes
    meta: { chrome: false },
  },
  {
    path: '/resume-ats',
    name: 'AtsResume',
    component: () => import('../pages/ats-resume.vue'),
    meta: { chrome: false },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
