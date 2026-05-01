<script lang="ts" setup>
import { RouterLink } from 'vue-router';
import DataTable from 'datatables.net-vue3';
import DataTablesCore from 'datatables.net-bs4';
import { raceClasses } from '@/models/raceClass.ts';
import { seriesRows } from '@/models/series.ts';

DataTable.use(DataTablesCore);

function getRaceClassName(raceClassId: number): string {
  return raceClasses.find((item) => item.id === raceClassId)?.name ?? `#${raceClassId}`;
}
</script>

<template>
  <main class="container mt-3">
    <h1>Series</h1>
    <RouterLink :to="{ name: 'series-create' }" class="btn btn-sm btn-primary mr-2"
      >Create</RouterLink
    >

    <DataTable class="table table-striped table-bordered mt-3">
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Nb Races</th>
          <th>Nb Races To Count</th>
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
          <td>
            <RouterLink :to="`/race-class/${item.raceClassId}`">
              {{ getRaceClassName(item.raceClassId) }}
            </RouterLink>
          </td>
          <td>
            <RouterLink :to="`/series/${item.id}`" class="btn btn-sm btn-secondary"
              >Details</RouterLink
            >
          </td>
        </tr>
      </tbody>
    </DataTable>
  </main>
</template>
