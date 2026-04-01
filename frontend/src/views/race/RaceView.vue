<script lang="ts" setup>
import { RouterLink } from 'vue-router'
import DataTable from 'datatables.net-vue3'
import DataTablesCore from 'datatables.net-bs4'
import { raceClasses } from '../../data/classes'
import { races } from '../../data/races'

DataTable.use(DataTablesCore)

function getClassName(raceClassId: number): string {
  return raceClasses.find((item) => item.id === raceClassId)?.name ?? `#${raceClassId}`
}
</script>

<template>
  <main class="container mt-3">
    <h1>Races</h1>
    <RouterLink class="btn btn-sm btn-primary mr-2" :to="{ name: 'race-create' }"
      >Create</RouterLink
    >
    <p :style="{ marginTop: '10px' }"></p>

    <DataTable class="table table-striped table-bordered mt-3">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Date</th>
          <th>Start time</th>
          <th>Course</th>
          <th>Class</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in races" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.date }}</td>
          <td>{{ item.startTime }}</td>
          <td>{{ item.course }}</td>
          <td>{{ getClassName(item.raceClassId) }}</td>
          <td class="text-nowrap">
            <RouterLink
              class="btn btn-sm btn-secondary mr-2"
              :to="{ name: 'race-edit', params: { id: String(item.id) } }"
            >
              Edit
            </RouterLink>
            <RouterLink
              class="btn btn-sm btn-danger"
              :to="{ name: 'race-delete', params: { id: String(item.id) } }"
            >
              Delete
            </RouterLink>
          </td>
        </tr>
      </tbody>
    </DataTable>
  </main>
</template>
