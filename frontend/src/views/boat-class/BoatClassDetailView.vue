<script lang="ts" setup>
import axios from 'axios'
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import DataTable from 'datatables.net-vue3'
import DataTablesCore from 'datatables.net-bs4'
import { handicapTypes } from '@/models/handicapTypes.ts'

DataTable.use(DataTablesCore)

type BoatClassDetail = {
  id: number
  name: string
  handicapValue: number
  handicapTypeId: number
  handicapTypeName: string | null
}

type BoatClassApiRow = {
  id?: unknown
  name?: unknown
  handicapValue?: unknown
  handicap_value?: unknown
  handicapTypeId?: unknown
  handicap_type_id?: unknown
  handicapType?: { id?: unknown; name?: unknown } | string | null
}

type Boat = {
  id: number
  name: string
  helmName: string
  boatClassId: number
}

const route = useRoute()
const classId = computed(() => Number.parseInt(String(route.params.id), 10))
const boatClass = ref<BoatClassDetail | null>(null)
const isLoading = ref(true)
const errorMessage = ref('')
const boatsInClass = ref<Boat[]>([])

const isEditing = ref(false)
const form = reactive({
  name: '',
  handicapValue: 0,
  handicapTypeId: 1,
})
const original = ref('')

const hasChanges = computed(() => JSON.stringify(form) !== original.value)

const handicapTypeName = computed(() => {
  return handicapTypes.find((item) => item.id === form.handicapTypeId)?.name ?? '-'
})

function startEdit() {
  isEditing.value = true
}

function cancelEdit() {
  if (!boatClass.value) {
    return
  }
  Object.assign(form, {
    name: boatClass.value.name,
    handicapValue: boatClass.value.handicapValue,
    handicapTypeId: boatClass.value.handicapTypeId,
  })
  isEditing.value = false
}

async function saveChanges() {
  if (!hasChanges.value || !boatClass.value) {
    return
  }

  try {
    await axios.post('/boat-class/update', {
      id: boatClass.value.id,
      name: form.name,
      handicapValue: form.handicapValue,
      handicapTypeId: form.handicapTypeId,
    })
    original.value = JSON.stringify(form)
    isEditing.value = false
    errorMessage.value = ''
  } catch {
    errorMessage.value = 'Unable to save boat class. Please try again.'
  }
}

function toNumberOrNull(value: unknown): number | null {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

function normalizeBoatClass(row: BoatClassApiRow): BoatClassDetail {
  const handicapTypeObj =
    typeof row.handicapType === 'object' && row.handicapType !== null ? row.handicapType : null
  const fallbackTypeName = typeof row.handicapType === 'string' ? row.handicapType : null

  return {
    id: toNumberOrNull(row.id) ?? 0,
    name: typeof row.name === 'string' ? row.name : '',
    handicapValue: toNumberOrNull(row.handicapValue ?? row.handicap_value) ?? 0,
    handicapTypeId:
      toNumberOrNull(row.handicapTypeId ?? row.handicap_type_id) ??
      toNumberOrNull(handicapTypeObj?.id) ??
      1,
    handicapTypeName:
      (typeof handicapTypeObj?.name === 'string' ? handicapTypeObj.name : null) ?? fallbackTypeName,
  }
}

async function loadBoatClass() {
  if (Number.isNaN(classId.value)) {
    boatClass.value = null
    errorMessage.value = 'Invalid boat class id.'
    isLoading.value = false
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    const response = await axios.get<BoatClassApiRow>(`/boat-class/${classId.value}`)
    const loadedBoatClass = normalizeBoatClass(response.data)

    boatClass.value = loadedBoatClass
    Object.assign(form, {
      name: loadedBoatClass.name,
      handicapValue: loadedBoatClass.handicapValue,
      handicapTypeId: loadedBoatClass.handicapTypeId,
    })
    original.value = JSON.stringify(form)
  } catch {
    boatClass.value = null
    errorMessage.value = 'Unable to load boat class details. Please try again.'
  } finally {
    isLoading.value = false
  }
}

async function loadBoatsInClass() {
  if (!boatClass.value) {
    boatsInClass.value = []
    return
  }

  try {
    const response = await axios.get<Boat[]>(`/boat?classId=${boatClass.value.id}`)
    boatsInClass.value = response.data
  } catch {
    boatsInClass.value = []
  }
}

onMounted(() => {
  void loadBoatClass()
})

watch(classId, () => {
  void loadBoatClass()
})

watch(boatClass, () => {
  void loadBoatsInClass()
})
</script>

<template>
  <section class="container mt-3">
    <h1>Boat class details</h1>

    <div v-if="isLoading" class="alert alert-info mt-3">Loading boat class details...</div>
    <div v-else-if="errorMessage" class="alert alert-danger mt-3">{{ errorMessage }}</div>
    <div v-else-if="!boatClass" class="alert alert-warning mt-3">Boat class not found.</div>

    <div v-else>
      <table class="table table-bordered mt-3">
        <tbody>
          <tr>
            <th style="width: 220px">#</th>
            <td>{{ boatClass.id }}</td>
          </tr>
          <tr>
            <th>Name</th>
            <td>
              <input v-model="form.name" :readonly="!isEditing" class="form-control" type="text" />
            </td>
          </tr>
          <tr>
            <th>Handicap value</th>
            <td>
              <input
                v-model.number="form.handicapValue"
                :readonly="!isEditing"
                class="form-control"
                type="number"
              />
            </td>
          </tr>
          <tr>
            <th>Handicap type</th>
            <td>
              <span v-if="!isEditing">{{ handicapTypeName }}</span>
              <select v-else v-model.number="form.handicapTypeId" class="form-control">
                <option v-for="item in handicapTypes" :key="item.id" :value="item.id">
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
        <RouterLink :to="`/boat-class/delete/${boatClass.id}`" class="btn btn-danger"
          >Delete</RouterLink
        >
      </div>

      <h2 class="h4 mt-4">Boats in this class</h2>
      <DataTable class="table table-striped table-bordered mt-2">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Helm</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="boat in boatsInClass" :key="boat.id">
            <td>{{ boat.id }}</td>
            <td>
              <RouterLink :to="`/boat/${boat.id}`">{{ boat.name }}</RouterLink>
            </td>
            <td>{{ boat.helmName }}</td>
          </tr>
        </tbody>
      </DataTable>
    </div>
  </section>
</template>
