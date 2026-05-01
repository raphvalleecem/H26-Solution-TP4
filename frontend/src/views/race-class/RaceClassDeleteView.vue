<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { findRaceClassById } from '@/models/raceClass.ts';

const route = useRoute();
const router = useRouter();

const classId = computed(() => Number.parseInt(String(route.params.id), 10));
const raceClass = computed(() =>
  Number.isNaN(classId.value) ? undefined : findRaceClassById(classId.value),
);

function confirmDelete() {
  router.push({ name: 'race-class' });
}
</script>

<template>
  <section class="container mt-3">
    <h1>Delete race class</h1>

    <div v-if="!raceClass" class="alert alert-warning mt-3">Race class not found.</div>

    <div v-else class="card mt-3">
      <div class="card-body">
        <p class="mb-2"><strong>#:</strong> {{ raceClass.id }}</p>
        <p class="mb-2"><strong>Name:</strong> {{ raceClass.name }}</p>
        <p class="text-danger">Prototype UX: confirmation returns to index only.</p>

        <button class="btn btn-danger mr-2" type="button" @click="confirmDelete">Delete</button>
        <RouterLink :to="{ name: 'race-class' }" class="btn btn-outline-secondary"
          >Cancel</RouterLink
        >
      </div>
    </div>
  </section>
</template>
