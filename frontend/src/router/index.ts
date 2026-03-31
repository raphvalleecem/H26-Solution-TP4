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
      component: () => import('../views/RaceView.vue'),
    },
    {
      path: '/entry',
      name: 'entry',
      component: () => import('../views/EntryView.vue'),
    },
    {
      path: '/series',
      name: 'series',
      component: () => import('../views/SeriesView.vue'),
    },
    {
      path: '/boat',
      name: 'boat',
      component: () => import('../views/BoatsView.vue'),
    },
    {
      path: '/boat/create',
      name: 'boat-create',
      component: () => import('../views/BoatCreateView.vue'),
    },
    {
      path: '/boat/edit/:id',
      name: 'boat-edit',
      component: () => import('../views/BoatEditView.vue'),
    },
    {
      path: '/boat/delete/:id',
      name: 'boat-delete',
      component: () => import('../views/BoatDeleteView.vue'),
    },
    {
      path: '/class',
      name: 'class',
      component: () => import('../views/ClassView.vue'),
    },
  ],
})

export default router
