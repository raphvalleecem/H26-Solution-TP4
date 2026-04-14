<script lang="ts" setup>
import { reactive } from 'vue'
import { raceClasses } from '../models/raceClasses'

type SeriesFormPayload = {
  name: string
  nbRaces: number
  nbRacesToCount: number
  raceClassId: number
  isCompleted?: boolean
}

const props = withDefaults(
  defineProps<{
    title: string
    submitLabel: string
    initialValue?: SeriesFormPayload
  }>(),
  {
    initialValue: () => ({
      name: '',
      nbRaces: 1,
      nbRacesToCount: 1,
      raceClassId: 1,
      isCompleted: false,
    }),
  },
)

const emit = defineEmits<{
  submit: [value: SeriesFormPayload]
  cancel: []
}>()

const form = reactive<SeriesFormPayload>({ ...props.initialValue })

function onSubmit() {
  emit('submit', { ...form })
}
</script>

<template>
  <section class="container mt-3">
    <h1 class="mb-3">{{ title }}</h1>

    <form @submit.prevent="onSubmit">
      <div class="form-group">
        <label for="series-name">Name</label>
        <input
          id="series-name"
          v-model.trim="form.name"
          class="form-control"
          required
          type="text"
        />
      </div>

      <div class="form-group">
        <label for="series-nb-races">Number of races</label>
        <input
          id="series-nb-races"
          v-model.number="form.nbRaces"
          class="form-control"
          min="1"
          required
          type="number"
        />
      </div>

      <div class="form-group">
        <label for="series-nb-races-count">Number of races to count</label>
        <input
          id="series-nb-races-count"
          v-model.number="form.nbRacesToCount"
          class="form-control"
          min="1"
          required
          type="number"
        />
      </div>

      <div class="form-group">
        <label for="series-race-class-id">Race class</label>
        <select
          id="series-race-class-id"
          v-model.number="form.raceClassId"
          class="form-control"
          required
        >
          <option v-for="item in raceClasses" :key="item.id" :value="item.id">
            {{ item.name }}
          </option>
        </select>
      </div>

      <div class="d-flex">
        <button class="btn btn-primary mr-2" type="submit">{{ submitLabel }}</button>
        <button class="btn btn-outline-secondary" type="button" @click="emit('cancel')">
          Cancel
        </button>
      </div>
    </form>
  </section>
</template>
