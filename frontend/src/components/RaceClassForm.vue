<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue';
import axios from 'axios';
import { getHandicapTypes, type HandicapType } from '../models/handicapTypes';
import { getRaceClassTypes, type RaceClassType } from '../models/raceClassTypes';
import type { BoatClass } from '../models/boatClasses';
import type { RaceClass } from '@/models/raceClass.ts';

const raceClassTypes = ref<RaceClassType[]>([]);
const handicapTypes = ref<HandicapType[]>([]);
const boatClasses = ref<BoatClass[]>([]);

type RaceClassFormViewModel = {
  name: string;
  minHandicap: number;
  maxHandicap: number;
  handicapTypeId: number;
  raceClassTypeId: number;
  boatClassId: number;
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
      boatClassId: 0,
    }),
  },
);

onMounted(async () => {
  await loadRaceClassTypes();
  await loadHandicapTypes();
  await loadBoatClasses();

  if (form.raceClassTypeId === 0 && raceClassTypes.value.length > 0) {
    form.raceClassTypeId = raceClassTypes.value[0]?.id || 0;
  }

  if (form.handicapTypeId === 0 && handicapTypes.value.length > 0) {
    form.handicapTypeId = handicapTypes.value[0]?.id || 0;
  }

  if (form.boatClassId === 0 && boatClasses.value.length > 0) {
    form.boatClassId = boatClasses.value[0]?.id || 0;
  }
});

async function loadRaceClassTypes() {
  raceClassTypes.value = await getRaceClassTypes();
}

async function loadHandicapTypes() {
  handicapTypes.value = await getHandicapTypes();
}

async function loadBoatClasses() {
  try {
    const response = await axios.get<BoatClass[]>('/boat-class');
    boatClasses.value = response.data;
  } catch (error) {
    console.error('Error loading boat classes:', error);
    boatClasses.value = [];
  }
}

const emit = defineEmits<{
  submit: [value: RaceClassFormSubmitModel];
  cancel: [];
}>();

const form = reactive<RaceClassFormViewModel>({ ...props.initialValue });

const selectedRaceClassType = computed(() => {
  return raceClassTypes.value.find((type) => type.id === form.raceClassTypeId);
});

const isMonotype = computed(() => {
  return selectedRaceClassType.value?.name.toLowerCase().includes('monotype');
});

function onSubmit() {
  const selectedHandicapType = handicapTypes.value.find((type) => type.id === form.handicapTypeId);
  const selectedRaceClassTypeValue = raceClassTypes.value.find(
    (type) => type.id === form.raceClassTypeId,
  );
  const selectedBoatClass = boatClasses.value.find((boatClass) => boatClass.id === form.boatClassId);

  if (!selectedRaceClassTypeValue) {
    return;
  }

  // For monotype, we don't require handicap type
  if (!isMonotype.value && !selectedHandicapType) {
    return;
  }

  const submitData: RaceClassFormSubmitModel = {
    name: form.name,
    minHandicap: isMonotype.value ? 0 : form.minHandicap,
    maxHandicap: isMonotype.value ? 0 : form.maxHandicap,
    handicapType: selectedHandicapType || handicapTypes.value[0]!,
    raceClassType: selectedRaceClassTypeValue,
    boatClass: isMonotype.value ? selectedBoatClass ?? null : null,
  };

  emit('submit', submitData);
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
        <label for="class-type">Race class type</label>
        <select id="class-type" v-model.number="form.raceClassTypeId" class="form-control" required>
          <option v-for="type in raceClassTypes" :key="type.id" :value="type.id">
            {{ type.name }}
          </option>
        </select>
      </div>

      <!-- Monotype fields -->
      <div v-if="isMonotype" class="form-group">
        <label for="boat-class">Boat class</label>
        <select id="boat-class" v-model.number="form.boatClassId" class="form-control" required>
          <option v-for="boatClass in boatClasses" :key="boatClass.id" :value="boatClass.id">
            {{ boatClass.name }}
          </option>
        </select>
      </div>

      <!-- Handicap fields -->
      <template v-else>
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
      </template>

      <div class="d-flex">
        <button class="btn btn-primary mr-2" type="submit">{{ submitLabel }}</button>
        <button class="btn btn-outline-secondary" type="button" @click="emit('cancel')">
          Cancel
        </button>
      </div>
    </form>
  </section>
</template>
