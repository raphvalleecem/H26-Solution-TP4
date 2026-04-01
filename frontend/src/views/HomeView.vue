<script lang="ts" setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const homeRouteOrder = ['race', 'entry', 'series', 'boat', 'class'] as const
const routesByName = new Map(router.getRoutes().map((route) => [String(route.name), route]))
const routes = homeRouteOrder
  .map((routeName) => routesByName.get(routeName))
  .filter((route): route is NonNullable<typeof route> => Boolean(route))
const topRoutes = routes.slice(0, 2)
const bottomRoutes = routes.slice(2, 5)
</script>

<template>
  <main class="home-container">
    <div class="tile-row">
      <router-link v-for="route in topRoutes" :key="route.name" :to="route.path" class="tile">
        {{ route.name }}
      </router-link>
    </div>
    <div class="tile-row">
      <router-link v-for="route in bottomRoutes" :key="route.name" :to="route.path" class="tile">
        {{ route.name }}
      </router-link>
    </div>
  </main>
</template>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2rem;
  padding: 2rem 0;
  width: 100%;
  margin: 0 auto;
  flex: 1;
}

.tile-row {
  display: flex;
  justify-content: center;
  gap: 2rem;
  width: 100%;
  margin: 0 auto;
}

.tile {
  flex: 1;
  min-height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: hsla(160, 100%, 37%, 0.1);
  border: 2px solid hsla(160, 100%, 37%, 1);
  border-radius: 12px;
  text-decoration: none;
  color: var(--color-text);
  font-size: 1.5rem;
  font-weight: bold;
  text-transform: capitalize;
  transition: all 0.3s ease;
}

.tile:hover {
  background-color: hsla(160, 100%, 37%, 0.2);
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>
