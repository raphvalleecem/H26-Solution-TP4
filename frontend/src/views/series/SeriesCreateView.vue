<script lang="ts" setup>
import { useRouter } from 'vue-router';
import SeriesForm from '../../components/SeriesForm.vue';
import { addSeries, type Series } from '@/models/series.ts';

const router = useRouter();

async function createSeries(value: Omit<Series, 'id'>) {
  await addSeries(value);
  await router.push({ name: 'series' });
}

function cancel() {
  router.push({ name: 'series' });
}
</script>

<template>
  <SeriesForm submit-label="Create" title="Create series" @cancel="cancel" @submit="createSeries" />
</template>
