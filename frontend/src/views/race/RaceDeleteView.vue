<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { findRaceById } from '@/models/races.ts';

const route = useRoute();
const router = useRouter();

const raceId = computed(() => Number.parseInt(String(route.params.id), 10));
const race = computed(() => (Number.isNaN(raceId.value) ? undefined : findRaceById(raceId.value)));

function confirmDelete() {
  router.push({ name: 'race' });
}
</script>

<template>
  <section class="container mt-3">
    <h1>Delete race</h1>

    <div v-if="!race" class="alert alert-warning mt-3">Race not found.</div>

    <div v-else class="card mt-3">
      <div class="card-body">
        <p class="mb-2"><strong>#:</strong> {{ race.id }}</p>
        <p class="mb-2"><strong>Name:</strong> {{ race.name }}</p>
        <p class="text-danger">Prototype UX: confirmation returns to index only.</p>

        <button class="btn btn-danger mr-2" type="button" @click="confirmDelete">Delete</button>
        <RouterLink :to="{ name: 'race' }" class="btn btn-outline-secondary">Cancel</RouterLink>
      </div>
    </div>
  </section>
</template>
