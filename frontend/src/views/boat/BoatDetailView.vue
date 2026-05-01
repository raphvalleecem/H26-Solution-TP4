<script lang="ts" setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import DataTable from 'datatables.net-vue3'
import DataTablesCore from 'datatables.net-bs4'
import { boatClasses } from '@/models/boatClasses.ts'
import { raceEntries } from '@/models/raceEntries.ts'
import { getRaces, type Race } from '@/models/races.ts'
import { seriesEntries } from '@/models/seriesEntries.ts'
import { seriesRows } from '@/models/series.ts'
import axios from 'axios'

DataTable.use(DataTablesCore)

type BoatForm = {
  name: string
  sailNumber: number
  helmName: string
  boatClassId: number
}

type BoatDetail = BoatForm & {
  id: number
  boatClassName: string | null
}

type BoatApi = {
  id?: unknown
  name?: unknown
  sailNumber?: unknown
  sail_number?: unknown
  helmName?: unknown
  helm_name?: unknown
  boatClassId?: unknown
  boat_class_id?: unknown
  boatClass?: {
    id?: unknown
    name?: unknown
    handicapValue?: unknown
    handicap_value?: unknown
    handicapTypeId?: unknown
    handicap_type_id?: unknown
    handicapType?: { id?: unknown; name?: unknown } | string | null
  } | null
}

const route = useRoute()
const boatId = computed(() => Number.parseInt(String(route.params.id), 10))
const boat = ref<BoatDetail | null>(null)
const races = ref<Race[]>([])

const isEditing = ref(false)
const form = reactive<BoatForm>({ name: '', sailNumber: 0, helmName: '', boatClassId: 0 })
const original = ref<BoatForm | null>(null)

const hasChanges = computed(() => {
  if (!original.value) {
    return false
  }
  return JSON.stringify(form) !== JSON.stringify(original.value)
})

const boatClassName = computed(() => {
  return boat.value?.boatClassName ?? boatClasses.find((item) => item.id === form.boatClassId)?.name ?? '-'
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
    .map((entry) => seriesRows.find((series) => series.id === entry.seriesId))
    .filter((series): series is NonNullable<typeof series> => Boolean(series))
})

const isLoading = ref(true)
const errorMessage = ref('')

async function loadBoat() {
  if (Number.isNaN(boatId.value)) {
    boat.value = null
    errorMessage.value = 'Invalid boat id.'
    isLoading.value = false
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    const response = await axios.get<BoatApi>(`/boat-class/${boatId.value}`)
    const loadedBoat = normalizeBoat(response.data)

    boat.value = loadedBoat
    const seed: BoatForm = {
      name: loadedBoat.name,
      sailNumber: loadedBoat.sailNumber,
      helmName: loadedBoat.helmName,
      boatClassId: loadedBoat.boatClassId,
    }

    Object.assign(form, seed)
    original.value = { ...seed }
    races.value = await getRaces()
  } catch {
    boat.value = null
    errorMessage.value = 'Unable to load boat details. Please try again.'
  } finally {
    isLoading.value = false
  }
}

function toNumberOrNull(value: unknown): number | null {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

function normalizeBoat(row: BoatApi): BoatDetail {
  const boatClass =
    typeof row.boatClass === 'object' && row.boatClass !== null ? row.boatClass : null

  return {
    id: toNumberOrNull(row.id) ?? 0,
    name: typeof row.name === 'string' ? row.name : '',
    sailNumber: toNumberOrNull(row.sailNumber ?? row.sail_number) ?? 0,
    helmName:
      typeof row.helmName === 'string'
        ? row.helmName
        : typeof row.helm_name === 'string'
          ? row.helm_name
          : '',
    boatClassId: toNumberOrNull(row.boatClassId ?? row.boat_class_id) ?? toNumberOrNull(boatClass?.id) ?? 0,
    boatClassName: typeof boatClass?.name === 'string' ? boatClass.name : null,
  }
}

onMounted(() => {
  void loadBoat()
})

watch(boatId, () => {
  void loadBoat()
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
              <RouterLink v-if="!isEditing" :to="`/boat-class/${form.boatClassId}`">{{
                boatClassName
              }}</RouterLink>
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
            <td>{{ race.startDate }}</td>
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
