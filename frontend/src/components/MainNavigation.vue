<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const breadcrumbs = computed(() => {
  const pathParts = route.path.split('/').filter(Boolean)
  if (pathParts.length === 0) {
    return []
  }

  const labels: Record<string, string> = {
    race: 'Race',
    series: 'Series',
    boat: 'Boat',
    'boat-class': 'Boat classes',
    'race-class': 'Race classes',
    delete: 'Delete',
    create: 'Create',
  }

  let currentPath = ''
  const items = [
    {
      path: '/',
      name: 'Home',
      isLast: false,
    },
  ]

  pathParts.forEach((part, index) => {
    currentPath += `/${part}`
    const parsed = Number.parseInt(part, 10)
    items.push({
      path: currentPath,
      name: Number.isNaN(parsed) ? (labels[part] ?? part) : `#${parsed}`,
      isLast: index === pathParts.length - 1,
    })
  })

  return items
})
</script>

<template>
  <div>
    <nav class="main-nav">
      <RouterLink class="nav-link" to="/race">Race</RouterLink>
      <RouterLink class="nav-link" to="/series">Series</RouterLink>
      <RouterLink class="nav-link" to="/boat">Boat</RouterLink>

      <div aria-label="Classes" class="dropdown" role="group">
        <button class="dropbtn" type="button">Classes</button>
        <div class="dropdown-content">
          <RouterLink class="dropdown-link" to="/boat-class">Boat classes</RouterLink>
          <RouterLink class="dropdown-link" to="/race-class">Race classes</RouterLink>
        </div>
      </div>
    </nav>

    <nav v-if="breadcrumbs.length > 0" class="breadcrumb-nav">
      <template v-for="(item, index) in breadcrumbs" :key="item.path">
        <RouterLink :class="{ last: item.isLast }" :to="item.path" class="breadcrumb-link">
          {{ item.name }}
        </RouterLink>
        <span v-if="index < breadcrumbs.length - 1" class="separator">/</span>
      </template>
    </nav>
  </div>
</template>

<style scoped>
.main-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1rem;
  background-color: var(--color-background-soft);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.nav-link,
.dropbtn,
.dropdown-link {
  text-decoration: none;
  color: var(--color-text);
  font-size: 1rem;
  font-weight: 600;
  text-transform: capitalize;
}

.dropdown {
  position: relative;
}

.dropbtn {
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  padding: 0.2rem 0.6rem;
  cursor: pointer;
}

.dropdown-content {
  display: none;
  position: absolute;
  right: 0;
  min-width: 180px;
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 0.4rem;
}

.dropdown:hover .dropdown-content {
  display: block;
}

.dropdown-link {
  display: block;
  padding: 0.35rem 0.5rem;
  border-radius: 6px;
}

.dropdown-link:hover {
  background: hsla(160, 100%, 37%, 0.15);
}

.breadcrumb-nav {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid var(--color-border);
  background-color: #ffffff;
}

.breadcrumb-link {
  color: #000000;
  text-decoration: none;
}

.breadcrumb-link.last {
  opacity: 0.75;
  pointer-events: none;
}

.separator {
  color: #000000;
}
</style>
