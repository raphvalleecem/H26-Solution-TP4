<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';
import { getRaceClasses, type RaceClass } from '@/models/raceClass.ts';
import type { Series } from '@/models/series.ts';

const raceClasses = ref<RaceClass[]>([]);

type SeriesFormViewModel = {
  name: string;
  nbRaces: number;
  nbRacesToCount: number;
  isCompleted: boolean;
  raceClassId: number;
};

type SeriesFormSubmitModel = Omit<Series, 'id'>;

const props = withDefaults(
  defineProps<{
    title: string;
    submitLabel: string;
    initialValue?: SeriesFormViewModel;
  }>(),
  {
    initialValue: () => ({
      name: '',
      nbRaces: 1,
      nbRacesToCount: 1,
      isCompleted: false,
      raceClassId: 0,
    }),
  },
);

onMounted(async () => {
  await loadRaceClassTypes();

  if (form.raceClassId === 0 && raceClasses.value.length > 0) {
    form.raceClassId = raceClasses.value[0]?.id || 0;
  }
});

async function loadRaceClassTypes() {
  raceClasses.value = await getRaceClasses();
}

const emit = defineEmits<{
  submit: [value: SeriesFormSubmitModel];
  cancel: [];
}>();

const form = reactive<SeriesFormViewModel>({ ...props.initialValue });

function onSubmit() {
  const selectedRaceClass = raceClasses.value.find(
    (raceClass) => raceClass.id === form.raceClassId,
  );
  if (!selectedRaceClass) {
    return;
  }

  emit('submit', {
    name: form.name,
    nbRaces: form.nbRaces,
    nbRacesToCount: form.nbRacesToCount,
    isCompleted: form.isCompleted,
    raceClass: selectedRaceClass,
  });
}
</script>

<template>
  <section class="container mt-3">
    <h1 class="mb-3">{{ title }}</h1>

    <form @submit.prevent="onSubmit">
      <div class="form-group">
        <label for="series-name">Name</label>
        <input
          id="series-name"
          v-model.trim="form.name"
          class="form-control"
          required
          type="text"
        />
      </div>

      <div class="form-group">
        <label for="series-nb-races">Number of races</label>
        <input
          id="series-nb-races"
          v-model.number="form.nbRaces"
          class="form-control"
          min="1"
          required
          type="number"
        />
      </div>

      <div class="form-group">
        <label for="series-nb-races-count">Number of races to count</label>
        <input
          id="series-nb-races-count"
          v-model.number="form.nbRacesToCount"
          class="form-control"
          min="1"
          required
          type="number"
        />
      </div>

      <div class="form-group">
        <label for="series-race-class-id">Race class</label>
        <select
          id="series-race-class-id"
          v-model.number="form.raceClassId"
          class="form-control"
          required
        >
          <option v-for="item in raceClasses" :key="item.id" :value="item.id">
            {{ item.name }}
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
