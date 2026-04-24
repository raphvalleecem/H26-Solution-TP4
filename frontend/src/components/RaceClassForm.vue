<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';
import { type HandicapType } from '../models/handicapTypes';
import { type RaceClassType } from '../models/raceClassTypes';
import axios from 'axios';
import type { RaceClass } from '@/models/raceClasses.ts';

const raceClasseTypes = ref<RaceClassType[]>([]);
const handicapTypes = ref<HandicapType[]>([]);

type RaceClassFormViewModel = {
  name: string;
  minHandicap: number;
  maxHandicap: number;
  handicapTypeId: number;
  raceClassTypeId: number;
};

type RaceClassFormSubmitModel = Omit<RaceClass, 'id'>;

const props = withDefaults(
  defineProps<{
    title: string;
    submitLabel: string;
    initialValue?: RaceClassFormViewModel;
  }>(),
  {
    initialValue: () => ({
      name: '',
      minHandicap: 0,
      maxHandicap: 0,
      handicapTypeId: 0,
      raceClassTypeId: 0,
    }),
  },
);

onMounted(async () => {
  await loadRaceClasseTypes();
  await loadHandicapTypes();

  if (form.raceClassTypeId === 0 && raceClasseTypes.value.length > 0) {
    form.raceClassTypeId = raceClasseTypes.value[0]?.id || 0;
  }

  if (form.handicapTypeId === 0 && handicapTypes.value.length > 0) {
    form.handicapTypeId = handicapTypes.value[0]?.id || 0;
  }
});

async function loadRaceClasseTypes() {
  raceClasseTypes.value = await getRaceClassTypes();
}

async function loadHandicapTypes() {
  handicapTypes.value = await getHandicapTypes();
}

async function getRaceClassTypes(): Promise<RaceClassType[]> {
  try {
    const response = await axios.get<RaceClassType[]>('http://localhost:3000/race-class-type');
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

async function getHandicapTypes(): Promise<HandicapType[]> {
  try {
    const response = await axios.get<HandicapType[]>('http://localhost:3000/handicap-type');
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

const emit = defineEmits<{
  'submit-class': [value: RaceClassFormSubmitModel];
  cancel: [];
}>();

const form = reactive<RaceClassFormViewModel>({ ...props.initialValue });

function onSubmit() {
  const selectedHandicapType = handicapTypes.value.find((type) => type.id === form.handicapTypeId);
  const selectedRaceClassType = raceClasseTypes.value.find(
    (type) => type.id === form.raceClassTypeId,
  );

  if (!selectedHandicapType || !selectedRaceClassType) {
    return;
  }

  emit('submit-class', {
    name: form.name,
    minHandicap: form.minHandicap,
    maxHandicap: form.maxHandicap,
    handicapType: selectedHandicapType,
    raceClassType: selectedRaceClassType,
  });
}
</script>

<template>
  <section class="container mt-3">
    <h1 class="mb-3">{{ title }}</h1>

    <form @submit.prevent="onSubmit">
      <div class="form-group">
        <label for="class-name">Name</label>
        <input id="class-name" v-model.trim="form.name" class="form-control" required type="text" />
      </div>

      <div class="form-group">
        <label for="min-handicap">Min handicap</label>
        <input
          id="min-handicap"
          v-model.number="form.minHandicap"
          class="form-control"
          required
          step="0.01"
          type="number"
        />
      </div>

      <div class="form-group">
        <label for="max-handicap">Max handicap</label>
        <input
          id="max-handicap"
          v-model.number="form.maxHandicap"
          class="form-control"
          required
          step="0.01"
          type="number"
        />
      </div>

      <div class="form-group">
        <label for="handicap-type">Handicap type</label>
        <select
          id="handicap-type"
          v-model.number="form.handicapTypeId"
          class="form-control"
          required
        >
          <option v-for="type in handicapTypes" :key="type.id" :value="type.id">
            {{ type.name }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="class-type">Race class type</label>
        <select id="class-type" v-model.number="form.raceClassTypeId" class="form-control" required>
          <option v-for="type in raceClasseTypes" :key="type.id" :value="type.id">
            {{ type.name }}
          </option>
        </select>
      </div>

      <div class="d-flex">
        <button class="btn btn-primary mr-2" type="submit">{{ submitLabel }}</button>
        <button class="btn btn-outline-secondary" type="button" @click="emit('cancel')">
          Cancel
        </button>
      </div>
    </form>
  </section>
</template>
