<script lang="ts" setup>
import { reactive } from 'vue'
import { boats } from '../data/boats'
import type { RaceEntryRow } from '../data/entries'
import { races } from '../data/races'

type RaceEntryFormPayload = Omit<RaceEntryRow, 'id'>

const props = withDefaults(
  defineProps<{
    title: string
    submitLabel: string
    initialValue?: RaceEntryFormPayload
  }>(),
  {
    initialValue: () => ({
      boatId: 1,
      raceId: 1,
    }),
  },
)

const emit = defineEmits<{
  submit: [value: RaceEntryFormPayload]
  cancel: []
}>()

const form = reactive<RaceEntryFormPayload>({ ...props.initialValue })

function onSubmit() {
  emit('submit', { ...form })
}
</script>

<template>
  <section class="container mt-3">
    <h1 class="mb-3">{{ title }}</h1>

    <form @submit.prevent="onSubmit">
      <div class="form-group">
        <label for="entry-boat-id">Boat</label>
        <select id="entry-boat-id" v-model.number="form.boatId" class="form-control" required>
          <option v-for="boat in boats" :key="boat.id" :value="boat.id">{{ boat.nom }}</option>
        </select>
      </div>

      <div class="form-group">
        <label for="entry-race-id">Race</label>
        <select id="entry-race-id" v-model.number="form.raceId" class="form-control" required>
          <option v-for="race in races" :key="race.id" :value="race.id">{{ race.name }}</option>
        </select>
      </div>

      <div class="d-flex">
        <button class="btn btn-primary mr-2" type="submit">{{ submitLabel }}</button>
        <button class="btn btn-outline-secondary" type="button" @click="emit('cancel')">Cancel</button>
      </div>
    </form>
  </section>
</template>

