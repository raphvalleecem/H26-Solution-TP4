<script lang="ts" setup>
import { useRouter } from 'vue-router'
import SeriesForm from '../../components/SeriesForm.vue'
import { addSeries } from '@/models/series.ts'

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
  <SeriesForm submit-label="Create" title="Create series" @cancel="cancel" @submit="createSeries" />
</template>
