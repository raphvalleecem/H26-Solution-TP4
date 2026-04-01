<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { deleteSeries, findSeriesById } from '../../data/series'

const route = useRoute()
const router = useRouter()

const seriesId = computed(() => Number.parseInt(String(route.params.id), 10))
const seriesItem = computed(() => (Number.isNaN(seriesId.value) ? undefined : findSeriesById(seriesId.value)))

function confirmDelete() {
  if (!seriesItem.value) {
    return
  }

  deleteSeries(seriesItem.value.id)
  router.push({ name: 'series' })
}
</script>

<template>
  <section class="container mt-3">
    <h1>Delete series</h1>

    <div v-if="!seriesItem" class="alert alert-warning mt-3">Series not found.</div>

    <div v-else class="card mt-3">
      <div class="card-body">
        <p class="mb-2"><strong>ID:</strong> {{ seriesItem.id }}</p>
        <p class="mb-2"><strong>Name:</strong> {{ seriesItem.name }}</p>
        <p class="text-danger">This action cannot be undone.</p>

        <button class="btn btn-danger mr-2" type="button" @click="confirmDelete">Delete</button>
        <RouterLink class="btn btn-outline-secondary" :to="{ name: 'series' }">Cancel</RouterLink>
      </div>
    </div>
  </section>
</template>

