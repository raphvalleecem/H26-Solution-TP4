<script lang="ts" setup>
import { useRouter } from 'vue-router'
import BoatForm from '../../components/BoatForm.vue'

const router = useRouter()

function createBoat(payload: {
  name: string
  boatClassId: number
  sailNumber: number
  helmName: string
}) {
  window.alert(`Boat created: ${payload.name}`)
  router.push({ name: 'boat' })
}

function cancel() {
  router.push({ name: 'boat' })
}
</script>

<template>
  <BoatForm title="Create boat" submit-label="Create" @submit="createBoat" @cancel="cancel" />
</template>
