<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import RaceForm from '../../components/RaceForm.vue'
import { findRaceById, updateRace } from '../../data/races'

const route = useRoute()
const router = useRouter()

const raceId = computed(() => Number.parseInt(String(route.params.id), 10))
const race = computed(() => (Number.isNaN(raceId.value) ? undefined : findRaceById(raceId.value)))

function saveRace(payload: {
  name: string
  date: string
  startTime: string
  course: string
  raceClassId: number
}) {
  if (!race.value) {
    return
  }

  updateRace(race.value.id, payload)
  router.push({ name: 'race' })
}

function cancel() {
  router.push({ name: 'race' })
}
</script>

<template>
  <section v-if="!race" class="container mt-3">
    <h1>Race not found</h1>
    <RouterLink class="btn btn-secondary" :to="{ name: 'race' }">Back to list</RouterLink>
  </section>

  <RaceForm
    v-else
    title="Edit race"
    submit-label="Save"
    :initial-value="{
      name: race.name,
      date: race.date,
      startTime: race.startTime,
      course: race.course,
      raceClassId: race.raceClassId,
    }"
    @submit="saveRace"
    @cancel="cancel"
  />
</template>

