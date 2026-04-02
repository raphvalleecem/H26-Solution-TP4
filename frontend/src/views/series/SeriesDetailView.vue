<script lang="ts" setup>
import { computed, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import DataTable from 'datatables.net-vue3'
import DataTablesCore from 'datatables.net-bs4'
import { boats } from '../../data/boats'
import { raceClasses } from '../../data/raceClasses'
import { races } from '../../data/races'
import { seriesEntries } from '../../data/seriesEntries'
import { seriesOutcomes } from '../../data/seriesOutcomes'
import { findSeriesById } from '../../data/series'

DataTable.use(DataTablesCore)

type SeriesForm = {
  name: string
  nbRaces: number
  nbRacesToCount: number
  raceClassId: number
  isCompleted: boolean
}

const route = useRoute()
const seriesId = computed(() => Number.parseInt(String(route.params.id), 10))
const seriesItem = computed(() => (Number.isNaN(seriesId.value) ? undefined : findSeriesById(seriesId.value)))

const isEditing = ref(false)
const selectedBoatId = ref<number | null>(null)
const addedBoatIds = ref<number[]>([])

const form = reactive<SeriesForm>({
  name: '',
  nbRaces: 0,
  nbRacesToCount: 0,
  raceClassId: 0,
  isCompleted: false,
})
const original = ref<SeriesForm | null>(null)

if (seriesItem.value) {
  const seed: SeriesForm = {
    name: seriesItem.value.name,
    nbRaces: seriesItem.value.nbRaces,
    nbRacesToCount: seriesItem.value.nbRacesToCount,
    raceClassId: seriesItem.value.raceClassId,
    isCompleted: seriesItem.value.isCompleted,
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

const raceClassName = computed(() => {
  return raceClasses.find((item) => item.id === form.raceClassId)?.name ?? '-'
})

const racesInSeries = computed(() => {
  if (!seriesItem.value) {
    return []
  }
  return races.filter((race) => race.seriesId === seriesItem.value!.id)
})

type EntryDisplayRow = {
  boat: (typeof boats)[number]
  outcome: (typeof seriesOutcomes)[number] | undefined
  source: 'saved' | 'temp'
}

const boatRows = computed<EntryDisplayRow[]>(() => {
  if (!seriesItem.value) {
    return []
  }

  const base = seriesEntries
    .filter((entry) => entry.seriesId === seriesItem.value!.id)
    .map((entry) => ({
      boat: boats.find((boat) => boat.id === entry.boatId),
      outcome: seriesOutcomes.find((outcome) => outcome.seriesEntryId === entry.id),
      source: 'saved' as const,
    }))
    .filter(
      (
        row,
      ): row is {
        boat: (typeof boats)[number]
        outcome: (typeof seriesOutcomes)[number] | undefined
        source: 'saved'
      } => Boolean(row.boat),
    )

  const temp = addedBoatIds.value
    .map((boatId) => boats.find((boat) => boat.id === boatId))
    .filter((boat): boat is (typeof boats)[number] => Boolean(boat))
    .map((boat) => ({ boat, outcome: undefined, source: 'temp' as const }))

  return [...base, ...temp]
})

const selectableBoats = computed(() => {
  const already = new Set(boatRows.value.map((row) => row.boat.id))
  return boats.filter((boat) => !already.has(boat.id))
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

function addEntry() {
  if (!selectedBoatId.value) {
    return
  }
  if (!addedBoatIds.value.includes(selectedBoatId.value)) {
    addedBoatIds.value.push(selectedBoatId.value)
  }
  selectedBoatId.value = null
}
</script>

<template>
  <section class="container mt-3">
    <h1>Series details</h1>

    <div v-if="!seriesItem" class="alert alert-warning mt-3">Series not found.</div>

    <div v-else>
      <table class="table table-bordered mt-3">
        <tbody>
          <tr>
            <th style="width: 220px">#</th>
            <td>{{ seriesItem.id }}</td>
          </tr>
          <tr>
            <th>Name</th>
            <td><input v-model="form.name" class="form-control" :readonly="!isEditing" type="text" /></td>
          </tr>
          <tr>
            <th>Nb races</th>
            <td>
              <input v-model.number="form.nbRaces" class="form-control" :readonly="!isEditing" type="number" />
            </td>
          </tr>
          <tr>
            <th>Nb races to count</th>
            <td>
              <input
                v-model.number="form.nbRacesToCount"
                class="form-control"
                :readonly="!isEditing"
                type="number"
              />
            </td>
          </tr>
          <tr>
            <th>Race class</th>
            <td>
              <RouterLink v-if="!isEditing" :to="`/race-class/${form.raceClassId}`">
                {{ raceClassName }}
              </RouterLink>
              <select v-else v-model.number="form.raceClassId" class="form-control">
                <option v-for="item in raceClasses" :key="item.id" :value="item.id">{{ item.name }}</option>
              </select>
            </td>
          </tr>
          <tr>
            <th>Completed</th>
            <td><input v-model="form.isCompleted" :disabled="!isEditing" type="checkbox" /></td>
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
        <RouterLink class="btn btn-danger" :to="`/series/delete/${seriesItem.id}`">Delete</RouterLink>
      </div>

      <h2 class="h4 mt-4">Races in this series</h2>
      <DataTable class="table table-striped table-bordered mt-2">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Date</th>
            <th>Start time</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="race in racesInSeries" :key="race.id">
            <td>{{ race.id }}</td>
            <td><RouterLink :to="`/race/${race.id}`">{{ race.name }}</RouterLink></td>
            <td>{{ race.date }}</td>
            <td>{{ race.startTime }}</td>
          </tr>
        </tbody>
      </DataTable>

      <h2 class="h4 mt-4">Series entries</h2>
      <DataTable class="table table-striped table-bordered mt-2">
        <thead>
          <tr>
            <th>Boat</th>
            <th v-if="form.isCompleted">Total points</th>
            <th v-if="form.isCompleted">Position</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in boatRows" :key="`${row.boat.id}-${row.source}`">
            <td><RouterLink :to="`/boat/${row.boat.id}`">{{ row.boat.name }}</RouterLink></td>
            <td v-if="form.isCompleted">{{ row.outcome?.totalPoints ?? '-' }}</td>
            <td v-if="form.isCompleted">{{ row.outcome?.position ?? '-' }}</td>
          </tr>
        </tbody>
      </DataTable>

      <div class="card p-3 mt-3">
        <h3 class="h6">Add series entry (prototype UX)</h3>
        <p class="mb-2 text-muted">
          Quand un bateau est ajoute ici, il est considere inscrit a toutes les races de la serie.
        </p>
        <div class="d-flex gap-2 align-items-center">
          <select v-model.number="selectedBoatId" class="form-control" style="max-width: 320px">
            <option :value="null">Select a boat</option>
            <option v-for="boat in selectableBoats" :key="boat.id" :value="boat.id">
              {{ boat.name }}
            </option>
          </select>
          <button class="btn btn-outline-primary" type="button" @click="addEntry">Add</button>
        </div>
      </div>
    </div>
  </section>
</template>


