<script lang="ts" setup>
import { useRouter } from 'vue-router'
import SeriesForm from '../../components/SeriesForm.vue'
import { addSeries } from '../../data/series'

const router = useRouter()

function createSeries(payload: {
  name: string
  nbRaces: number
  nbRacesToCount: number
  raceClassId: number
}) {
  addSeries(payload)
  router.push({ name: 'series' })
}

function cancel() {
  router.push({ name: 'series' })
}
</script>

<template>
  <SeriesForm title="Create series" submit-label="Create" @submit="createSeries" @cancel="cancel" />
</template>

