<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import DataTable from 'datatables.net-vue3';
import DataTablesCore from 'datatables.net-bs4';
import { getRaceClasses, type RaceClass } from '@/models/raceClass.ts';
import { getRaces, type Race } from '@/models/races.ts';
import { getSeries, type Series } from '@/models/series.ts';

DataTable.use(DataTablesCore);

const router = useRouter();
const races = ref<Race[]>([]);
const raceClasses = ref<RaceClass[]>([]);
const seriesRows = ref<Series[]>([]);

onMounted(async () => {
  races.value = await getRaces();
  raceClasses.value = await getRaceClasses();
  seriesRows.value = await getSeries();
});

const columns = [
  { data: 'id', title: '#' },
  { data: 'name', title: 'Name' },
  { data: 'startDate', title: 'Date', defaultContent: '-' },
  { data: 'startTime', title: 'Start time', defaultContent: '-' },
  { data: 'track', title: 'Track' },
  {
    data: null,
    title: 'Race class',
    render: (data: Race) => {
      const name = data.raceClass.name;
      if (name) {
        return `<a href="/race-class/${data.raceClass.id}" class="race-class-link" data-id="${data.raceClass.id}">${name}</a>`;
      }
      return `?`;
    },
  },
  {
    data: 'series',
    title: 'Series',
    render: (id: number) => {
      if (id === 0 || id === null) {
        return 'Hors-série';
      }
      const name = seriesRows.value.find((item) => item.id === id)?.name ?? `#${id}`;
      return `<a href="/series/${id}" class="series-link" data-id="${id}">${name}</a>`;
    },
  },
  {
    data: null,
    title: 'Actions',
    render: (data: Race) => {
      return `<a href="/race/${data.id}" class="btn btn-sm btn-secondary race-details" data-id="${data.id}">Details</a>`;
    },
    orderable: false,
    searchable: false,
  },
];

function handleTableClick(event: MouseEvent) {
  const target = event.target as HTMLElement;
  if (target.classList.contains('race-class-link')) {
    event.preventDefault();
    const id = target.getAttribute('data-id');
    router.push(`/race-class/${id}`);
  } else if (target.classList.contains('series-link')) {
    event.preventDefault();
    const id = target.getAttribute('data-id');
    router.push(`/series/${id}`);
  } else if (target.classList.contains('race-details')) {
    event.preventDefault();
    const id = target.getAttribute('data-id');
    router.push(`/race/${id}`);
  }
}
</script>

<template>
  <main class="container mt-3">
    <h1>Races</h1>
    <RouterLink :to="{ name: 'race-create' }" class="btn btn-sm btn-primary mr-2"
      >Create</RouterLink
    >

    <DataTable
      :columns="columns"
      :data="races"
      class="table table-striped table-bordered mt-3"
      @click="handleTableClick"
    />
  </main>
</template>
