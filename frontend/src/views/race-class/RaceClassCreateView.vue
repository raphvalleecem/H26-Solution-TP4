<script lang="ts" setup>
import { useRouter } from 'vue-router'
import ClassForm from '../../components/ClassForm.vue'
import { addRaceClass } from '@/data/raceClasses'

const router = useRouter()

async function createClass(payload: {
  name: string
  minHandicap: number
  maxHandicap: number
  handicapTypeId: number
  raceClassTypeId: number
}) {
  await addRaceClass(payload)
  router.push({ name: 'race-class' })
}

function cancel() {
  router.push({ name: 'race-class' })
}
</script>

<template>
  <ClassForm
    submit-label="Create"
    title="Create race class"
    @cancel="cancel"
    @submit-class="createClass"
  />
</template>
