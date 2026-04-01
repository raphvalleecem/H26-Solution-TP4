<script lang="ts" setup>
import { reactive } from 'vue'
import { handicapTypes, raceClassTypes } from '../data/classes'
import type { RaceClassRow } from '../data/classes'

type ClassFormPayload = Omit<RaceClassRow, 'id'>

const props = withDefaults(
  defineProps<{
    title: string
    submitLabel: string
    initialValue?: ClassFormPayload
  }>(),
  {
    initialValue: () => ({
      name: '',
      minHandicap: 0,
      maxHandicap: 0,
      handicapTypeId: 1,
      raceClassTypeId: 1,
    }),
  },
)

const emit = defineEmits<{
  submit: [value: ClassFormPayload]
  cancel: []
}>()

const form = reactive<ClassFormPayload>({ ...props.initialValue })

function onSubmit() {
  emit('submit', { ...form })
}
</script>

<template>
  <section class="container mt-3">
    <h1 class="mb-3">{{ title }}</h1>

    <form @submit.prevent="onSubmit">
      <div class="form-group">
        <label for="class-name">Name</label>
        <input id="class-name" v-model.trim="form.name" class="form-control" required type="text" />
      </div>

      <div class="form-group">
        <label for="min-handicap">Min handicap</label>
        <input id="min-handicap" v-model.number="form.minHandicap" class="form-control" required type="number" step="0.01" />
      </div>

      <div class="form-group">
        <label for="max-handicap">Max handicap</label>
        <input id="max-handicap" v-model.number="form.maxHandicap" class="form-control" required type="number" step="0.01" />
      </div>

      <div class="form-group">
        <label for="handicap-type">Handicap type</label>
        <select id="handicap-type" v-model.number="form.handicapTypeId" class="form-control" required>
          <option v-for="type in handicapTypes" :key="type.id" :value="type.id">{{ type.name }}</option>
        </select>
      </div>

      <div class="form-group">
        <label for="class-type">Race class type</label>
        <select id="class-type" v-model.number="form.raceClassTypeId" class="form-control" required>
          <option v-for="type in raceClassTypes" :key="type.id" :value="type.id">{{ type.name }}</option>
        </select>
      </div>

      <div class="d-flex">
        <button class="btn btn-primary mr-2" type="submit">{{ submitLabel }}</button>
        <button class="btn btn-outline-secondary" type="button" @click="emit('cancel')">Cancel</button>
      </div>
    </form>
  </section>
</template>

