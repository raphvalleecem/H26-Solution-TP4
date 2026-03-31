<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BoatForm from '../components/BoatForm.vue'
import { findBoatById } from '../data/boats'

const route = useRoute()
const router = useRouter()

const boatId = computed(() => Number.parseInt(String(route.params.id), 10))
const boat = computed(() => (Number.isNaN(boatId.value) ? undefined : findBoatById(boatId.value)))

function updateBoat(payload: {
  nom: string
  classe: string
  numeroVoile: string
  barreur: string
}) {
  if (!boat.value) {
    return
  }

  window.alert(`Boat #${boat.value.id} updated: ${payload.nom}`)
  router.push({ name: 'boat' })
}

function cancel() {
  router.push({ name: 'boat' })
}
</script>

<template>
  <section v-if="!boat" class="container mt-3">
    <h1>Boat not found</h1>
    <RouterLink class="btn btn-secondary" :to="{ name: 'boat' }">Back to list</RouterLink>
  </section>

  <BoatForm
    v-else
    title="Edit boat"
    submit-label="Save"
    :initial-value="{
      nom: boat.nom,
      classe: boat.classe,
      numeroVoile: boat.numeroVoile,
      barreur: boat.barreur,
    }"
    @submit="updateBoat"
    @cancel="cancel"
  />
</template>

