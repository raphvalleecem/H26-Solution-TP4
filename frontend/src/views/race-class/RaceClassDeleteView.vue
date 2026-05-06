<script lang="ts" setup>
import axios from 'axios';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { findRaceClassById, getRaceClasses } from '@/models/raceClass.ts';

const route = useRoute();
const router = useRouter();
const isLoading = ref(true);
const isDeleting = ref(false);
const errorMessage = ref('');

const classId = computed(() => Number.parseInt(String(route.params.id), 10));
const raceClass = computed(() =>
  Number.isNaN(classId.value) ? undefined : findRaceClassById(classId.value),
);

onMounted(async () => {
  await getRaceClasses();
  isLoading.value = false;
});

async function confirmDelete() {
  // Protect against invalid id or already deleting
  if (Number.isNaN(classId.value) || isDeleting.value) {
    return;
  }

  if (!confirm('Are you sure you want to delete this race class?')) {
    return;
  }

  isDeleting.value = true;
  errorMessage.value = '';

  try {
    await axios.post('/race-class/delete', { id: classId.value });
    // After successful deletion, navigate back to the list
    await router.push({ name: 'race-class' });
  } catch (err) {
    console.error('Delete error:', err);
    errorMessage.value = 'Unable to delete race class. Please try again.';
  } finally {
    isDeleting.value = false;
  }
}
</script>

<template>
  <section class="container mt-3">
    <h1>Delete race class</h1>

    <div v-if="isLoading" class="alert alert-info mt-3">Loading race class...</div>
    <div v-else-if="!raceClass" class="alert alert-warning mt-3">Race class not found.</div>
    <div v-else-if="errorMessage" class="alert alert-danger mt-3">{{ errorMessage }}</div>

    <div v-else class="card mt-3">
      <div class="card-body">
        <p class="mb-2"><strong>#:</strong> {{ raceClass.id }}</p>
        <p class="mb-2"><strong>Name:</strong> {{ raceClass.name }}</p>
        <p class="text-danger">Are you sure you want to delete this race class?</p>

        <button
          class="btn btn-danger mr-2"
          type="button"
          @click="confirmDelete"
          :disabled="isDeleting"
        >
          {{ isDeleting ? 'Deleting...' : 'Delete' }}
        </button>
        <RouterLink :to="{ name: 'race-class' }" class="btn btn-outline-secondary"
          >Cancel</RouterLink
        >
      </div>
    </div>
  </section>
</template>
