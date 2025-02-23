import { createRouter, createWebHistory } from 'vue-router'
import ScrumScheduleView from '../views/ScrumScheduleView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: ScrumScheduleView,
    },
  ],
})

export default router
