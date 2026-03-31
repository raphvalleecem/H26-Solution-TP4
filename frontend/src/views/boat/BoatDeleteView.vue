<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { findBoatById } from '../../data/boats'

const route = useRoute()
const router = useRouter()

const boatId = computed(() => Number.parseInt(String(route.params.id), 10))
const boat = computed(() => (Number.isNaN(boatId.value) ? undefined : findBoatById(boatId.value)))

function confirmDelete() {
  if (!boat.value) {
    return
  }

  window.alert(`Boat deleted: ${boat.value.nom}`)
  router.push({ name: 'boat' })
}
</script>

<template>
  <section class="container mt-3">
    <h1>Delete boat</h1>

    <div v-if="!boat" class="alert alert-warning mt-3">
      Boat not found.
    </div>

    <div v-else class="card mt-3">
      <div class="card-body">
        <p class="mb-2"><strong>Boat:</strong> {{ boat.nom }}</p>
        <p class="mb-2"><strong>Class:</strong> {{ boat.classe }}</p>
        <p class="mb-2"><strong>Sail:</strong> {{ boat.numeroVoile }}</p>
        <p class="mb-3"><strong>Helm:</strong> {{ boat.barreur }}</p>
        <p class="text-danger">This action cannot be undone.</p>

        <button class="btn btn-danger mr-2" type="button" @click="confirmDelete">Delete</button>
        <RouterLink class="btn btn-outline-secondary" :to="{ name: 'boat' }">Cancel</RouterLink>
      </div>
    </div>

    <RouterLink v-if="!boat" class="btn btn-secondary mt-2" :to="{ name: 'boat' }">
      Back to list
    </RouterLink>
  </section>
</template>


