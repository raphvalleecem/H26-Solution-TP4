<script lang="ts" setup>
const topTiles = [
  { label: 'Race', path: '/race' },
  { label: 'Series', path: '/series' },
]

const bottomTiles = [
  { label: 'Boat', path: '/boat' },
  { label: 'Boat classes', path: '/boat-class' },
  { label: 'Race classes', path: '/race-class' },
]
</script>

<template>
  <main class="home-container">
    <div class="tile-row">
      <router-link v-for="tile in topTiles" :key="tile.path" :to="tile.path" class="tile">
        {{ tile.label }}
      </router-link>
    </div>
    <div class="tile-row">
      <router-link v-for="tile in bottomTiles" :key="tile.path" :to="tile.path" class="tile">
        {{ tile.label }}
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

  /* Garde un contraste stable (texte fonce sur tuiles claires), meme en dark mode OS */
  --tile-bg-color: hsl(160 70% 92%);
  --tile-bg-hover-color: hsl(160 70% 86%);
  --tile-text-color: #1f2937;
}

.tile-row {
  display: flex;
  justify-content: center;
  gap: 1rem;
  width: 100%;
  margin: 0 auto;
}

.tile {
  flex: 1;
  min-height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--tile-bg-color);
  border: 2px solid hsla(160, 100%, 37%, 1);
  border-radius: 12px;
  text-decoration: none;
  color: var(--tile-text-color);
  font-size: 1.35rem;
  font-weight: 700;
  transition: all 0.3s ease;
}

.tile:hover {
  background-color: var(--tile-bg-hover-color);
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>
