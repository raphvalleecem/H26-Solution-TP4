<script lang="ts" setup>
import { RouterLink } from 'vue-router'
import DataTable from 'datatables.net-vue3'
import DataTablesCore from 'datatables.net-bs4'
import { boatClasses } from '../../data/boatClasses'
import { handicapTypes } from '../../data/handicapTypes'
import { raceClasses } from '../../data/raceClasses'
import { raceClassTypes } from '../../data/raceClassTypes'

DataTable.use(DataTablesCore)

function getHandicapTypeName(id?: number): string {
  if (!id) {
    return '-'
  }
  return handicapTypes.find((item) => item.id === id)?.name ?? `#${id}`
}

function getRaceClassTypeName(id: number): string {
  return raceClassTypes.find((item) => item.id === id)?.name ?? `#${id}`
}

function getBoatClassName(id?: number): string {
  if (!id) {
    return '-'
  }
  return boatClasses.find((item) => item.id === id)?.name ?? `#${id}`
}
</script>

<template>
  <main class="container mt-3">
    <h1>Race classes</h1>
    <RouterLink class="btn btn-sm btn-primary mr-2" :to="{ name: 'race-class-create' }">Create</RouterLink>

    <DataTable class="table table-striped table-bordered mt-3">
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Type</th>
          <th>Handicap range</th>
          <th>Handicap type</th>
          <th>Monotype boat class</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in raceClasses" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ item.name }}</td>
          <td>{{ getRaceClassTypeName(item.raceClassTypeId) }}</td>
          <td>{{ item.minHandicap ?? '-' }} - {{ item.maxHandicap ?? '-' }}</td>
          <td>{{ getHandicapTypeName(item.handicapTypeId) }}</td>
          <td>
            <RouterLink v-if="item.boatClassId" :to="`/boat-class/${item.boatClassId}`">
              {{ getBoatClassName(item.boatClassId) }}
            </RouterLink>
            <span v-else>-</span>
          </td>
          <td>
            <RouterLink class="btn btn-sm btn-secondary" :to="`/race-class/${item.id}`">Details</RouterLink>
          </td>
        </tr>
      </tbody>
    </DataTable>
  </main>
</template>

