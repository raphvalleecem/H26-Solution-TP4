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
     const startDateTime = `${payload.date}T${payload.startTime}:00`;

     const createPayload: {
       name: string;
       date: string;
       startTime: string;
       course: string;
       raceClassId: number;
       seriesId?: number;
       isCompleted: boolean;
     } = {
       name: payload.name,
       date: payload.date,
       startTime: startDateTime,
       course: payload.track,
       raceClassId: payload.raceClassId,
       isCompleted: false,
     };

      if (payload.seriesId > 0) {
        createPayload.seriesId = payload.seriesId;
      }

     console.log('Creating race with payload:', createPayload);
      await addRace(createPayload);
     console.log('Race created successfully');
     await router.push({ name: 'race' });
   } catch (error) {
     console.error('Error creating race:', error);
     if (error instanceof Error) {
       errorMessage.value = `Unable to create race: ${error.message}`;
     } else {
       errorMessage.value = 'Unable to create race. Please try again.';
     }
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
