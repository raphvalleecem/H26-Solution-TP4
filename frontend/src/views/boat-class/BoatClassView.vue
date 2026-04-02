<script lang="ts" setup>
import { RouterLink } from 'vue-router'
import DataTable from 'datatables.net-vue3'
import DataTablesCore from 'datatables.net-bs4'
import { boatClasses } from '../../data/boatClasses'
import { handicapTypes } from '../../data/handicapTypes'

DataTable.use(DataTablesCore)

function getHandicapTypeName(handicapTypeId: number): string {
  return handicapTypes.find((item) => item.id === handicapTypeId)?.name ?? `#${handicapTypeId}`
}
</script>

<template>
  <main class="container mt-3">
    <h1>Boat classes</h1>
    <RouterLink class="btn btn-sm btn-primary mr-2" :to="{ name: 'boat-class-create' }">Create</RouterLink>

    <DataTable class="table table-striped table-bordered mt-3">
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Handicap value</th>
          <th>Handicap type</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in boatClasses" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.handicapValue }}</td>
          <td>{{ getHandicapTypeName(item.handicapTypeId) }}</td>
          <td>
            <RouterLink class="btn btn-sm btn-secondary" :to="`/boat-class/${item.id}`">Details</RouterLink>
          </td>
        </tr>
      </tbody>
    </DataTable>
  </main>
</template>
