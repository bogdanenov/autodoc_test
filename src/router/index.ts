import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Tables from '../views/Tables.vue'
import Charts from '../views/Charts.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Tables',
    component: Tables
  },
  {
    path: '/charts',
    name: 'Charts',
    component: Charts
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
