<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import RaceForm from '../../components/RaceForm.vue'
import { addRace } from '../../data/races'
import { getRaceClasses, type RaceClass } from '../../data/raceClasses'
import { getSeries, type SeriesRow } from '../../data/series'

const router = useRouter()
const raceClasses = ref<RaceClass[]>([])
const seriesRows = ref<SeriesRow[]>([])

onMounted(async () => {
  raceClasses.value = await getRaceClasses()
  seriesRows.value = await getSeries()
})

async function createRace(payload: {
  name: string
  date: string
  startTime: string
  course: string
  raceClassId: number
  seriesId: number
}) {
  await addRace(payload)
  await router.push({ name: 'race' })
}

function cancel() {
  router.push({ name: 'race' })
}
</script>

<template>
  <RaceForm
    :race-classes="raceClasses"
    :series-rows="seriesRows"
    submit-label="Create"
    title="Create race"
    @cancel="cancel"
    @submit="createRace"
  />
</template>
