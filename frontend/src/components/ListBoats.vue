<script setup lang="ts">
import { onMounted, ref } from 'vue'
import axios from 'axios'

interface ApiBoat {
  id?: number
  name?: string
  imageUrl?: string
  yacht?: string
  owner?: string
}

interface DisplayBoat {
  id: number
  displayName: string
  owner: string
  imageUrl: string
}

const bateaux = ref<DisplayBoat[]>([])

function afficherBateaux() {
  // Remplacez l'URL par celle de votre backend Express
  axios
    .get('http://localhost:3000/boats')
    .then((response) => {
      const data = Array.isArray(response.data) ? (response.data as ApiBoat[]) : []
      bateaux.value = data.map((boat, index) => ({
        id: boat.id ?? index,
        displayName: boat.name ?? boat.yacht ?? 'Sans nom',
        owner: boat.owner ?? '',
        imageUrl: boat.imageUrl ?? '',
      }))
    })
    .catch((error) => {
      console.error('Erreur récupération bateaux:', error)
    })
}

onMounted(() => {
  afficherBateaux()
})
</script>

<template>
  <div class="boats-container">
    <h1>Liste bateaux</h1>
    <ul>
      <li v-for="bateau in bateaux" :key="bateau.id">
        <p><strong>ID:</strong> {{ bateau.id }}</p>
        <p><strong>Nom:</strong> {{ bateau.displayName }}</p>
        <p><strong>Proprietaire:</strong> {{ bateau.owner || 'Non renseigne' }}</p>
        <p><strong>Image URL:</strong> {{ bateau.imageUrl || 'Non renseignee' }}</p>
        <img
          v-if="bateau.imageUrl"
          :src="bateau.imageUrl"
          :alt="`Image du bateau ${bateau.displayName}`"
          class="boat-image"
        />
      </li>
    </ul>
  </div>
</template>

<style scoped>
.boats-container ul {
  list-style: none;
  padding: 0;
}

.boats-container li {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
}

.boats-container p {
  margin: 4px 0;
}

.boat-image {
  margin-top: 8px;
  max-width: 220px;
  border-radius: 6px;
}
</style>
