<script lang="ts" setup>
import { RouterLink, useRouter } from 'vue-router';
import DataTable from 'datatables.net-vue3';
import DataTablesCore from 'datatables.net-bs4';
import { onMounted, ref } from 'vue';
import { getSeries, type Series } from '@/models/series.ts';

DataTable.use(DataTablesCore);

const series = ref<Series[]>([]);
const router = useRouter();

onMounted(async () => {
  await loadSeries();
});

async function loadSeries() {
  series.value = await getSeries();
}

function handleTableClick(event: MouseEvent) {
  const target = event.target as HTMLElement;

  if (target.classList.contains('race-class-link')) {
    event.preventDefault();
    const id = target.getAttribute('data-id');
    if (id) router.push(`/race-class/${id}`);
  } else if (target.classList.contains('series-details')) {
    event.preventDefault();
    const id = target.getAttribute('data-id');
    if (id) router.push(`/series/${id}`);
  }
}

const columns = [
  { data: 'id', title: '#' },
  { data: 'name', title: 'Name' },
  { data: 'nbRaces', title: 'Nb Races' },
  { data: 'nbRacesToCount', title: 'Nb Races To Count' },
  {
    data: null,
    title: 'Race class',
    render: (data: Series) => {
      return `<a href="/race-class/${data.raceClass.id}" class="race-class-link" data-id="${data.raceClass.id}">${data.raceClass.name}</a>`;
    },
  },
  {
    data: null,
    title: 'Actions',
    render: (data: Series) => {
      return `<a href="/series/${data.id}" class="btn btn-sm btn-secondary series-details" data-id="${data.id}">Details</a>`;
    },
    orderable: false,
    searchable: false,
  },
];
</script>

<template>
  <main class="container mt-3">
    <h1>Series</h1>
    <RouterLink :to="{ name: 'series-create' }" class="btn btn-sm btn-primary mr-2"
      >Create</RouterLink
    >

    <DataTable
      :columns="columns"
      :data="series"
      class="table table-striped table-bordered mt-3"
      @click="handleTableClick"
    />
  </main>
</template>
