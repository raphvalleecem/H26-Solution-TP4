<script lang="ts" setup>
import { computed, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import DataTable from 'datatables.net-vue3'
import DataTablesCore from 'datatables.net-bs4'
import { boatClasses } from '../../data/boatClasses'
import { findBoatById } from '../../data/boats'
import { raceEntries } from '../../data/raceEntries'
import { races } from '../../data/races'
import { seriesEntries } from '../../data/seriesEntries'
import { seriesRows } from '../../data/series'

DataTable.use(DataTablesCore)

type BoatForm = {
  name: string
  sailNumber: number
  helmName: string
  boatClassId: number
}

const route = useRoute()
const boatId = computed(() => Number.parseInt(String(route.params.id), 10))
const boat = computed(() => (Number.isNaN(boatId.value) ? undefined : findBoatById(boatId.value)))

const isEditing = ref(false)
const form = reactive<BoatForm>({ name: '', sailNumber: 0, helmName: '', boatClassId: 0 })
const original = ref<BoatForm | null>(null)

if (boat.value) {
  const seed: BoatForm = {
    name: boat.value.name,
    sailNumber: boat.value.sailNumber,
    helmName: boat.value.helmName,
    boatClassId: boat.value.boatClassId,
  }
  original.value = seed
  Object.assign(form, seed)
}

const hasChanges = computed(() => {
  if (!original.value) {
    return false
  }
  return JSON.stringify(form) !== JSON.stringify(original.value)
})

const boatClassName = computed(() => {
  return boatClasses.find((item) => item.id === form.boatClassId)?.name ?? '-'
})

const raceList = computed(() => {
  if (!boat.value) {
    return []
  }
  return raceEntries
    .filter((entry) => entry.boatId === boat.value!.id)
    .map((entry) => races.find((race) => race.id === entry.raceId))
    .filter((race): race is NonNullable<typeof race> => Boolean(race))
})

const seriesList = computed(() => {
  if (!boat.value) {
    return []
  }
  return seriesEntries
    .filter((entry) => entry.boatId === boat.value!.id)
    .map((entry) => seriesRows.find((series) => series.id === entry.seriesId))
    .filter((series): series is NonNullable<typeof series> => Boolean(series))
})

function startEdit() {
  isEditing.value = true
}

function cancelEdit() {
  if (original.value) {
    Object.assign(form, original.value)
  }
  isEditing.value = false
}

function saveChanges() {
  if (!hasChanges.value) {
    return
  }
  original.value = { ...form }
  isEditing.value = false
}
</script>

<template>
  <section class="container mt-3">
    <h1>Boat details</h1>

    <div v-if="!boat" class="alert alert-warning mt-3">Boat not found.</div>

    <div v-else>
      <table class="table table-bordered mt-3">
        <tbody>
          <tr>
            <th style="width: 220px">#</th>
            <td>{{ boat.id }}</td>
          </tr>
          <tr>
            <th>Name</th>
            <td><input v-model="form.name" class="form-control" :readonly="!isEditing" type="text" /></td>
          </tr>
          <tr>
            <th>Sail number</th>
            <td>
              <input v-model.number="form.sailNumber" class="form-control" :readonly="!isEditing" type="number" />
            </td>
          </tr>
          <tr>
            <th>Helm name</th>
            <td>
              <input v-model="form.helmName" class="form-control" :readonly="!isEditing" type="text" />
            </td>
          </tr>
          <tr>
            <th>Boat class</th>
            <td>
              <RouterLink v-if="!isEditing" :to="`/boat-class/${form.boatClassId}`">{{ boatClassName }}</RouterLink>
              <select v-else v-model.number="form.boatClassId" class="form-control">
                <option v-for="item in boatClasses" :key="item.id" :value="item.id">{{ item.name }}</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="d-flex gap-2 mb-3">
        <button v-if="!isEditing" class="btn btn-primary" type="button" @click="startEdit">Edit</button>
        <button
          v-else
          class="btn btn-primary"
          :disabled="!hasChanges"
          type="button"
          @click="saveChanges"
        >
          Save changes
        </button>
        <button v-if="isEditing" class="btn btn-outline-secondary" type="button" @click="cancelEdit">
          Cancel
        </button>
        <RouterLink class="btn btn-danger" :to="`/boat/delete/${boat.id}`">Delete</RouterLink>
      </div>

      <h2 class="h4 mt-4">Race entries</h2>
      <DataTable class="table table-striped table-bordered mt-2">
        <thead>
          <tr>
            <th>#</th>
            <th>Race name</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="race in raceList" :key="race.id">
            <td>{{ race.id }}</td>
            <td><RouterLink :to="`/race/${race.id}`">{{ race.name }}</RouterLink></td>
            <td>{{ race.date }}</td>
          </tr>
        </tbody>
      </DataTable>

      <h2 class="h4 mt-4">Series entries</h2>
      <DataTable class="table table-striped table-bordered mt-2">
        <thead>
          <tr>
            <th>#</th>
            <th>Series name</th>
            <th>Nb races</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="seriesItem in seriesList" :key="seriesItem.id">
            <td>{{ seriesItem.id }}</td>
            <td><RouterLink :to="`/series/${seriesItem.id}`">{{ seriesItem.name }}</RouterLink></td>
            <td>{{ seriesItem.nbRaces }}</td>
          </tr>
        </tbody>
      </DataTable>
    </div>
  </section>
</template>

