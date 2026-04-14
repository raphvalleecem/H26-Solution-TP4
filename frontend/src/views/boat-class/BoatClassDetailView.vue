<script lang="ts" setup>
import { computed, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import DataTable from 'datatables.net-vue3'
import DataTablesCore from 'datatables.net-bs4'
import { boatClasses } from '@/models/boatClasses.ts'
import { boats } from '@/models/boats.ts'
import { handicapTypes } from '@/models/handicapTypes.ts'
import { raceClasses } from '@/models/raceClasses.ts'
import { races } from '@/models/races.ts'

DataTable.use(DataTablesCore)

const route = useRoute()
const classId = computed(() => Number.parseInt(String(route.params.id), 10))
const boatClass = computed(() => {
  if (Number.isNaN(classId.value)) {
    return undefined
  }
  return boatClasses.find((item) => item.id === classId.value)
})

const isEditing = ref(false)
const form = reactive({
  name: '',
  handicapValue: 0,
  handicapTypeId: 1,
})
const original = ref('')

if (boatClass.value) {
  Object.assign(form, {
    name: boatClass.value.name,
    handicapValue: boatClass.value.handicapValue,
    handicapTypeId: boatClass.value.handicapTypeId,
  })
  original.value = JSON.stringify(form)
}

const hasChanges = computed(() => JSON.stringify(form) !== original.value)

const handicapTypeName = computed(() => {
  return handicapTypes.find((item) => item.id === form.handicapTypeId)?.name ?? '-'
})

const boatsInClass = computed(() => {
  if (!boatClass.value) {
    return []
  }
  return boats.filter((boat) => boat.boatClassId === boatClass.value!.id)
})

const racesInClass = computed(() => {
  if (!boatClass.value) {
    return []
  }
  const monotypeClassIds = raceClasses
    .filter((raceClass) => raceClass.boatClassId === boatClass.value!.id)
    .map((raceClass) => raceClass.id)

  return races.filter((race) => monotypeClassIds.includes(race.raceClassId))
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

function saveChanges() {
  if (!hasChanges.value) {
    return
  }
  original.value = JSON.stringify(form)
  isEditing.value = false
}
</script>

<template>
  <section class="container mt-3">
    <h1>Boat class details</h1>

    <div v-if="!boatClass" class="alert alert-warning mt-3">Boat class not found.</div>

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

      <h2 class="h4 mt-4">Races for this boat class</h2>
      <DataTable class="table table-striped table-bordered mt-2">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="race in racesInClass" :key="race.id">
            <td>{{ race.id }}</td>
            <td>
              <RouterLink :to="`/race/${race.id}`">{{ race.name }}</RouterLink>
            </td>
            <td>{{ race.date }}</td>
          </tr>
        </tbody>
      </DataTable>
    </div>
  </section>
</template>
