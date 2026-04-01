<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { deleteRaceEntry, findRaceEntryById } from '../../data/entries'

const route = useRoute()
const router = useRouter()

const entryId = computed(() => Number.parseInt(String(route.params.id), 10))
const entry = computed(() => (Number.isNaN(entryId.value) ? undefined : findRaceEntryById(entryId.value)))

function confirmDelete() {
  if (!entry.value) {
    return
  }

  deleteRaceEntry(entry.value.id)
  router.push({ name: 'entry' })
}
</script>

<template>
  <section class="container mt-3">
    <h1>Delete race entry</h1>

    <div v-if="!entry" class="alert alert-warning mt-3">Entry not found.</div>

    <div v-else class="card mt-3">
      <div class="card-body">
        <p class="mb-2"><strong>ID:</strong> {{ entry.id }}</p>
        <p class="mb-2"><strong>Boat ID:</strong> {{ entry.boatId }}</p>
        <p class="mb-2"><strong>Race ID:</strong> {{ entry.raceId }}</p>
        <p class="text-danger">This action cannot be undone.</p>

        <button class="btn btn-danger mr-2" type="button" @click="confirmDelete">Delete</button>
        <RouterLink class="btn btn-outline-secondary" :to="{ name: 'entry' }">Cancel</RouterLink>
      </div>
    </div>
  </section>
</template>

