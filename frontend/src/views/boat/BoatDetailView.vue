<script lang="ts" setup>
import axios from 'axios'
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import DataTable from 'datatables.net-vue3'
import DataTablesCore from 'datatables.net-bs4'
import { raceEntries } from '@/models/raceEntries.ts'
import { getRaces, type Race } from '@/models/races.ts'
import { seriesEntries } from '@/models/seriesEntries.ts'
import { getSeries, type Series } from '@/models/series.ts'
import type { Boat } from '@/models/boats.ts';

DataTable.use(DataTablesCore)

type BoatForm = {
  name: string;
  sailNumber: string | number
  helmName: string
  boatClassId: string | number
}

type BoatClassOption = {
  id: number
  name: string
}

type BoatDetail = {
  id: number
  name: string
  sailNumber: number
  helmName: string
  boatClassId: number
  boatClassName: string | null
}

const route = useRoute()
const boatId = computed(() => Number.parseInt(String(route.params.id), 10))

const boatClasses = ref<BoatClassOption[]>([])
const races = ref<Race[]>([])
const seriesRows = ref<Series[]>([])
const boat = ref<BoatDetail | null>(null)

const isLoading = ref(true)
const isEditing = ref(false)
const errorMessage = ref('')
const form = reactive<BoatForm>({ name: '', sailNumber: '', helmName: '', boatClassId: '' })
const original = ref('')

const hasChanges = computed(() => JSON.stringify(form) !== original.value)

const boatClassName = computed(() => {
  return boat.value?.boatClassName ?? boatClasses.value.find((item) => item.id === Number(form.boatClassId))?.name ?? '-'
})

const raceList = computed(() => {
  if (!boat.value) {
    return []
  }

  const currentBoatId = boat.value.id
  return raceEntries
    .filter((entry) => entry.boatId === currentBoatId)
    .map((entry) => races.value.find((raceItem) => raceItem.id === entry.raceId))
    .filter((raceItem): raceItem is Race => Boolean(raceItem))
})

const seriesList = computed(() => {
  if (!boat.value) {
    return []
  }

  const currentBoatId = boat.value.id
  return seriesEntries
    .filter((entry) => entry.boatId === currentBoatId)
    .map((entry) => seriesRows.value.find((series) => series.id === entry.seriesId))
    .filter((series): series is Series => Boolean(series))
})

onMounted(async () => {
  await loadBoatClasses()
  await loadRaces()
  await loadSeries()
  void fetchBoat()
})

function startEdit() {
  isEditing.value = true
}

function cancelEdit() {
  if (!boat.value) {
    return
  }

  Object.assign(form, {
    name: boat.value.name,
    sailNumber: boat.value.sailNumber,
    helmName: boat.value.helmName,
    boatClassId: boat.value.boatClassId,
  })
  isEditing.value = false
}

async function saveChanges() {
  if (!hasChanges.value || !boat.value) {
    return
  }

  original.value = JSON.stringify(form)
  isEditing.value = false

  try {
    await axios.post('/boat/update', {
      id: boat.value.id,
      name: form.name,
      sailNumber: form.sailNumber === '' ? null : Number(form.sailNumber),
      helmName: form.helmName,
      boatClassId: form.boatClassId === '' ? null : Number(form.boatClassId),
    })
    original.value = JSON.stringify(form)
    isEditing.value = false
    errorMessage.value = ''
  } catch {
    errorMessage.value = 'Unable to save boat. Please try again.'
  }
}

async function fetchBoat() {
  if (Number.isNaN(boatId.value)) {
    boat.value = null
    errorMessage.value = 'Invalid boat id.'
    isLoading.value = false
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    const response = await axios.get<Boat[]>('/boat')
    const data = response.data.find((row) => Number(row.id) === boatId.value)

    if (!data) {
      boat.value = null
      return
    }

    const loadedBoat = data


    const seed: BoatForm = {
      name: loadedBoat.name,
      sailNumber: loadedBoat.sailNumber,
      helmName: loadedBoat.helmName,
      boatClassId: loadedBoat.boatClassId,
    }

    Object.assign(form, seed)
    original.value = JSON.stringify(seed)
  } catch {
    boat.value = null
    errorMessage.value = 'Unable to load boat details. Please try again.'
  } finally {
    isLoading.value = false
  }
}

async function loadBoatClasses() {
  try {
    const response = await axios.get<BoatClassOption[]>('/boat-class')
    boatClasses.value = response.data.map((row) => ({
      id: Number(row.id),
      name: typeof row.name === 'string' ? row.name : '',
    }))
  } catch {
    boatClasses.value = []
  }
}

async function loadRaces() {
  races.value = await getRaces()
}

async function loadSeries() {
  seriesRows.value = await getSeries()
}


watch(boatId, () => {
  void fetchBoat()
})
</script>

<template>
  <section class="container mt-3">
    <h1>Boat details</h1>

    <div v-if="isLoading" class="alert alert-info mt-3">Loading boat details...</div>
    <div v-else-if="errorMessage" class="alert alert-danger mt-3">{{ errorMessage }}</div>
    <div v-else-if="!boat" class="alert alert-warning mt-3">Boat not found.</div>

    <div v-else>
      <table class="table table-bordered mt-3">
        <tbody>
          <tr>
            <th style="width: 220px">#</th>
            <td>{{ boat.id }}</td>
          </tr>
          <tr>
            <th>Name</th>
            <td>
              <input v-model="form.name" :readonly="!isEditing" class="form-control" type="text" />
            </td>
          </tr>
          <tr>
            <th>Sail number</th>
            <td>
              <input
                v-model.number="form.sailNumber"
                :readonly="!isEditing"
                class="form-control"
                type="number"
              />
            </td>
          </tr>
          <tr>
            <th>Helm name</th>
            <td>
              <input
                v-model="form.helmName"
                :readonly="!isEditing"
                class="form-control"
                type="text"
              />
            </td>
          </tr>
          <tr>
            <th>Boat class</th>
            <td>
              <span v-if="!isEditing">{{ boatClassName }}</span>
              <select v-else v-model.number="form.boatClassId" class="form-control">
                <option v-for="item in boatClasses" :key="item.id" :value="item.id">
                  {{ item.name }}
                </option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="d-flex gap-2 mb-3">
        <button v-if="!isEditing" class="btn btn-primary" type="button" @click="startEdit">
          Edit
        </button>
        <button
          v-else
          :disabled="!hasChanges"
          class="btn btn-primary"
          type="button"
          @click="saveChanges"
        >
          Save changes
        </button>
        <button
          v-if="isEditing"
          class="btn btn-outline-secondary"
          type="button"
          @click="cancelEdit"
        >
          Cancel
        </button>
        <RouterLink :to="`/boat/delete/${boat.id}`" class="btn btn-danger">Delete</RouterLink>
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
            <td>
              <RouterLink :to="`/race/${race.id}`">{{ race.name }}</RouterLink>
            </td>
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
            <td>
              <RouterLink :to="`/series/${seriesItem.id}`">{{ seriesItem.name }}</RouterLink>
            </td>
            <td>{{ seriesItem.nbRaces }}</td>
          </tr>
        </tbody>
      </DataTable>
    </div>
  </section>
</template>
