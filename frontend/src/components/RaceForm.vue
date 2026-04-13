<script lang="ts" setup>
import { reactive } from 'vue'
import type { RaceClass } from '../data/raceClasses'
import type { SeriesRow } from '../data/series'

type RaceFormPayload = {
  name: string
  date: string
  startTime: string
  course: string
  raceClassId: number
  seriesId: number
  isCompleted?: boolean
}

const props = withDefaults(
  defineProps<{
    title: string
    submitLabel: string
    initialValue?: RaceFormPayload
    raceClasses: RaceClass[]
    seriesRows: SeriesRow[]
  }>(),
  {
    initialValue: () => ({
      name: '',
      date: '',
      startTime: '',
      course: '',
      raceClassId: 1,
      seriesId: 1,
      isCompleted: false,
    }),
  },
)

const emit = defineEmits<{
  submit: [value: RaceFormPayload]
  cancel: []
}>()

const form = reactive<RaceFormPayload>({ ...props.initialValue })

function onSubmit() {
  emit('submit', { ...form })
}
</script>

<template>
  <section class="container mt-3">
    <h1 class="mb-3">{{ title }}</h1>

    <form @submit.prevent="onSubmit">
      <div class="form-group">
        <label for="race-name">Name</label>
        <input id="race-name" v-model.trim="form.name" class="form-control" required type="text" />
      </div>

      <div class="form-group">
        <label for="race-date">Date</label>
        <input id="race-date" v-model="form.date" class="form-control" required type="date" />
      </div>

      <div class="form-group">
        <label for="race-start-time">Start time</label>
        <input
          id="race-start-time"
          v-model="form.startTime"
          class="form-control"
          required
          type="time"
        />
      </div>

      <div class="form-group">
        <label for="race-course">Course</label>
        <input
          id="race-course"
          v-model.trim="form.course"
          class="form-control"
          required
          type="text"
        />
      </div>

      <div class="form-group">
        <label for="race-class-id">Race class</label>
        <select id="race-class-id" v-model.number="form.raceClassId" class="form-control" required>
          <option v-for="item in raceClasses" :key="item.id" :value="item.id">
            {{ item.name }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="series-id">Series</label>
        <select id="series-id" v-model.number="form.seriesId" class="form-control" required>
          <option v-for="item in seriesRows" :key="item.id" :value="item.id">
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
