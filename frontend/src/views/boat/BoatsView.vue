<script lang="ts" setup>
import ListBoats from '../../components/ListBoats.vue'
import DataTable from 'datatables.net-vue3'
import DataTablesCore from 'datatables.net-bs4'
import { boats } from '../../data/boats'

DataTable.use(DataTablesCore)
</script>

<template>
  <main>
    <ListBoats />
    <h1>List Boats</h1>
    <RouterLink class="btn btn-sm btn-primary mr-2" :to="{ name: 'boat-create' }">
      Create
    </RouterLink>
    <p :style="{ marginTop: '10px'}"></p>
    <DataTable class="table table-striped table-bordered">
      <thead>
        <tr>
          <th>Boat name</th>
          <th>Boat class</th>
          <th>Sail number</th>
          <th>Helm name</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="boat in boats" :key="boat.id">
          <td>{{ boat.nom }}</td>
          <td>{{ boat.classe }}</td>
          <td>{{ boat.numeroVoile }}</td>
          <td>{{ boat.barreur }}</td>
          <td class="text-nowrap">
            <RouterLink
              class="btn btn-sm btn-secondary mr-2"
              :to="{ name: 'boat-edit', params: { id: String(boat.id) } }"
            >
              Edit
            </RouterLink>
            <RouterLink
              class="btn btn-sm btn-danger"
              :to="{ name: 'boat-delete', params: { id: String(boat.id) } }"
            >
              Delete
            </RouterLink>
          </td>
        </tr>
      </tbody>
    </DataTable>
  </main>
</template>

