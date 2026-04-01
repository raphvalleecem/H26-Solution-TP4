<script lang="ts" setup>
import { useRouter } from 'vue-router'
import ClassForm from '../../components/ClassForm.vue'
import { addRaceClass } from '../../data/classes'

const router = useRouter()

function createClass(payload: {
  name: string
  minHandicap: number
  maxHandicap: number
  handicapTypeId: number
  raceClassTypeId: number
}) {
  addRaceClass(payload)
  router.push({ name: 'class' })
}

function cancel() {
  router.push({ name: 'class' })
}
</script>

<template>
  <ClassForm title="Create class" submit-label="Create" @submit="createClass" @cancel="cancel" />
</template>

