<script lang="ts" setup>
import { useRouter } from 'vue-router'
import RaceForm from '../../components/RaceForm.vue'
import { addRace } from '../../data/races'

const router = useRouter()

function createRace(payload: {
  name: string
  date: string
  startTime: string
  course: string
  raceClassId: number
}) {
  addRace(payload)
  router.push({ name: 'race' })
}

function cancel() {
  router.push({ name: 'race' })
}
</script>

<template>
  <RaceForm title="Create race" submit-label="Create" @submit="createRace" @cancel="cancel" />
</template>

