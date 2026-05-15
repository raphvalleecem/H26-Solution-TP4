<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import DataTable from 'datatables.net-vue3';
import DataTablesCore from 'datatables.net-bs4';
import { getRaceClasses, type RaceClass } from '@/models/raceClass.ts';

DataTable.use(DataTablesCore);

const raceClasses = ref<RaceClass[]>([]);
const router = useRouter();

onMounted(async () => {
  await loadRaceClasses();
});

async function loadRaceClasses() {
  raceClasses.value = await getRaceClasses();
}

function isMonotype(raceClass: RaceClass): boolean {
  return raceClass.raceClassType.name.toLowerCase().includes('monotype');
}

function handleTableClick(event: MouseEvent) {
  const target = event.target as HTMLElement;

  if (target.classList.contains('boat-class-link')) {
    event.preventDefault();
    const id = target.getAttribute('data-id');
    if (id) router.push(`/boat-class/${id}`);
  } else if (target.classList.contains('race-class-details')) {
    event.preventDefault();
    const id = target.getAttribute('data-id');
    if (id) router.push(`/race-class/${id}`);
  }
}

const columns = [
  { data: 'id', title: '#' },
  { data: 'name', title: 'Name' },
  {
    data: null,
    title: 'RaceClassType',
    render: (data: RaceClass) => `${data.raceClassType.name}`,
  },
  {
    data: null,
    title: 'Boat Class',
    render: (data: RaceClass) => {
      // If handicap values are both 0, it's a monotype
      if (data.minHandicap === 0 && data.maxHandicap === 0 && data.boatClass) {
        return `<a href="/boat-class/${data.boatClass.id}" class="boat-class-link" data-id="${data.boatClass.id}">${data.boatClass.name}</a>`;
      }
      return '-';
    },
  },
  {
    data: null,
    title: 'Handicap range',
    render: (data: RaceClass) => {
      // If handicap values are both 0, it's a monotype - show dash
      if (data.minHandicap === 0 && data.maxHandicap === 0) {
        return '-';
      }
      const min = data.minHandicap ?? '?';
      const max = data.maxHandicap ?? '?';
      return `${min} - ${max}`;
    },
  },
  {
    data: null,
    title: 'Handicap type',
    render: (data: RaceClass) => {
      // If handicap values are both 0, it's a monotype - show dash
      if (data.minHandicap === 0 && data.maxHandicap === 0) {
        return '-';
      }
      return data.handicapType.name;
    },
  },
  {
    data: null,
    title: 'Actions',
    render: (data: RaceClass) => {
      return `<a href="/race-class/${data.id}" class="btn btn-sm btn-secondary race-class-details" data-id="${data.id}">Details</a>`;
    },
    orderable: false,
    searchable: false,
  },
];
</script>

<template>
  <main class="container mt-3">
    <h1>Race classes</h1>
    <RouterLink :to="{ name: 'race-class-create' }" class="btn btn-sm btn-primary mr-2">
      Create
    </RouterLink>

    <DataTable
      :columns="columns"
      :data="raceClasses"
      class="table table-striped table-bordered mt-3"
      @click="handleTableClick"
    />
  </main>
</template>
