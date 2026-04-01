<script lang="ts" setup>
import { RouterLink } from 'vue-router'
import DataTable from 'datatables.net-vue3'
import DataTablesCore from 'datatables.net-bs4'
import { handicapTypes, raceClasses, raceClassTypes } from '../../data/classes'

DataTable.use(DataTablesCore)

function getHandicapTypeName(id: number): string {
  return handicapTypes.find((item) => item.id === id)?.name ?? `#${id}`
}

function getRaceClassTypeName(id: number): string {
  return raceClassTypes.find((item) => item.id === id)?.name ?? `#${id}`
}
</script>

<template>
  <main class="container mt-3">
    <h1>Race classes</h1>
    <RouterLink class="btn btn-sm btn-primary mr-2" :to="{ name: 'class-create' }"
      >Create</RouterLink
    >
    <p :style="{ marginTop: '10px' }"></p>
    <DataTable class="table table-striped table-bordered mt-3">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Min handicap</th>
          <th>Max handicap</th>
          <th>Handicap type</th>
          <th>Class type</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in raceClasses" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.minHandicap }}</td>
          <td>{{ item.maxHandicap }}</td>
          <td>{{ getHandicapTypeName(item.handicapTypeId) }}</td>
          <td>{{ getRaceClassTypeName(item.raceClassTypeId) }}</td>
          <td class="text-nowrap">
            <RouterLink
              class="btn btn-sm btn-secondary mr-2"
              :to="{ name: 'class-edit', params: { id: String(item.id) } }"
            >
              Edit
            </RouterLink>
            <RouterLink
              class="btn btn-sm btn-danger"
              :to="{ name: 'class-delete', params: { id: String(item.id) } }"
            >
              Delete
            </RouterLink>
          </td>
        </tr>
      </tbody>
    </DataTable>
  </main>
</template>
