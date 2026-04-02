<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { findBoatById } from '../../data/boats'

const route = useRoute()
const router = useRouter()

const boatId = computed(() => Number.parseInt(String(route.params.id), 10))
const boat = computed(() => (Number.isNaN(boatId.value) ? undefined : findBoatById(boatId.value)))

function confirmDelete() {
  router.push({ name: 'boat' })
}
</script>

<template>
  <section class="container mt-3">
    <h1>Delete boat</h1>

    <div v-if="!boat" class="alert alert-warning mt-3">Boat not found.</div>

    <div v-else class="card mt-3">
      <div class="card-body">
        <p class="mb-2"><strong>#:</strong> {{ boat.id }}</p>
        <p class="mb-2"><strong>Name:</strong> {{ boat.name }}</p>
        <p class="mb-2"><strong>Sail:</strong> {{ boat.sailNumber }}</p>
        <p class="mb-3"><strong>Helm:</strong> {{ boat.helmName }}</p>
        <p class="text-danger">Prototype UX: confirmation returns to index only.</p>

        <button class="btn btn-danger mr-2" type="button" @click="confirmDelete">Delete</button>
        <RouterLink class="btn btn-outline-secondary" :to="{ name: 'boat' }">Cancel</RouterLink>
      </div>
    </div>
  </section>
</template>
