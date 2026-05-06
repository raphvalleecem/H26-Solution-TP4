<script lang="ts" setup>
import axios from 'axios';
import { computed, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import DataTable from 'datatables.net-vue3';
import DataTablesCore from 'datatables.net-bs4';
import type { Boat } from '@/models/boats.ts';
import type { BoatClass } from '@/models/boatClasses.ts';

DataTable.use(DataTablesCore);

const boats = ref<Boat[]>([]);
const boatClasses = ref<BoatClass[]>([]);
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

async function loadBoatClasses() {
  try {
    const response = await axios.get<BoatClass[]>('/boat-class');
    boatClasses.value = response.data;
  } catch {
    // keep boatClasses empty on error
  }
}

onMounted(() => {
  // load boats and boat classes in parallel
  void Promise.all([loadBoats(), loadBoatClasses()]);
});

function getBoatClassLabel(boat: Boat): string {
  type BoatRow = Boat & { boatClass?: { id: number; name?: string }; boatClassId?: number | null };
  const b = boat as BoatRow;
  const classId = b.boatClassId ?? b.boatClass?.id;
  const classNameFromBoat = b.boatClass?.name;

  if (classId === null || classId === undefined) {
    return '-';
  }

  // prefer name embedded in the boat object
  if (typeof classNameFromBoat === 'string' && classNameFromBoat.length > 0) {
    return classNameFromBoat;
  }

  const bc = boatClasses.value.find((c) => Number(c.id) === Number(classId));
  if (bc) {
    return bc.name;
  }

  return `#${classId}`;
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
        <tr v-if="!hasBoats">
          <td class="text-center">No boat found.</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr v-for="boat in boats" :key="boat.id">
          <td>{{ boat.id }}</td>
          <td>{{ boat.name }}</td>
          <td>{{ boat.sailNumber }}</td>
          <td>{{ boat.helmName }}</td>
                          <td>
                            <RouterLink
                              v-if="(boat as any).boatClassId !== null || (boat as any).boatClass?.id !== undefined"
                              :to="`/boat-class/${(boat as any).boatClassId ?? (boat as any).boatClass?.id}`"
                            >
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
