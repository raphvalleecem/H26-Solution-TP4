<script lang="ts" setup>
import { computed, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import DataTable from 'datatables.net-vue3'
import DataTablesCore from 'datatables.net-bs4'
import { boats } from '../../data/boats'
import { raceEntries } from '../../data/raceEntries'
import { raceOutcomes } from '../../data/raceOutcomes'
import { raceClasses } from '../../data/raceClasses'
import { findRaceById } from '../../data/races'
import { seriesRows } from '../../data/series'

DataTable.use(DataTablesCore)

type RaceForm = {
  name: string
  date: string
  startTime: string
  course: string
  raceClassId: number
  seriesId: number
  isCompleted: boolean
}

const route = useRoute()
const raceId = computed(() => Number.parseInt(String(route.params.id), 10))
const race = computed(() => (Number.isNaN(raceId.value) ? undefined : findRaceById(raceId.value)))

const isEditing = ref(false)
const addedBoatIds = ref<number[]>([])
const selectedBoatId = ref<number | null>(null)

const form = reactive<RaceForm>({
  name: '',
  date: '',
  startTime: '',
  course: '',
  raceClassId: 0,
  seriesId: 0,
  isCompleted: false,
})

const original = ref<RaceForm | null>(null)

if (race.value) {
  const seed: RaceForm = {
    name: race.value.name,
    date: race.value.date,
    startTime: race.value.startTime,
    course: race.value.course,
    raceClassId: race.value.raceClassId,
    seriesId: race.value.seriesId,
    isCompleted: race.value.isCompleted,
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

const seriesName = computed(() => {
  return seriesRows.find((item) => item.id === form.seriesId)?.name ?? '-'
})

type EntryDisplayRow = {
  boat: (typeof boats)[number]
  outcome: (typeof raceOutcomes)[number] | undefined
  source: 'saved' | 'temp'
}

const allBoatRows = computed<EntryDisplayRow[]>(() => {
  if (!race.value) {
    return []
  }

  const base = raceEntries
    .filter((entry) => entry.raceId === race.value!.id)
    .map((entry) => ({
      boat: boats.find((row) => row.id === entry.boatId),
      outcome: raceOutcomes.find((row) => row.raceEntryId === entry.id),
      source: 'saved' as const,
    }))
    .filter(
      (
        row,
      ): row is {
        boat: (typeof boats)[number]
        outcome: (typeof raceOutcomes)[number] | undefined
        source: 'saved'
      } => Boolean(row.boat),
    )

  const added = addedBoatIds.value
    .map((boatId) => boats.find((row) => row.id === boatId))
    .filter((boat): boat is (typeof boats)[number] => Boolean(boat))
    .map((boat) => ({ boat, outcome: undefined, source: 'temp' as const }))

  return [...base, ...added]
})

const selectableBoats = computed(() => {
  const selected = new Set(allBoatRows.value.map((row) => row.boat.id))
  return boats.filter((boat) => !selected.has(boat.id))
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
    <h1>Race details</h1>

    <div v-if="!race" class="alert alert-warning mt-3">Race not found.</div>

    <div v-else>
      <table class="table table-bordered mt-3">
        <tbody>
          <tr>
            <th style="width: 220px">#</th>
            <td>{{ race.id }}</td>
          </tr>
          <tr>
            <th>Name</th>
            <td><input v-model="form.name" class="form-control" :readonly="!isEditing" type="text" /></td>
          </tr>
          <tr>
            <th>Date</th>
            <td><input v-model="form.date" class="form-control" :readonly="!isEditing" type="date" /></td>
          </tr>
          <tr>
            <th>Start time</th>
            <td>
              <input v-model="form.startTime" class="form-control" :readonly="!isEditing" type="time" />
            </td>
          </tr>
          <tr>
            <th>Course</th>
            <td>
              <input v-model="form.course" class="form-control" :readonly="!isEditing" type="text" />
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
            <th>Series</th>
            <td>
              <RouterLink v-if="!isEditing" :to="`/series/${form.seriesId}`">{{ seriesName }}</RouterLink>
              <select v-else v-model.number="form.seriesId" class="form-control">
                <option v-for="item in seriesRows" :key="item.id" :value="item.id">{{ item.name }}</option>
              </select>
            </td>
          </tr>
          <tr>
            <th>Completed</th>
            <td>
              <input v-model="form.isCompleted" :disabled="!isEditing" type="checkbox" />
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
        <RouterLink class="btn btn-danger" :to="`/race/delete/${race.id}`">Delete</RouterLink>
      </div>

      <h2 class="h4 mt-4">Entries</h2>
      <DataTable class="table table-striped table-bordered mt-2">
        <thead>
          <tr>
            <th>Boat</th>
            <th v-if="form.isCompleted">Result</th>
            <th v-if="form.isCompleted">Position</th>
            <th v-if="form.isCompleted">Finish time</th>
            <th v-if="form.isCompleted">Elapsed time</th>
            <th v-if="form.isCompleted">Corrected time</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in allBoatRows" :key="`${row.boat.id}-${row.source}`">
            <td>
              <RouterLink :to="`/boat/${row.boat.id}`">{{ row.boat.name }}</RouterLink>
            </td>
            <td v-if="form.isCompleted">{{ row.outcome?.result || '-' }}</td>
            <td v-if="form.isCompleted">{{ row.outcome?.position ?? '-' }}</td>
            <td v-if="form.isCompleted">{{ row.outcome?.finishTime ?? '-' }}</td>
            <td v-if="form.isCompleted">{{ row.outcome?.elapsedTime ?? '-' }}</td>
            <td v-if="form.isCompleted">{{ row.outcome?.correctedTime ?? '-' }}</td>
          </tr>
        </tbody>
      </DataTable>

      <div class="card p-3 mt-3">
        <h3 class="h6">Add entry (prototype UX)</h3>
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


