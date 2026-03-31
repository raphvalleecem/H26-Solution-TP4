import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/race',
      name: 'race',
      component: () => import('../views/race/RaceView.vue'),
    },
    {
      path: '/entry',
      name: 'entry',
      component: () => import('../views/entry/EntryView.vue'),
    },
    {
      path: '/series',
      name: 'series',
      component: () => import('../views/series/SeriesView.vue'),
    },
    {
      path: '/boat',
      name: 'boat',
      component: () => import('../views/boat/BoatsView.vue'),
    },
    {
      path: '/boat/create',
      name: 'boat-create',
      component: () => import('../views/boat/BoatCreateView.vue'),
    },
    {
      path: '/boat/edit/:id',
      name: 'boat-edit',
      component: () => import('../views/boat/BoatEditView.vue'),
    },
    {
      path: '/boat/delete/:id',
      name: 'boat-delete',
      component: () => import('../views/boat/BoatDeleteView.vue'),
    },
    {
      path: '/class',
      name: 'class',
      component: () => import('../views/class/ClassView.vue'),
    },
  ],
})

export default router
