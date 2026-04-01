<script lang="ts" setup>
import { RouterLink } from 'vue-router'
import DataTable from 'datatables.net-vue3'
import DataTablesCore from 'datatables.net-bs4'
import { boats } from '../../data/boats'
import { raceEntries } from '../../data/entries'
import { races } from '../../data/races'

DataTable.use(DataTablesCore)

function getBoatName(boatId: number): string {
  return boats.find((item) => item.id === boatId)?.nom ?? `#${boatId}`
}

function getRaceName(raceId: number): string {
  return races.find((item) => item.id === raceId)?.name ?? `#${raceId}`
}
</script>

<template>
  <main class="container mt-3">
    <h1>Race entries</h1>
    <RouterLink class="btn btn-sm btn-primary mr-2" :to="{ name: 'entry-create' }"
      >Create</RouterLink
    >
    <p :style="{ marginTop: '10px' }"></p>

    <DataTable class="table table-striped table-bordered mt-3">
      <thead>
        <tr>
          <th>ID</th>
          <th>Boat</th>
          <th>Race</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in raceEntries" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ getBoatName(item.boatId) }}</td>
          <td>{{ getRaceName(item.raceId) }}</td>
          <td class="text-nowrap">
            <RouterLink
              class="btn btn-sm btn-secondary mr-2"
              :to="{ name: 'entry-edit', params: { id: String(item.id) } }"
            >
              Edit
            </RouterLink>
            <RouterLink
              class="btn btn-sm btn-danger"
              :to="{ name: 'entry-delete', params: { id: String(item.id) } }"
            >
              Delete
            </RouterLink>
          </td>
        </tr>
      </tbody>
    </DataTable>
  </main>
</template>
