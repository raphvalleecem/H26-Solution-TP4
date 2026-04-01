<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { deleteRace, findRaceById } from '../../data/races'

const route = useRoute()
const router = useRouter()

const raceId = computed(() => Number.parseInt(String(route.params.id), 10))
const race = computed(() => (Number.isNaN(raceId.value) ? undefined : findRaceById(raceId.value)))

function confirmDelete() {
  if (!race.value) {
    return
  }

  deleteRace(race.value.id)
  router.push({ name: 'race' })
}
</script>

<template>
  <section class="container mt-3">
    <h1>Delete race</h1>

    <div v-if="!race" class="alert alert-warning mt-3">Race not found.</div>

    <div v-else class="card mt-3">
      <div class="card-body">
        <p class="mb-2"><strong>ID:</strong> {{ race.id }}</p>
        <p class="mb-2"><strong>Name:</strong> {{ race.name }}</p>
        <p class="text-danger">This action cannot be undone.</p>

        <button class="btn btn-danger mr-2" type="button" @click="confirmDelete">Delete</button>
        <RouterLink class="btn btn-outline-secondary" :to="{ name: 'race' }">Cancel</RouterLink>
      </div>
    </div>
  </section>
</template>

