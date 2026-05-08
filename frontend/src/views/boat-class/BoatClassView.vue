<script lang="ts" setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import DataTable from 'datatables.net-vue3';
import DataTablesCore from 'datatables.net-bs4';
import type { BoatClass } from '@/models/boatClasses.ts';

DataTable.use(DataTablesCore);

const boatClasses = ref<BoatClass[]>([]);
const router = useRouter();

onMounted(async () => {
  await loadBoatClasses();
});

async function loadBoatClasses() {
  try {
    const response = await axios.get<BoatClass[]>('/boat-class');
    boatClasses.value = response.data;
  } catch {
    boatClasses.value = [];
  }
}

function handleTableClick(event: MouseEvent) {
  const target = event.target as HTMLElement;

  if (target.classList.contains('boat-class-details')) {
    event.preventDefault();
    const id = target.getAttribute('data-id');
    if (id) router.push(`/boat-class/${id}`);
  }
}

const columns = [
  { data: 'id', title: '#' },
  { data: 'name', title: 'Name' },
  {
    data: null,
    title: 'Handicap value',
    render: (data: BoatClass) => `${data.handicapValue}`,
  },
  {
    data: null,
    title: 'Handicap type',
    render: (data: BoatClass) => {
      return data.handicapType.name;
    },
  },
  {
    data: null,
    title: 'Actions',
    render: (data: BoatClass) => {
      return `<a href="/boat-class/${data.id}" class="btn btn-sm btn-secondary boat-class-details" data-id="${data.id}">Details</a>`;
    },
    orderable: false,
    searchable: false,
  },
];
</script>

<template>
  <main class="container mt-3">
    <h1>Boat classes</h1>
    <RouterLink :to="{ name: 'boat-class-create' }" class="btn btn-sm btn-primary mr-2">
      Create
    </RouterLink>

    <DataTable
      :columns="columns"
      :data="boatClasses"
      class="table table-striped table-bordered mt-3"
      @click="handleTableClick"
    />
  </main>
</template>
