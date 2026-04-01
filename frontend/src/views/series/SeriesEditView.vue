<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SeriesForm from '../../components/SeriesForm.vue'
import { findSeriesById, updateSeries } from '../../data/series'

const route = useRoute()
const router = useRouter()

const seriesId = computed(() => Number.parseInt(String(route.params.id), 10))
const seriesItem = computed(() => (Number.isNaN(seriesId.value) ? undefined : findSeriesById(seriesId.value)))

function saveSeries(payload: {
  name: string
  nbRaces: number
  nbRacesToCount: number
  raceClassId: number
}) {
  if (!seriesItem.value) {
    return
  }

  updateSeries(seriesItem.value.id, payload)
  router.push({ name: 'series' })
}

function cancel() {
  router.push({ name: 'series' })
}
</script>

<template>
  <section v-if="!seriesItem" class="container mt-3">
    <h1>Series not found</h1>
    <RouterLink class="btn btn-secondary" :to="{ name: 'series' }">Back to list</RouterLink>
  </section>

  <SeriesForm
    v-else
    title="Edit series"
    submit-label="Save"
    :initial-value="{
      name: seriesItem.name,
      nbRaces: seriesItem.nbRaces,
      nbRacesToCount: seriesItem.nbRacesToCount,
      raceClassId: seriesItem.raceClassId,
    }"
    @submit="saveSeries"
    @cancel="cancel"
  />
</template>

