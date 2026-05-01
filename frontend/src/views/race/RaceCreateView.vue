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

onMounted(async () => {
  raceClasses.value = await getRaceClasses();
  raceClassesLoaded.value = true;
  seriesRows.value = await getSeries();
});

async function createRace(payload: RaceCreatePayload) {
  await addRace(payload);
  await router.push({ name: 'race' });
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
    submit-label="Create"
    title="Create race"
    @cancel="cancel"
    @submit="createRace"
  />
</template>
