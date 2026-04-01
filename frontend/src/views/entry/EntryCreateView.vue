<script lang="ts" setup>
import { useRouter } from 'vue-router'
import RaceEntryForm from '../../components/RaceEntryForm.vue'
import { addRaceEntry } from '../../data/entries'

const router = useRouter()

function createEntry(payload: { boatId: number; raceId: number }) {
  addRaceEntry(payload)
  router.push({ name: 'entry' })
}

function cancel() {
  router.push({ name: 'entry' })
}
</script>

<template>
  <RaceEntryForm title="Create race entry" submit-label="Create" @submit="createEntry" @cancel="cancel" />
</template>

