<script lang="ts" setup>
import axios from 'axios'
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import DataTable from 'datatables.net-vue3'
import DataTablesCore from 'datatables.net-bs4'
import { boatClasses } from '@/models/boatClasses.ts'
import { handicapTypes } from '@/models/handicapTypes.ts'
import { raceClassTypes } from '@/models/raceClassTypes.ts'
import { getRaces, type Race } from '@/models/races.ts'
import { getSeries, seriesRows } from '@/models/series.ts'

DataTable.use(DataTablesCore)

type RaceClassDetail = {
  id: number
  name: string
  minHandicap: number | null
  maxHandicap: number | null
  handicapTypeId: number | null
  raceClassTypeId: number
  boatClassId: number | null
}

type RaceClassApiRow = {
  id?: unknown
  name?: unknown
  minHandicap?: unknown
  min_handicap?: unknown
  maxHandicap?: unknown
  max_handicap?: unknown
  handicapTypeId?: unknown
  handicap_type_id?: unknown
  raceClassTypeId?: unknown
  race_class_type_id?: unknown
  boatClassId?: unknown
  boat_class_id?: unknown
}

const route = useRoute()
const classId = computed(() => Number.parseInt(String(route.params.id), 10))
const raceClass = ref<RaceClassDetail | null>(null)
const races = ref<Race[]>([])
const isLoading = ref(true)
const errorMessage = ref('')

const isEditing = ref(false)
const form = reactive({
  name: '',
  minHandicap: '' as string | number,
  maxHandicap: '' as string | number,
  handicapTypeId: '' as string | number,
  raceClassTypeId: 1,
  boatClassId: '' as string | number,
})
const original = ref('')

const hasChanges = computed(() => JSON.stringify(form) !== original.value)

const raceClassTypeName = computed(() => {
  return raceClassTypes.find((row) => row.id === Number(form.raceClassTypeId))?.name ?? '-'
})

const handicapTypeName = computed(() => {
  const value = Number(form.handicapTypeId)
  if (!value) {
    return '-'
  }
  return handicapTypes.find((row) => row.id === value)?.name ?? '-'
})

const boatClassName = computed(() => {
  const value = Number(form.boatClassId)
  if (!value) {
    return '-'
  }
  return boatClasses.find((row) => row.id === value)?.name ?? '-'
})

const relatedRaces = computed(() => {
  if (!raceClass.value) {
    return []
  }
  return races.value.filter((race) => race.raceClassId === raceClass.value!.id)
})

const relatedSeries = computed(() => {
  if (!raceClass.value) {
    return []
  }
  return seriesRows.filter((seriesItem) => seriesItem.raceClassId === raceClass.value!.id)
})

function startEdit() {
  isEditing.value = true
}

function cancelEdit() {
  if (!raceClass.value) {
    return
  }
  Object.assign(form, {
    name: raceClass.value.name,
    minHandicap: raceClass.value.minHandicap ?? '',
    maxHandicap: raceClass.value.maxHandicap ?? '',
    handicapTypeId: raceClass.value.handicapTypeId ?? '',
    raceClassTypeId: raceClass.value.raceClassTypeId,
    boatClassId: raceClass.value.boatClassId ?? '',
  })
  isEditing.value = false
}

async function saveChanges() {
  if (!hasChanges.value || !raceClass.value) {
    return
  }

  try {
    await axios.post('/race-class/update', {
      id: raceClass.value.id,
      name: form.name,
      minHandicap: form.minHandicap === '' ? null : Number(form.minHandicap),
      maxHandicap: form.maxHandicap === '' ? null : Number(form.maxHandicap),
      handicapTypeId: form.handicapTypeId === '' ? null : Number(form.handicapTypeId),
      raceClassTypeId: Number(form.raceClassTypeId),
      boatClassId: form.boatClassId === '' ? null : Number(form.boatClassId),
    })
    original.value = JSON.stringify(form)
    isEditing.value = false
    errorMessage.value = ''
  } catch {
    errorMessage.value = 'Unable to save race class. Please try again.'
  }
}

