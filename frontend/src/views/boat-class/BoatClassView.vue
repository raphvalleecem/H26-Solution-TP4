<script lang="ts" setup>
import axios from 'axios';
import { computed, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import DataTable from 'datatables.net-vue3';
import DataTablesCore from 'datatables.net-bs4';
import { handicapTypes } from '@/models/handicapTypes.ts';

DataTable.use(DataTablesCore);

type BoatClassRow = {
  id: number;
  name: string;
  handicapValue: number;
  handicapTypeId: number | null;
  handicapTypeName: string | null;
};

type BoatClassApiRow = {
  id?: unknown;
  name?: unknown;
  handicapValue?: unknown;
  handicap_value?: unknown;
  handicapTypeId?: unknown;
  handicap_type_id?: unknown;
  handicapType?: { id?: unknown; name?: unknown } | string | null;
};

const boatClasses = ref<BoatClassRow[]>([]);
const isLoading = ref(true);
const errorMessage = ref('');
const hasBoatClasses = computed(() => boatClasses.value.length > 0);

async function loadBoatClasses() {
  isLoading.value = true;
  errorMessage.value = '';

  try {
    const response = await axios.get<BoatClassApiRow[]>('/boat-class');
    boatClasses.value = response.data.map((row) => normalizeBoatClass(row));
  } catch {
    errorMessage.value = 'Unable to load boat classes. Please try again.';
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  void loadBoatClasses();
});

function toNumberOrNull(value: unknown): number | null {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeBoatClass(row: BoatClassApiRow): BoatClassRow {
  const handicapTypeObj =
    typeof row.handicapType === 'object' && row.handicapType !== null ? row.handicapType : null;
  const fallbackTypeName = typeof row.handicapType === 'string' ? row.handicapType : null;

  return {
    id: toNumberOrNull(row.id) ?? 0,
    name: typeof row.name === 'string' ? row.name : '',
    handicapValue: toNumberOrNull(row.handicapValue ?? row.handicap_value) ?? 0,
    handicapTypeId:
      toNumberOrNull(row.handicapTypeId ?? row.handicap_type_id) ??
      toNumberOrNull(handicapTypeObj?.id),
    handicapTypeName:
      (typeof handicapTypeObj?.name === 'string' ? handicapTypeObj.name : null) ?? fallbackTypeName,
  };
}

function getHandicapTypeName(item: BoatClassRow): string {
  if (item.handicapTypeName) {
    return item.handicapTypeName;
  }

  if (item.handicapTypeId !== null) {
    return (
      handicapTypes.find((type) => type.id === item.handicapTypeId)?.name ??
      `#${item.handicapTypeId}`
    );
  }

  return 'Unknown';
}
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
          <td>{{ getHandicapTypeName(item) }}</td>
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
