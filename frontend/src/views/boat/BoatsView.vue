<script lang="ts" setup>
import axios from 'axios'
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import DataTable from 'datatables.net-vue3'
import DataTablesCore from 'datatables.net-bs4'
import { handicapTypes } from '@/models/handicapTypes.ts'

DataTable.use(DataTablesCore)

type BoatRow = {
  id: number
  name: string
  sailNumber: number
  helmName: string
  boatClassId: number | null
  boatClassName: string | null
  handicapValue: number | null
  handicapTypeId: number | null
  handicapTypeName: string | null
}

type BoatApiRow = {
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

const boats = ref<BoatRow[]>([])
const isLoading = ref(true)
const errorMessage = ref('')
const hasBoats = computed(() => boats.value.length > 0)

async function loadBoats() {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const response = await axios.get<BoatApiRow[]>('/boat')
    boats.value = response.data.map((row) => normalizeBoat(row))
  } catch {
    errorMessage.value = 'Unable to load boats. Please try again.'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  void loadBoats()
})

function toNumberOrNull(value: unknown): number | null {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

function normalizeBoat(row: BoatApiRow): BoatRow {
  const boatClass =
    typeof row.boatClass === 'object' && row.boatClass !== null ? row.boatClass : null
  const handicapTypeObj =
    typeof boatClass?.handicapType === 'object' && boatClass.handicapType !== null
      ? boatClass.handicapType
      : null
  const fallbackTypeName =
    typeof boatClass?.handicapType === 'string' ? boatClass.handicapType : null

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
    boatClassId:
      toNumberOrNull(row.boatClassId ?? row.boat_class_id) ?? toNumberOrNull(boatClass?.id),
    boatClassName: typeof boatClass?.name === 'string' ? boatClass.name : null,
    handicapValue: toNumberOrNull(boatClass?.handicapValue ?? boatClass?.handicap_value),
    handicapTypeId:
      toNumberOrNull(boatClass?.handicapTypeId ?? boatClass?.handicap_type_id) ??
      toNumberOrNull(handicapTypeObj?.id),
    handicapTypeName:
      (typeof handicapTypeObj?.name === 'string' ? handicapTypeObj.name : null) ?? fallbackTypeName,
  }
}

function getBoatClassLabel(boat: BoatRow): string {
  if (boat.boatClassName) {
    return boat.boatClassName
  }

  if (boat.boatClassId !== null) {
    return `#${boat.boatClassId}`
  }

  return '-'
}

function getHandicapName(boat: BoatRow): string {
  if (boat.handicapTypeName) {
    return boat.handicapTypeName
  }

  if (boat.handicapTypeId !== null) {
    return (
      handicapTypes.find((item) => item.id === boat.handicapTypeId)?.name ??
      `#${boat.handicapTypeId}`
    )
  }

  return '-'
}
</script>

<template>
  <main class="container mt-3">
    <h1>Boats</h1>
    <RouterLink :to="{ name: 'boat-create' }" class="btn btn-sm btn-primary mr-2"
      >Create</RouterLink
    >

    <div v-if="errorMessage" class="alert alert-danger mt-3" role="alert">
      {{ errorMessage }}
    </div>

    <div v-if="isLoading" class="mt-3">Loading boats...</div>
    <div v-else-if="!hasBoats" class="mt-3">No boat found.</div>

    <DataTable v-else class="table table-striped table-bordered mt-3">
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Sail number</th>
          <th>Helm name</th>
          <th>Boat class</th>
          <th>Handicap</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="boat in boats" :key="boat.id">
          <td>{{ boat.id }}</td>
          <td>{{ boat.name }}</td>
          <td>{{ boat.sailNumber }}</td>
          <td>{{ boat.helmName }}</td>
          <td>
            <RouterLink v-if="boat.boatClassId !== null" :to="`/boat-class/${boat.boatClassId}`">
              {{ getBoatClassLabel(boat) }}
            </RouterLink>
            <span v-else>-</span>
          </td>
          <td>
            {{ boat.handicapValue ?? '-' }}
            {{ getHandicapName(boat) }}
          </td>
          <td>
            <RouterLink :to="`/boat/${boat.id}`" class="btn btn-sm btn-secondary"
              >Details</RouterLink
            >
          </td>
        </tr>
      </tbody>
    </DataTable>
  </main>
</template>
