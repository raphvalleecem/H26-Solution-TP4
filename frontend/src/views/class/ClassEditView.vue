<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ClassForm from '../../components/ClassForm.vue'
import { findRaceClassById, updateRaceClass } from '../../data/classes'

const route = useRoute()
const router = useRouter()

const classId = computed(() => Number.parseInt(String(route.params.id), 10))
const raceClass = computed(() => (Number.isNaN(classId.value) ? undefined : findRaceClassById(classId.value)))

function saveClass(payload: {
  name: string
  minHandicap: number
  maxHandicap: number
  handicapTypeId: number
  raceClassTypeId: number
}) {
  if (!raceClass.value) {
    return
  }

  updateRaceClass(raceClass.value.id, payload)
  router.push({ name: 'class' })
}

function cancel() {
  router.push({ name: 'class' })
}
</script>

<template>
  <section v-if="!raceClass" class="container mt-3">
    <h1>Class not found</h1>
    <RouterLink class="btn btn-secondary" :to="{ name: 'class' }">Back to list</RouterLink>
  </section>

  <ClassForm
    v-else
    title="Edit class"
    submit-label="Save"
    :initial-value="{
      name: raceClass.name,
      minHandicap: raceClass.minHandicap,
      maxHandicap: raceClass.maxHandicap,
      handicapTypeId: raceClass.handicapTypeId,
      raceClassTypeId: raceClass.raceClassTypeId,
    }"
    @submit="saveClass"
    @cancel="cancel"
  />
</template>

