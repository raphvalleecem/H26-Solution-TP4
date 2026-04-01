<script lang="ts" setup>
import { RouterLink } from 'vue-router'
import DataTable from 'datatables.net-vue3'
import DataTablesCore from 'datatables.net-bs4'
import { raceClasses } from '../../data/classes'
import { seriesRows } from '../../data/series'

DataTable.use(DataTablesCore)

function getClassName(raceClassId: number): string {
  return raceClasses.find((item) => item.id === raceClassId)?.name ?? `#${raceClassId}`
}
</script>

<template>
  <main class="container mt-3">
    <h1>Series</h1>
    <RouterLink class="btn btn-sm btn-primary mr-2" :to="{ name: 'series-create' }"
      >Create</RouterLink
    >
    <p :style="{ marginTop: '10px' }"></p>

    <DataTable class="table table-striped table-bordered mt-3">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Nb races</th>
          <th>Nb races to count</th>
          <th>Race class</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in seriesRows" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.nbRaces }}</td>
          <td>{{ item.nbRacesToCount }}</td>
          <td>{{ getClassName(item.raceClassId) }}</td>
          <td class="text-nowrap">
            <RouterLink
              class="btn btn-sm btn-secondary mr-2"
              :to="{ name: 'series-edit', params: { id: String(item.id) } }"
            >
              Edit
            </RouterLink>
            <RouterLink
              class="btn btn-sm btn-danger"
              :to="{ name: 'series-delete', params: { id: String(item.id) } }"
            >
              Delete
            </RouterLink>
          </td>
        </tr>
      </tbody>
    </DataTable>
  </main>
</template>
