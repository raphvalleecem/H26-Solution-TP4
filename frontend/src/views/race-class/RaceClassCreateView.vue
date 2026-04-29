<script lang="ts" setup>
import { useRouter } from 'vue-router';
import RaceClassForm from '../../components/RaceClassForm.vue';
import { addRaceClass, type RaceClass } from '@/models/raceClasses.ts';

const router = useRouter();

async function createClass(payload: RaceClass) {
  await addRaceClass(payload);
  await router.push({ name: 'race-class' });
}

function cancel() {
  router.push({ name: 'race-class' });
}
</script>

<template>
  <RaceClassForm
    submit-label="Create"
    title="Create race class"
    @cancel="cancel"
    @submit-class="createClass"
  />
</template>
