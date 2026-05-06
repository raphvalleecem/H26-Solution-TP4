<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getRaceById, type Race } from '@/models/races.ts';

const route = useRoute();
const router = useRouter();

const raceId = computed(() => Number.parseInt(String(route.params.id), 10));
const race = ref<Race | null>(null);
const isLoading = ref(true);
const errorMessage = ref('');

async function loadRace() {
  if (Number.isNaN(raceId.value)) {
    race.value = null;
    errorMessage.value = 'Invalid race id.';
    isLoading.value = false;
    return;
  }

  isLoading.value = true;
  errorMessage.value = '';

  try {
    race.value = (await getRaceById(raceId.value)) ?? null;

    if (!race.value) {
      errorMessage.value = 'Race not found.';
    }
  } catch {
    race.value = null;
    errorMessage.value = 'Unable to load race details. Please try again.';
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  void loadRace();
});

watch(raceId, () => {
  void loadRace();
});

function confirmDelete() {
  router.push({ name: 'race' });
}
</script>

<template>
  <section class="container mt-3">
    <h1>Delete race</h1>

    <div v-if="isLoading" class="alert alert-info mt-3">Loading race...</div>
    <div v-else-if="errorMessage" class="alert alert-danger mt-3">{{ errorMessage }}</div>

    <template v-else-if="race">
      <div class="card mt-3">
        <div class="card-body">
          <p class="mb-2"><strong>#:</strong> {{ race.id }}</p>
          <p class="mb-2"><strong>Name:</strong> {{ race.name }}</p>
          <p class="text-danger">Prototype UX: confirmation returns to index only.</p>

          <button class="btn btn-danger mr-2" type="button" @click="confirmDelete">Delete</button>
          <RouterLink :to="{ name: 'race' }" class="btn btn-outline-secondary">Cancel</RouterLink>
        </div>
      </div>
    </template>

    <div v-else class="alert alert-warning mt-3">Race not found.</div>
  </section>
</template>
