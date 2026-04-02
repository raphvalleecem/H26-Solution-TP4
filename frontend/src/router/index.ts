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
      path: '/race/create',
      name: 'race-create',
      component: () => import('../views/race/RaceCreateView.vue'),
    },
    {
      path: '/race/delete/:id',
      name: 'race-delete',
      component: () => import('../views/race/RaceDeleteView.vue'),
    },
    {
      path: '/race/:id',
      name: 'race-details',
      component: () => import('../views/race/RaceDetailView.vue'),
    },
    {
      path: '/series',
      name: 'series',
      component: () => import('../views/series/SeriesView.vue'),
    },
    {
      path: '/series/create',
      name: 'series-create',
      component: () => import('../views/series/SeriesCreateView.vue'),
    },
    {
      path: '/series/delete/:id',
      name: 'series-delete',
      component: () => import('../views/series/SeriesDeleteView.vue'),
    },
    {
      path: '/series/:id',
      name: 'series-details',
      component: () => import('../views/series/SeriesDetailView.vue'),
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
      path: '/boat/delete/:id',
      name: 'boat-delete',
      component: () => import('../views/boat/BoatDeleteView.vue'),
    },
    {
      path: '/boat/:id',
      name: 'boat-details',
      component: () => import('../views/boat/BoatDetailView.vue'),
    },
    {
      path: '/boat-class',
      name: 'boat-class',
      component: () => import('../views/boat-class/BoatClassView.vue'),
    },
    {
      path: '/boat-class/create',
      name: 'boat-class-create',
      component: () => import('../views/boat-class/BoatClassCreateView.vue'),
    },
    {
      path: '/boat-class/delete/:id',
      name: 'boat-class-delete',
      component: () => import('../views/boat-class/BoatClassDeleteView.vue'),
    },
    {
      path: '/boat-class/:id',
      name: 'boat-class-details',
      component: () => import('../views/boat-class/BoatClassDetailView.vue'),
    },
    {
      path: '/race-class',
      name: 'race-class',
      component: () => import('../views/race-class/RaceClassView.vue'),
    },
    {
      path: '/race-class/create',
      name: 'race-class-create',
      component: () => import('../views/race-class/RaceClassCreateView.vue'),
    },
    {
      path: '/race-class/delete/:id',
      name: 'race-class-delete',
      component: () => import('../views/race-class/RaceClassDeleteView.vue'),
    },
    {
      path: '/race-class/:id',
      name: 'race-class-details',
      component: () => import('../views/race-class/RaceClassDetailView.vue'),
    },
  ],
})

export default router
