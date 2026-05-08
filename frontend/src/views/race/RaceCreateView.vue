<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import RaceForm from '../../components/RaceForm.vue';
import { addRace } from '@/models/races.ts';
import { getRaceClasses, type RaceClass } from '@/models/raceClass.ts';
import { getSeries, type Series } from '@/models/series.ts';

const router = useRouter();
const raceClasses = ref<RaceClass[]>([]);
const seriesRows = ref<Series[]>([]);
const isSubmitting = ref(false);
const errorMessage = ref('');

type RaceFormSubmitPayload = {
  name: string;
  date: string;
  startTime: string;
  track: string;
  raceClassId: number;
  seriesId: number;
};

onMounted(async () => {
  raceClasses.value = await getRaceClasses();
  seriesRows.value = await getSeries();
});

async function createRace(payload: RaceFormSubmitPayload) {
  isSubmitting.value = true;
  errorMessage.value = '';

  try {
    const selectedRaceClass = raceClasses.value.find((item) => item.id === payload.raceClassId);
    const selectedSeries = seriesRows.value.find((item) => item.id === payload.seriesId);

    if (!selectedRaceClass || !selectedSeries) {
      errorMessage.value = 'Please select a valid race class and series.';
      return;
    }

    const createPayload = {
      name: payload.name,
      date: payload.date,
      startTime: payload.startTime,
      track: payload.track,
      raceClass: selectedRaceClass,
      series: selectedSeries,
      isCompleted: false,
    } as any;

    await addRace(createPayload);
    await router.push({ name: 'race' });
  } catch {
    errorMessage.value = 'Unable to create race. Please try again.';
  } finally {
    isSubmitting.value = false;
  }
}

function cancel() {
  router.push({ name: 'race' });
}
</script>

<template>
  <RaceForm
    :race-classes="raceClasses"
    :series-rows="seriesRows"
    :is-submitting="isSubmitting"
    submit-label="Create"
    title="Create race"
    @cancel="cancel"
    @submit="createRace"
  />

  <div v-if="errorMessage" class="alert alert-danger mt-3">
    {{ errorMessage }}
  </div>
</template>
