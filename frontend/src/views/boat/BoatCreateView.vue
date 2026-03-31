<script lang="ts" setup>
import { useRouter } from 'vue-router'
import BoatForm from '../../components/BoatForm.vue'

const router = useRouter()

function createBoat(payload: {
  nom: string
  classe: string
  numeroVoile: string
  barreur: string
}) {
  window.alert(`Boat created: ${payload.nom}`)
  router.push({ name: 'boat' })
}

function cancel() {
  router.push({ name: 'boat' })
}
</script>

<template>
  <BoatForm title="Create boat" submit-label="Create" @submit="createBoat" @cancel="cancel" />
</template>


