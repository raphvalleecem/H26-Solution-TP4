<script lang="ts" setup>
import { RouterLink } from 'vue-router'
import DataTable from 'datatables.net-vue3'
import DataTablesCore from 'datatables.net-bs4'
import { boatClasses } from '../../data/boatClasses'
import { boats } from '../../data/boats'
import { handicapTypes } from '../../data/handicapTypes'

DataTable.use(DataTablesCore)

function getBoatClass(boatClassId: number) {
  return boatClasses.find((item) => item.id === boatClassId)
}

function getHandicapName(handicapTypeId: number): string {
  return handicapTypes.find((item) => item.id === handicapTypeId)?.name ?? '-'
}
</script>

<template>
  <main class="container mt-3">
    <h1>Boats</h1>
    <RouterLink class="btn btn-sm btn-primary mr-2" :to="{ name: 'boat-create' }">Create</RouterLink>

    <DataTable class="table table-striped table-bordered mt-3">
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
            <RouterLink :to="`/boat-class/${boat.boatClassId}`">
              {{ getBoatClass(boat.boatClassId)?.name ?? '-' }}
            </RouterLink>
          </td>
          <td>
            {{ getBoatClass(boat.boatClassId)?.handicapValue ?? '-' }}
            {{ getHandicapName(getBoatClass(boat.boatClassId)?.handicapTypeId ?? 0) }}
          </td>
          <td>
            <RouterLink class="btn btn-sm btn-secondary" :to="`/boat/${boat.id}`">Details</RouterLink>
          </td>
        </tr>
      </tbody>
    </DataTable>
  </main>
</template>
