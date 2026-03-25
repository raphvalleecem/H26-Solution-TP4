<script setup lang="ts">
import { onMounted, ref } from 'vue'
import axios from 'axios'

interface Bateau {
  id: number
  yacht: string
  owner: string
}

const bateaux = ref<Bateau[]>([])

function afficherBateaux() {
  // Remplacez l'URL par celle de votre backend Express
  axios
    .get('http://localhost:3000/boats')
    .then((response) => {
      bateaux.value = response.data
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
      <li v-for="bateau in bateaux" :key="bateau.id">{{ bateau.yacht }} ({{ bateau.owner }})</li>
    </ul>
  </div>
</template>

<style scoped></style>
