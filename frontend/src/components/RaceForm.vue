<script lang="ts" setup>
import { reactive } from 'vue'
import { raceClasses } from '../data/classes'
import type { RaceRow } from '../data/races'

type RaceFormPayload = Omit<RaceRow, 'id'>

const props = withDefaults(
  defineProps<{
    title: string
    submitLabel: string
    initialValue?: RaceFormPayload
  }>(),
  {
    initialValue: () => ({
      name: '',
      date: '',
      startTime: '',
      course: '',
      raceClassId: 1,
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
        <input id="race-start-time" v-model="form.startTime" class="form-control" required type="time" />
      </div>

      <div class="form-group">
        <label for="race-course">Course</label>
        <input id="race-course" v-model.trim="form.course" class="form-control" required type="text" />
      </div>

      <div class="form-group">
        <label for="race-class-id">Race class</label>
        <select id="race-class-id" v-model.number="form.raceClassId" class="form-control" required>
          <option v-for="item in raceClasses" :key="item.id" :value="item.id">{{ item.name }}</option>
        </select>
      </div>

      <div class="d-flex">
        <button class="btn btn-primary mr-2" type="submit">{{ submitLabel }}</button>
        <button class="btn btn-outline-secondary" type="button" @click="emit('cancel')">Cancel</button>
      </div>
    </form>
  </section>
</template>

