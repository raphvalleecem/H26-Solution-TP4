<script lang="ts" setup>
import axios from 'axios';
import { computed, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import DataTable from 'datatables.net-vue3';
import DataTablesCore from 'datatables.net-bs4';
import type { BoatClass } from '@/models/boatClasses.ts';

DataTable.use(DataTablesCore);

const boatClasses = ref<BoatClass[]>([]);
const isLoading = ref(true);
const errorMessage = ref('');
const hasBoatClasses = computed(() => boatClasses.value.length > 0);

async function loadBoatClasses() {
  isLoading.value = true;
  errorMessage.value = '';

  try {
    const response = await axios.get<BoatClass[]>('/boat-class');
    boatClasses.value = response.data;
  } catch {
    errorMessage.value = 'Unable to load boat classes. Please try again.';
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  void loadBoatClasses();
});

</script>

<template>
  <main class="container mt-3">
    <h1>Boat classes</h1>
    <RouterLink :to="{ name: 'boat-class-create' }" class="btn btn-sm btn-primary mr-2"
      >Create</RouterLink
    >

    <div v-if="errorMessage" class="alert alert-danger mt-3" role="alert">
      {{ errorMessage }}
    </div>

    <div v-if="isLoading" class="mt-3">Loading boat classes...</div>
    <div v-else-if="!hasBoatClasses" class="mt-3">No boat class found.</div>

    <DataTable v-else class="table table-striped table-bordered mt-3">
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
          <td>{{ item.handicapType.name }}</td>
          <td>
            <RouterLink :to="`/boat-class/${item.id}`" class="btn btn-sm btn-secondary"
              >Details</RouterLink
            >
          </td>
        </tr>
      </tbody>
    </DataTable>
  </main>
</template>
