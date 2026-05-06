<script lang="ts" setup>
import axios from 'axios';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import DataTable from 'datatables.net-vue3';
import DataTablesCore from 'datatables.net-bs4';
import { getHandicapTypes, type HandicapType } from '@/models/handicapTypes.ts';
import type { BoatClass } from '@/models/boatClasses.ts';

DataTable.use(DataTablesCore);

type Boat = {
  id: number;
  name: string;
  helmName: string;
  boatClassId: number;
};

const route = useRoute();
const classId = computed(() => Number.parseInt(String(route.params.id), 10));

const boats = ref<Boat[]>([]);
const handicapTypes = ref<HandicapType[]>([]);
const boatClass = ref<BoatClass | null>(null);

const isLoading = ref(true);
const isEditing = ref(false);
const errorMessage = ref('');
const form = reactive({
  name: '',
  handicapValue: '' as string | number,
  handicapTypeId: '' as string | number,
});
const original = ref('');

const hasChanges = computed(() => JSON.stringify(form) !== original.value);

const relatedBoats = computed(() => {
  if (!boatClass.value) {
    return [];
  }
  return boats.value.filter((boat) => boat.boatClassId === boatClass.value!.id);
});

onMounted(async () => {
  await loadHandicapTypes();
  void fetchBoatClass();
});

function startEdit() {
  isEditing.value = true;
}

function cancelEdit() {
  if (!boatClass.value) {
    return;
  }
  Object.assign(form, {
    name: boatClass.value.name,
    handicapValue: boatClass.value.handicapValue,
    handicapTypeId: boatClass.value.handicapType.id,
  });
  isEditing.value = false;
}

async function saveChanges() {
  if (!hasChanges.value || !boatClass.value) {
    return;
  }

  original.value = JSON.stringify(form);
  isEditing.value = false;

  try {
    await axios.post('/boat-class/update', {
      id: boatClass.value.id,
      name: form.name,
      handicapValue: form.handicapValue,
      handicapTypeId: form.handicapTypeId,
    });
    original.value = JSON.stringify(form);
    isEditing.value = false;
    errorMessage.value = '';
  } catch {
    errorMessage.value = 'Unable to save boat class. Please try again.';
  }
}

async function fetchBoatClass() {
  if (Number.isNaN(classId.value)) {
    boatClass.value = null;
    errorMessage.value = 'Invalid boat class id.';
    isLoading.value = false;
    return;
  }

  isLoading.value = true;
  errorMessage.value = '';

  try {
    const response = await axios.get<BoatClass>(`/boat-class/${classId.value}`);
    const data: BoatClass = response.data;

    const loadedBoatClass: BoatClass = {
      id: data.id,
      name: data.name,
      handicapValue: data.handicapValue,
      handicapType: data.handicapType,
    };

    boatClass.value = loadedBoatClass;
    Object.assign(form, {
      name: loadedBoatClass.name,
      handicapValue: loadedBoatClass.handicapValue,
      handicapTypeId: loadedBoatClass.handicapType.id,
    });
    original.value = JSON.stringify(form);

    try {
      const boatsResponse = await axios.get<Boat[]>('/boat');
      boats.value = boatsResponse.data;
    } catch {
      boats.value = [];
    }
  } catch {
    boatClass.value = null;
    errorMessage.value = 'Unable to load boat class details. Please try again.';
  } finally {
    isLoading.value = false;
  }
}

watch(classId, () => {
  void fetchBoatClass();
});

async function loadHandicapTypes() {
  handicapTypes.value = await getHandicapTypes();
}
</script>

<template>
  <section class="container mt-3">
    <h1>Boat class details</h1>

    <div v-if="isLoading" class="alert alert-info mt-3">Loading boat class details...</div>
    <div v-else-if="errorMessage" class="alert alert-danger mt-3">{{ errorMessage }}</div>
    <div v-else-if="!boatClass" class="alert alert-warning mt-3">Boat class not found.</div>

    <div v-else>
      <table class="table table-bordered mt-3">
        <tbody>
          <tr>
            <th style="width: 220px">#</th>
            <td>{{ boatClass.id }}</td>
          </tr>
          <tr>
            <th>Name</th>
            <td>
              <input v-model="form.name" :readonly="!isEditing" class="form-control" type="text" />
            </td>
          </tr>
          <tr>
            <th>Handicap value</th>
            <td>
              <input
                v-model="form.handicapValue"
                :readonly="!isEditing"
                class="form-control"
                type="text"
              />
            </td>
          </tr>
          <tr>
            <th>Handicap type</th>
            <td>
              <span v-if="!isEditing">{{ boatClass.handicapType.name }}</span>
              <select v-else v-model.number="form.handicapTypeId" class="form-control">
                <option v-for="item in handicapTypes" :key="item.id" :value="item.id">
                  {{ item.name }}
                </option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="d-flex gap-2 mb-3">
        <button v-if="!isEditing" class="btn btn-primary" type="button" @click="startEdit">
          Edit
        </button>
        <button
          v-else
          :disabled="!hasChanges"
          class="btn btn-primary"
          type="button"
          @click="saveChanges"
        >
          Save changes
        </button>
        <button
          v-if="isEditing"
          class="btn btn-outline-secondary"
          type="button"
          @click="cancelEdit"
        >
          Cancel
        </button>
        <RouterLink :to="`/boat-class/delete/${boatClass.id}`" class="btn btn-danger"
          >Delete</RouterLink
        >
      </div>

      <h2 class="h4 mt-4">Boats in this class</h2>
      <DataTable class="table table-striped table-bordered mt-2">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Helm</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="boat in relatedBoats" :key="boat.id">
            <td>{{ boat.id }}</td>
            <td>
              <RouterLink :to="`/boat/${boat.id}`">{{ boat.name }}</RouterLink>
            </td>
            <td>{{ boat.helmName }}</td>
          </tr>
        </tbody>
      </DataTable>
    </div>
  </section>
</template>
