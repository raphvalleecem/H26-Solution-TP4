<script lang="ts" setup>
import { RouterLink } from 'vue-router'
import DataTable from 'datatables.net-vue3'
import DataTablesCore from 'datatables.net-bs4'
import { raceClasses } from '../../data/raceClasses'
import { races } from '../../data/races'
import { seriesRows } from '../../data/series'

DataTable.use(DataTablesCore)

function getRaceClassName(raceClassId: number): string {
  return raceClasses.find((item) => item.id === raceClassId)?.name ?? `#${raceClassId}`
}

function getSeriesName(seriesId: number): string {
  return seriesRows.find((item) => item.id === seriesId)?.name ?? `#${seriesId}`
}
</script>

<template>
  <main class="container mt-3">
    <h1>Races</h1>
    <RouterLink class="btn btn-sm btn-primary mr-2" :to="{ name: 'race-create' }">Create</RouterLink>

    <DataTable class="table table-striped table-bordered mt-3">
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Date</th>
          <th>Start time</th>
          <th>Course</th>
          <th>Race class</th>
          <th>Series</th>
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
          <td>
            <RouterLink :to="`/race-class/${item.raceClassId}`">
              {{ getRaceClassName(item.raceClassId) }}
            </RouterLink>
          </td>
          <td>
            <RouterLink :to="`/series/${item.seriesId}`">
              {{ getSeriesName(item.seriesId) }}
            </RouterLink>
          </td>
          <td>
            <RouterLink class="btn btn-sm btn-secondary" :to="`/race/${item.id}`">Details</RouterLink>
          </td>
        </tr>
      </tbody>
    </DataTable>
  </main>
</template>
