<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { boatClasses } from '../../data/boatClasses'

const route = useRoute()
const router = useRouter()

const classId = computed(() => Number.parseInt(String(route.params.id), 10))
const boatClass = computed(() => {
  if (Number.isNaN(classId.value)) {
    return undefined
  }
  return boatClasses.find((item) => item.id === classId.value)
})

function confirmDelete() {
  router.push({ name: 'boat-class' })
}
</script>

<template>
  <section class="container mt-3">
    <h1>Delete boat class</h1>

    <div v-if="!boatClass" class="alert alert-warning mt-3">Boat class not found.</div>

    <div v-else class="card mt-3">
      <div class="card-body">
        <p class="mb-2"><strong>#:</strong> {{ boatClass.id }}</p>
        <p class="mb-2"><strong>Name:</strong> {{ boatClass.name }}</p>
        <p class="text-danger">Prototype UX: confirmation returns to index only.</p>

        <button class="btn btn-danger mr-2" type="button" @click="confirmDelete">Delete</button>
        <RouterLink class="btn btn-outline-secondary" :to="{ name: 'boat-class' }">Cancel</RouterLink>
      </div>
    </div>
  </section>
</template>


