<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'

const router = useRouter()
const route = useRoute()
const allowedRouteNames = new Set(['race', 'entry', 'series', 'boat', 'class'])
const routes = router
  .getRoutes()
  .filter((route) => route.name && allowedRouteNames.has(String(route.name)))

const breadcrumbs = computed(() => {
  if (route.name === 'home') return []
  const pathParts = route.path.split('/')
  if (pathParts.length <= 1) return []

  const items: { name: string; path: string; isLast: boolean }[] = []
  let currentPath = ''

  pathParts.forEach((part, index) => {
    currentPath += `/${part}`
    const routeMatch = router.getRoutes().find((r) => r.path === currentPath)
    items.push({
      name: (routeMatch?.name as string) || part,
      path: currentPath,
      isLast: index === pathParts.length - 1,
    })
  })

  return items
})
</script>

<template>
  <div>
    <nav class="main-nav">
      <router-link v-for="route in routes" :key="route.name" :to="route.path" class="nav-link">
        {{ route.name }}
      </router-link>
    </nav>
    <nav v-if="breadcrumbs.length > 0" class="breadcrumb-nav">
      <template v-for="(item, index) in breadcrumbs" :key="item.path">
        <router-link :class="{ last: item.isLast }" :to="item.path" class="breadcrumb-link">
          {{ item.name }}
        </router-link>
        <span v-if="index < breadcrumbs.length - 1" class="separator">/</span>
      </template>
    </nav>
  </div>
</template>

<style scoped>
.main-nav {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  padding: 1rem;
  background-color: var(--color-background-soft);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.nav-link {
  text-decoration: none;
  color: var(--color-text);
  font-size: 1.1rem;
  font-weight: 500;
  text-transform: capitalize;
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: hsla(160, 100%, 37%, 1);
}

.nav-link.router-link-active {
  color: hsla(160, 100%, 37%, 1);
  font-weight: bold;
}

.breadcrumb-nav {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: var(--color-background);
  font-size: 0.9rem;
  border-bottom: 1px solid var(--color-border);
}

.breadcrumb-link {
  text-decoration: none;
  color: var(--color-text);
  text-transform: capitalize;
}

.breadcrumb-link:hover:not(.last) {
  text-decoration: underline;
  color: hsla(160, 100%, 37%, 1);
}

.breadcrumb-link.last {
  opacity: 0.6;
  pointer-events: none;
  font-weight: bold;
}

.separator {
  color: var(--color-border);
}
</style>
