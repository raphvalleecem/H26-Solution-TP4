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
    title: 'Handicap range',
    render: (data: RaceClass) => {
      const min = data.minHandicap ?? '?';
      const max = data.maxHandicap ?? '?';
      return `${min} - ${max}`;
    },
  },
  {
    data: null,
    title: 'Handicap type',
    render: (data: RaceClass) => {
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
