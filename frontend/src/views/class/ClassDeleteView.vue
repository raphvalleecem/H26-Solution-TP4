<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { deleteRaceClass, findRaceClassById } from '../../data/classes'

const route = useRoute()
const router = useRouter()

const classId = computed(() => Number.parseInt(String(route.params.id), 10))
const raceClass = computed(() => (Number.isNaN(classId.value) ? undefined : findRaceClassById(classId.value)))

function confirmDelete() {
  if (!raceClass.value) {
    return
  }

  deleteRaceClass(raceClass.value.id)
  router.push({ name: 'class' })
}
</script>

<template>
  <section class="container mt-3">
    <h1>Delete class</h1>

    <div v-if="!raceClass" class="alert alert-warning mt-3">Class not found.</div>

    <div v-else class="card mt-3">
      <div class="card-body">
        <p class="mb-2"><strong>ID:</strong> {{ raceClass.id }}</p>
        <p class="mb-2"><strong>Name:</strong> {{ raceClass.name }}</p>
        <p class="text-danger">This action cannot be undone.</p>

        <button class="btn btn-danger mr-2" type="button" @click="confirmDelete">Delete</button>
        <RouterLink class="btn btn-outline-secondary" :to="{ name: 'class' }">Cancel</RouterLink>
      </div>
    </div>
  </section>
</template>

