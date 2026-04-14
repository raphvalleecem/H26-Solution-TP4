<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import DataTable from 'datatables.net-vue3'
import DataTablesCore from 'datatables.net-bs4'
import { getRaceClasses, type RaceClass } from '@/models/raceClasses.ts'
import { getRaces, type Race } from '@/models/races.ts'
import { getSeries, type Series } from '@/models/series.ts'

DataTable.use(DataTablesCore)

const router = useRouter()
const races = ref<Race[]>([])
const raceClasses = ref<RaceClass[]>([])
const seriesRows = ref<Series[]>([])

onMounted(async () => {
  races.value = await getRaces()
  raceClasses.value = await getRaceClasses()
  seriesRows.value = await getSeries()
})

const columns = [
  { data: 'id', title: '#' },
  { data: 'name', title: 'Name' },
  { data: 'date', title: 'Date', defaultContent: '-' },
  { data: 'startTime', title: 'Start time', defaultContent: '-' },
  { data: 'course', title: 'Course' },
  {
    data: 'raceClassId',
    title: 'Race class',
    render: (id: number) => {
      const name = raceClasses.value.find((item) => item.id === id)?.name ?? `#${id}`
      return `<a href="/race-class/${id}" class="race-class-link" data-id="${id}">${name}</a>`
    },
  },
  {
    data: 'seriesId',
    title: 'Series',
    render: (id: number) => {
      const name = seriesRows.value.find((item) => item.id === id)?.name ?? `#${id}`
      return `<a href="/series/${id}" class="series-link" data-id="${id}">${name}</a>`
    },
  },
  {
    data: null,
    title: 'Actions',
    render: (data: Race) => {
      return `<a href="/race/${data.id}" class="btn btn-sm btn-secondary race-details" data-id="${data.id}">Details</a>`
    },
    orderable: false,
    searchable: false,
  },
]

function handleTableClick(event: MouseEvent) {
  const target = event.target as HTMLElement
  if (target.classList.contains('race-class-link')) {
    event.preventDefault()
    const id = target.getAttribute('data-id')
    router.push(`/race-class/${id}`)
  } else if (target.classList.contains('series-link')) {
    event.preventDefault()
    const id = target.getAttribute('data-id')
    router.push(`/series/${id}`)
  } else if (target.classList.contains('race-details')) {
    event.preventDefault()
    const id = target.getAttribute('data-id')
    router.push(`/race/${id}`)
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
