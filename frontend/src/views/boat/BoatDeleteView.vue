<script lang="ts" setup>
import axios from 'axios';
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { findBoatById } from '@/models/boats.ts';

const route = useRoute();
const router = useRouter();

const boatId = computed(() => Number.parseInt(String(route.params.id), 10));
const boat = computed(() => (Number.isNaN(boatId.value) ? undefined : findBoatById(boatId.value)));

const isDeleting = ref(false);
const errorMessage = ref('');

async function confirmDelete() {
  if (Number.isNaN(boatId.value) || isDeleting.value) return;

  if (!confirm('Are you sure you want to delete this boat?')) return;

  isDeleting.value = true;
  errorMessage.value = '';

  try {
    await axios.post('/boat/delete', { id: boatId.value });
    await router.push({ name: 'boat' });
  } catch (err) {
    console.error('Delete boat error:', err);
    errorMessage.value = 'Unable to delete boat. Please try again.';
  } finally {
    isDeleting.value = false;
  }
}

</script>

<template>
  <section class="container mt-3">
    <h1>Delete boat</h1>

    <div v-if="errorMessage" class="alert alert-danger mt-3">{{ errorMessage }}</div>
    <div v-else-if="!boat" class="alert alert-warning mt-3">Boat not found.</div>

    <div v-else class="card mt-3">
      <div class="card-body">
        <p class="mb-2"><strong>#:</strong> {{ boat.id }}</p>
        <p class="mb-2"><strong>Name:</strong> {{ boat.name }}</p>
        <p class="mb-2"><strong>Sail:</strong> {{ boat.sailNumber }}</p>
        <p class="mb-3"><strong>Helm:</strong> {{ boat.helmName }}</p>
        <p class="text-danger">Prototype UX: confirmation returns to index only.</p>

        <button class="btn btn-danger mr-2" type="button" @click="confirmDelete" :disabled="isDeleting">
          {{ isDeleting ? 'Deleting...' : 'Delete' }}
        </button>
        <RouterLink :to="{ name: 'boat' }" class="btn btn-outline-secondary">Cancel</RouterLink>
      </div>
    </div>
  </section>
</template>
