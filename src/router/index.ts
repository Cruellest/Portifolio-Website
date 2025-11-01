import { createRouter, createWebHistory } from 'vue-router'
import printResume from '../pages/print-resume.vue'
import Homepage from '../pages/Homepage.vue'

const routes = [


    {
      path: '/',
      name: 'Home',
      component: Homepage
    },
  {
    path: '/print-resume',
    name: 'PrintResume',
    component: printResume
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