function toNumberOrNull(value: unknown): number | null {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

async function loadRaceClass() {
  if (Number.isNaN(classId.value)) {
    raceClass.value = null
    errorMessage.value = 'Invalid race class id.'
    isLoading.value = false
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    const response = await axios.get<RaceClassApiRow>(`/race-class/${classId.value}`)
    const row = response.data

    const loadedRaceClass: RaceClassDetail = {
      id: toNumberOrNull(row.id) ?? 0,
      name: typeof row.name === 'string' ? row.name : '',
      minHandicap: toNumberOrNull(row.minHandicap ?? row.min_handicap),
      maxHandicap: toNumberOrNull(row.maxHandicap ?? row.max_handicap),
      handicapTypeId: toNumberOrNull(row.handicapTypeId ?? row.handicap_type_id),
      raceClassTypeId: toNumberOrNull(row.raceClassTypeId ?? row.race_class_type_id) ?? 1,
      boatClassId: toNumberOrNull(row.boatClassId ?? row.boat_class_id),
    }

    raceClass.value = loadedRaceClass
    Object.assign(form, {
      name: loadedRaceClass.name,
      minHandicap: loadedRaceClass.minHandicap ?? '',
      maxHandicap: loadedRaceClass.maxHandicap ?? '',
      handicapTypeId: loadedRaceClass.handicapTypeId ?? '',
      raceClassTypeId: loadedRaceClass.raceClassTypeId,
      boatClassId: loadedRaceClass.boatClassId ?? '',
    })
    original.value = JSON.stringify(form)

    // Attempt loading related races/series
    try {
      races.value = await getRaces()
    } catch {}
    try { await getSeries() } catch {}

  } catch {
    raceClass.value = null
    errorMessage.value = 'Unable to load race class details. Please try again.'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  void loadRaceClass()
})

watch(classId, () => {
  void loadRaceClass()
})
</script>

<template>
  <section class="container mt-3">
    <h1>Race class details</h1>

    <div v-if="isLoading" class="alert alert-info mt-3">Loading race class details...</div>
    <div v-else-if="errorMessage" class="alert alert-danger mt-3">{{ errorMessage }}</div>
    <div v-else-if="!raceClass" class="alert alert-warning mt-3">Race class not found.</div>

    <div v-else>
      <table class="table table-bordered mt-3">
        <tbody>
          <tr>
            <th style="width: 220px">#</th>
            <td>{{ raceClass.id }}</td>
          </tr>
          <tr>
            <th>Name</th>
            <td>
              <input v-model="form.name" :readonly="!isEditing" class="form-control" type="text" />
            </td>
          </tr>
          <tr>
            <th>Race class type</th>
            <td>
              <span v-if="!isEditing">{{ raceClassTypeName }}</span>
              <select v-else v-model.number="form.raceClassTypeId" class="form-control">
                <option v-for="item in raceClassTypes" :key="item.id" :value="item.id">
                  {{ item.name }}
                </option>
              </select>
            </td>
          </tr>
          <tr>
            <th>Min handicap</th>
            <td>
              <input
                v-model="form.minHandicap"
                :disabled="Number(form.raceClassTypeId) === 1"
                :readonly="!isEditing"
                class="form-control"
                type="text"
              />
            </td>
          </tr>
          <tr>
            <th>Max handicap</th>
            <td>
              <input
                v-model="form.maxHandicap"
                :disabled="Number(form.raceClassTypeId) === 1"
                :readonly="!isEditing"
                class="form-control"
                type="text"
              />
            </td>
          </tr>
          <tr>
            <th>Handicap type</th>
            <td>
              <span v-if="!isEditing">{{ handicapTypeName }}</span>
              <select
                v-else
                v-model.number="form.handicapTypeId"
                :disabled="Number(form.raceClassTypeId) === 1"
                class="form-control"
              >
                <option :value="''">-</option>
                <option v-for="item in handicapTypes" :key="item.id" :value="item.id">
                  {{ item.name }}
                </option>
              </select>
            </td>
          </tr>
          <tr>
            <th>Monotype boat class</th>
            <td>
              <RouterLink
                v-if="!isEditing && Number(form.boatClassId)"
                :to="`/boat-class/${form.boatClassId}`"
              >
                {{ boatClassName }}
              </RouterLink>
              <span v-else-if="!isEditing">{{ boatClassName }}</span>
              <select
                v-else
                v-model.number="form.boatClassId"
                :disabled="Number(form.raceClassTypeId) !== 1"
                class="form-control"
              >
                <option :value="''">-</option>
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
        <RouterLink :to="`/race-class/delete/${raceClass.id}`" class="btn btn-danger"
          >Delete</RouterLink
        >
      </div>

      <h2 class="h4 mt-4">Races in this class</h2>
      <DataTable class="table table-striped table-bordered mt-2">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in relatedRaces" :key="row.id">
            <td>{{ row.id }}</td>
            <td>
              <RouterLink :to="`/race/${row.id}`">{{ row.name }}</RouterLink>
            </td>
            <td>{{ row.date }}</td>
          </tr>
        </tbody>
      </DataTable>

      <h2 class="h4 mt-4">Series in this class</h2>
      <DataTable class="table table-striped table-bordered mt-2">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Nb races</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in relatedSeries" :key="row.id">
            <td>{{ row.id }}</td>
            <td>
              <RouterLink :to="`/series/${row.id}`">{{ row.name }}</RouterLink>
            </td>
            <td>{{ row.nbRaces }}</td>
          </tr>
        </tbody>
      </DataTable>
    </div>
  </section>
</template>
