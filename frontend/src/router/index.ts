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
      path: '/race/edit/:id',
      name: 'race-edit',
      component: () => import('../views/race/RaceEditView.vue'),
    },
    {
      path: '/race/delete/:id',
      name: 'race-delete',
      component: () => import('../views/race/RaceDeleteView.vue'),
    },
    {
      path: '/entry',
      name: 'entry',
      component: () => import('../views/entry/EntryView.vue'),
    },
    {
      path: '/entry/create',
      name: 'entry-create',
      component: () => import('../views/entry/EntryCreateView.vue'),
    },
    {
      path: '/entry/edit/:id',
      name: 'entry-edit',
      component: () => import('../views/entry/EntryEditView.vue'),
    },
    {
      path: '/entry/delete/:id',
      name: 'entry-delete',
      component: () => import('../views/entry/EntryDeleteView.vue'),
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
      path: '/series/edit/:id',
      name: 'series-edit',
      component: () => import('../views/series/SeriesEditView.vue'),
    },
    {
      path: '/series/delete/:id',
      name: 'series-delete',
      component: () => import('../views/series/SeriesDeleteView.vue'),
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
    {
      path: '/class/create',
      name: 'class-create',
      component: () => import('../views/class/ClassCreateView.vue'),
    },
    {
      path: '/class/edit/:id',
      name: 'class-edit',
      component: () => import('../views/class/ClassEditView.vue'),
    },
    {
      path: '/class/delete/:id',
      name: 'class-delete',
      component: () => import('../views/class/ClassDeleteView.vue'),
    },
  ],
})

export default router
