<script lang="ts" setup>
import axios from 'axios';
import { computed, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import DataTable from 'datatables.net-vue3';
import DataTablesCore from 'datatables.net-bs4';
import type { Boat } from '@/models/boats.ts';
import { getHandicapTypes } from '@/models/handicapTypes.ts';

DataTable.use(DataTablesCore);

const boats = ref<Boat[]>([]);
const isLoading = ref(true);
const errorMessage = ref('');
const hasBoats = computed(() => boats.value.length > 0);

async function loadBoats() {
  isLoading.value = true;
  errorMessage.value = '';

  try {
    const response = await axios.get<Boat[]>('/boat');
    boats.value = response.data;
  } catch {
    errorMessage.value = 'Unable to load boats. Please try again.';
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  void loadBoats();
});

function getBoatClassLabel(boat: Boat): string {
  if (boat.name) {
    return boat.name;
  }

  if (boat.boatClassId !== null) {
    return `#${boat.boatClassId}`;
  }

  return '-';
}

</script>

<template>
  <main class="container mt-3">
    <h1>Boats</h1>
    <RouterLink :to="{ name: 'boat-create' }" class="btn btn-sm btn-primary mr-2"
      >Create</RouterLink
    >

    <div v-if="errorMessage" class="alert alert-danger mt-3" role="alert">
      {{ errorMessage }}
    </div>

    <div v-if="isLoading" class="mt-3">Loading boats...</div>
    <div v-else-if="!hasBoats" class="mt-3">No boat found.</div>

    <DataTable v-else class="table table-striped table-bordered mt-3">
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Sail number</th>
          <th>Helm name</th>
          <th>Boat class</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="boat in boats" :key="boat.id">
          <td>{{ boat.id }}</td>
          <td>{{ boat.name }}</td>
          <td>{{ boat.sailNumber }}</td>
          <td>{{ boat.helmName }}</td>
          <td>
            <RouterLink v-if="boat.boatClassId !== null" :to="`/boat-class/${boat.boatClassId}`">
              {{ getBoatClassLabel(boat) }}
            </RouterLink>
            <span v-else>-</span>
          </td>
          <td>
            <RouterLink :to="`/boat/${boat.id}`" class="btn btn-sm btn-secondary"
              >Details</RouterLink
            >
          </td>
        </tr>
      </tbody>
    </DataTable>
  </main>
</template>
