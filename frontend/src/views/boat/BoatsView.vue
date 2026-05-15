<script lang="ts" setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import DataTable from 'datatables.net-vue3';
import DataTablesCore from 'datatables.net-bs4';
import type { Boat } from '@/models/boats.ts';
import type { BoatClass } from '@/models/boatClasses.ts';

DataTable.use(DataTablesCore);

const boats = ref<Boat[]>([]);
const boatClasses = ref<BoatClass[]>([]);
const router = useRouter();

onMounted(async () => {
  await Promise.all([loadBoats(), loadBoatClasses()]);
});

async function loadBoats() {
  try {
    const response = await axios.get<Boat[]>('/boat');
    boats.value = response.data;
  } catch {
    boats.value = [];
  }
}

async function loadBoatClasses() {
  try {
    const response = await axios.get<BoatClass[]>('/boat-class');
    boatClasses.value = response.data;
  } catch {
    boatClasses.value = [];
  }
}

function getBoatClassLabel(boat: Boat): string {
  type BoatRow = Boat & { boatClass?: { id: number; name?: string }; boatClassId?: number | null };
  const b = boat as BoatRow;
  const classId = b.boatClassId ?? b.boatClass?.id;
  const classNameFromBoat = b.boatClass?.name;

  if (classId === null || classId === undefined) {
    return '-';
  }

  if (typeof classNameFromBoat === 'string' && classNameFromBoat.length > 0) {
    return classNameFromBoat;
  }

  const bc = boatClasses.value.find((c) => Number(c.id) === Number(classId));
  if (bc) {
    return bc.name;
  }

  return `#${classId}`;
}

function handleTableClick(event: MouseEvent) {
  const target = event.target as HTMLElement;

  if (target.classList.contains('boat-details')) {
    event.preventDefault();
    const id = target.getAttribute('data-id');
    if (id) router.push(`/boat/${id}`);
  }
}

const columns = [
  { data: 'id', title: '#' },
  { data: 'name', title: 'Name' },
  { data: 'sailNumber', title: 'Sail number' },
  { data: 'helmName', title: 'Helm name' },
  {
    data: null,
    title: 'Boat class',
    render: (data: Boat) => getBoatClassLabel(data),
  },
  {
    data: null,
    title: 'Actions',
    render: (data: Boat) => {
      return `<a href="/boat/${data.id}" class="btn btn-sm btn-secondary boat-details" data-id="${data.id}">Details</a>`;
    },
    orderable: false,
    searchable: false,
  },
];
</script>

<template>
  <main class="container mt-3">
    <h1>Boats</h1>
    <RouterLink :to="{ name: 'boat-create' }" class="btn btn-sm btn-primary mr-2">
      Create
    </RouterLink>

    <DataTable
      :columns="columns"
      :data="boats"
      class="table table-striped table-bordered mt-3"
      @click="handleTableClick"
    />
  </main>
</template>
