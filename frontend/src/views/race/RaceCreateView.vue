<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import RaceForm from '../../components/RaceForm.vue';
import { addRace, type RaceCreatePayload } from '@/models/races.ts';
import { getRaceClasses, type RaceClass } from '@/models/raceClass.ts';
import { getSeries, type Series } from '@/models/series.ts';

const router = useRouter();
const raceClasses = ref<RaceClass[]>([]);
const seriesRows = ref<Series[]>([]);
const raceClassesLoaded = ref(false);
const isSubmitting = ref(false);
  raceClassesLoaded.value = true;
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
     // Combine date and time into a single ISO datetime string
     const [hours, minutes] = payload.startTime.split(':');
     const startDateTime = new Date(`${payload.date}T${hours}:${minutes}:00`);

     if (isNaN(startDateTime.getTime())) {
        errorMessage.value = 'Unable to create race: Invalid date or time format';
        return;
     }

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
       startTime: startDateTime.toISOString(),
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
  <div v-if="raceClassesLoaded && raceClasses.length === 0" class="container mt-3">
    <div class="alert alert-warning">
      <h4 class="alert-heading">Aucune race class</h4>
      <p>Vous devez créer au moins une race class avant de pouvoir créer une course.</p>
      <RouterLink :to="{ name: 'race-class-create' }" class="btn btn-primary">Create race class</RouterLink>
      <RouterLink :to="{ name: 'race-class' }" class="btn btn-link">Voir les race classes</RouterLink>
    </div>
  </div>

  <RaceForm
    v-else
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
