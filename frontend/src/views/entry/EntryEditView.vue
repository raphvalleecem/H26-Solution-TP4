<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import RaceEntryForm from '../../components/RaceEntryForm.vue'
import { findRaceEntryById, updateRaceEntry } from '../../data/entries'

const route = useRoute()
const router = useRouter()

const entryId = computed(() => Number.parseInt(String(route.params.id), 10))
const entry = computed(() => (Number.isNaN(entryId.value) ? undefined : findRaceEntryById(entryId.value)))

function saveEntry(payload: { boatId: number; raceId: number }) {
  if (!entry.value) {
    return
  }

  updateRaceEntry(entry.value.id, payload)
  router.push({ name: 'entry' })
}

function cancel() {
  router.push({ name: 'entry' })
}
</script>

<template>
  <section v-if="!entry" class="container mt-3">
    <h1>Entry not found</h1>
    <RouterLink class="btn btn-secondary" :to="{ name: 'entry' }">Back to list</RouterLink>
  </section>

  <RaceEntryForm
    v-else
    title="Edit race entry"
    submit-label="Save"
    :initial-value="{
      boatId: entry.boatId,
      raceId: entry.raceId,
    }"
    @submit="saveEntry"
    @cancel="cancel"
  />
</template>

