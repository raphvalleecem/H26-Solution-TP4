<script lang="ts" setup>
import ListBoats from '../components/ListBoats.vue'
import DataTable from 'datatables.net-vue3'
import DataTablesCore from 'datatables.net-bs4'

DataTable.use(DataTablesCore)

const data = [
  [1, 2],
  [3, 4],
]
</script>

<template>
  <main>
    <p>Boat</p>
    <ListBoats />
    <DataTable :data="data" class="table table-striped table-bordered">
      <thead>
        <tr>
          <th>A</th>
          <th>B</th>
        </tr>
      </thead>
    </DataTable>
  </main>
</template>
