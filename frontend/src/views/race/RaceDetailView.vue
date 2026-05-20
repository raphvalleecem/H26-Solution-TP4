<script lang="ts" setup>
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import DataTable from 'datatables.net-vue3';
import DataTablesCore from 'datatables.net-bs4';
import { getBoats, type Boat } from '@/models/boats.ts';
import { addRaceEntry, getRaceEntries, type RaceEntry } from '@/models/raceEntries.ts';
import { type RaceOutcome, type RaceOutcomeResult, raceOutcomes } from '@/models/raceOutcomes.ts';
import { getRaceClasses, type RaceClass } from '@/models/raceClass.ts';
import { getSeries, type Series } from '@/models/series.ts';
import { getRaceById, type Race, updateRace } from '@/models/races.ts';

DataTable.use(DataTablesCore);

type RaceForm = {
  name: string;
  startDate: string;
  startTime: string;
  track: string;
  raceClassId: number;
  seriesId: number;
  isCompleted: boolean;
};

const route = useRoute();
const raceId = computed(() => Number.parseInt(String(route.params.id), 10));
const race = ref<Race | null>(null);

const raceClasses = ref<RaceClass[]>([]);
const seriesRows = ref<Series[]>([]);
const boats = ref<Boat[]>([]);
const raceEntries = ref<RaceEntry[]>([]);
const isLoading = ref(true);
const errorMessage = ref('');

onMounted(async () => {
  raceClasses.value = await getRaceClasses();
  seriesRows.value = await getSeries();
  await Promise.all([loadBoats(), loadRaceEntries()]);
});

async function loadRaceItem() {
  const id = Number.parseInt(String(route.params.id), 10);
  race.value = Number.isNaN(id) ? null : await getRaceById(id);
}

watch(
  () => route.params.id,
  async () => {
    await loadRaceItem();
  },
  { immediate: true },
);

const isEditing = ref(false);
const selectedBoatId = ref<number | null>(null);

const form = reactive<RaceForm>({
  name: '',
  startDate: '',
  startTime: '',
  track: '',
  raceClassId: 0,
  seriesId: 0,
  isCompleted: false,
});

const original = ref<RaceForm | null>(null);

function relationId(value: unknown): number {
  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'object' && value !== null && 'id' in value) {
    const id = Number((value as { id?: unknown }).id);
    return Number.isFinite(id) ? id : 0;
  }

  return 0;
}

async function loadBoats() {
  boats.value = await getBoats();
}

async function loadRaceEntries() {
  raceEntries.value = await getRaceEntries();
}

async function loadRace() {
  const id = raceId.value;

  if (Number.isNaN(id)) {
    race.value = null;
    original.value = null;
    errorMessage.value = 'Invalid race id.';
    isLoading.value = false;
    return;
  }

  isLoading.value = true;
  errorMessage.value = '';

  try {
    const loadedRace = await getRaceById(id);

    if (!loadedRace) {
      race.value = null;
      original.value = null;
      errorMessage.value = 'Race not found.';
      return;
    }

    race.value = loadedRace;

    const seed: RaceForm = {
      name: loadedRace.name,
      startDate: loadedRace.startDate,
      startTime: loadedRace.startTime,
      track: loadedRace.track,
      raceClassId: relationId((loadedRace as { raceClass?: unknown }).raceClass),
      seriesId: relationId((loadedRace as { series?: unknown }).series),
      isCompleted: loadedRace.isCompleted,
    };

    original.value = seed;
    Object.assign(form, seed);
  } catch {
    race.value = null;
    original.value = null;
    errorMessage.value = 'Unable to load race details. Please try again.';
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  void loadRace();
});

watch(
  () => route.params.id,
  () => {
    void loadRace();
  },
);

const hasChanges = computed(() => {
  if (!original.value) {
    return false;
  }
  return JSON.stringify(form) !== JSON.stringify(original.value);
});

const raceClassName = computed(() => {
  return raceClasses.value.find((item) => item.id === form.raceClassId)?.name ?? '-';
});

const seriesName = computed(() => {
  if (!form.seriesId) {
    return 'Hors-série';
  }

  return seriesRows.value.find((item) => item.id === form.seriesId)?.name ?? '-';
});

type EntryDisplayRow = {
  rowKey: string;
  entryId?: number;
  boatId: number;
  boat: Boat;
  outcome: RaceOutcome | undefined;
  source: 'saved';
};

type LocalOutcomeDraft = {
  result: RaceOutcomeResult;
  position?: number;
  finishTime?: string;
  elapsedTime?: number;
  correctedTime?: number;
};

type EntryModalDraft = {
  boatId: number | null;
  result: RaceOutcomeResult;
  position: string;
  finishTime: string;
  elapsedTime: string;
  correctedTime: string;
};

const removedEntryIds = ref<number[]>([]);
const editedOutcomes = ref<Record<string, LocalOutcomeDraft>>({});
const isEntryModalOpen = ref(false);
const editingRowKey = ref<string | null>(null);
const modalError = ref('');
const resultOptions: RaceOutcomeResult[] = ['', 'DNS', 'OCS', 'DNF', 'RTD', 'DSQ'];

const entryModalDraft = reactive<EntryModalDraft>({
  boatId: null,
  result: '',
  position: '',
  finishTime: '',
  elapsedTime: '',
  correctedTime: '',
});

function mergeOutcome(
  base: RaceOutcome | undefined,
  rowKey: string,
  entryId?: number,
): RaceOutcome | undefined {
  const edited = editedOutcomes.value[rowKey];
  if (!edited) {
    return base;
  }

  return {
    id: base?.id ?? -1,
    raceEntryId: base?.raceEntryId ?? entryId ?? -1,
    result: edited.result,
    position: edited.position,
    finishTime: edited.finishTime,
    elapsedTime: edited.elapsedTime,
    correctedTime: edited.correctedTime,
  };
}

const allBoatRows = computed<EntryDisplayRow[]>(() => {
  if (!race.value) {
    return [];
  }

  return raceEntries.value
    .filter((entry) => entry.raceId === race.value!.id && !removedEntryIds.value.includes(entry.id))
    .map((entry) => ({
      rowKey: `saved-${entry.id}`,
      entryId: entry.id,
      boatId: entry.boatId,
      boat: boats.value.find((row) => row.id === entry.boatId),
      outcome: raceOutcomes.find((row) => row.raceEntryId === entry.id),
      source: 'saved' as const,
    }))
    .filter(
      (
        row,
      ): row is {
        rowKey: string;
        entryId: number;
        boatId: number;
        boat: Boat;
        outcome: RaceOutcome | undefined;
        source: 'saved';
      } => Boolean(row.boat),
    )
    .map((row) => ({
      ...row,
      outcome: mergeOutcome(row.outcome, row.rowKey, row.entryId),
    }));
});

const selectableBoats = computed(() => {
  const selected = new Set(allBoatRows.value.map((row) => row.boat.id));
  return boats.value.filter((boat) => !selected.has(boat.id));
});

function startEdit() {
  isEditing.value = true;
}

function cancelEdit() {
  if (original.value) {
    Object.assign(form, original.value);
  }
  isEditing.value = false;
}

async function saveChanges() {
  if (!hasChanges.value || !race.value) {
    return;
  }

  try {
    const formData = new FormData();
    formData.append('id', String(race.value.id));
    formData.append('name', form.name);
    formData.append('date', form.startDate);
    formData.append('startTime', `${form.startDate}T${form.startTime}:00`);
    formData.append('course', form.track);
    formData.append('raceClassId', String(form.raceClassId));
    formData.append('seriesId', String(form.seriesId));
    formData.append('isCompleted', String(form.isCompleted));

    await updateRace(race.value.id, formData);

    original.value = { ...form };
    isEditing.value = false;
    await loadRaceItem();
  } catch (error) {
    console.error('Failed to save changes:', error);
    alert('Failed to save changes. Please try again.');
  }
}

async function addEntry() {
  if (!selectedBoatId.value || !race.value) {
    return;
  }

  const created = await addRaceEntry({
    boatId: selectedBoatId.value,
    raceId: race.value.id,
  });

  if (created) {
    raceEntries.value = [...raceEntries.value, created];
  }

  selectedBoatId.value = null;
}

function toNumberOrUndefined(value: string): number | undefined {
  const normalized = value.trim();
  if (!normalized) {
    return undefined;
  }
  const parsed = Number(normalized);
  return Number.isNaN(parsed) ? undefined : parsed;
}

function openEntryModal(row: EntryDisplayRow) {
  editingRowKey.value = row.rowKey;
  entryModalDraft.boatId = row.boatId;
  entryModalDraft.result = row.outcome?.result ?? '';
  entryModalDraft.position = row.outcome?.position != null ? String(row.outcome.position) : '';
  entryModalDraft.finishTime = row.outcome?.finishTime ?? '';
  entryModalDraft.elapsedTime =
    row.outcome?.elapsedTime != null ? String(row.outcome.elapsedTime) : '';
  entryModalDraft.correctedTime =
    row.outcome?.correctedTime != null ? String(row.outcome.correctedTime) : '';
  modalError.value = '';
  isEntryModalOpen.value = true;
}

function closeEntryModal() {
  isEntryModalOpen.value = false;
  editingRowKey.value = null;
  modalError.value = '';
}

function saveEntryModal() {
  if (!editingRowKey.value) {
    return;
  }

  editedOutcomes.value[editingRowKey.value] = {
    result: entryModalDraft.result,
    position: toNumberOrUndefined(entryModalDraft.position),
    finishTime: entryModalDraft.finishTime.trim() || undefined,
    elapsedTime: toNumberOrUndefined(entryModalDraft.elapsedTime),
    correctedTime: toNumberOrUndefined(entryModalDraft.correctedTime),
  };

  closeEntryModal();
}

function removeEntry(row: EntryDisplayRow) {
  if (row.entryId != null && !removedEntryIds.value.includes(row.entryId)) {
    removedEntryIds.value.push(row.entryId);
  }

  delete editedOutcomes.value[row.rowKey];

  if (editingRowKey.value === row.rowKey) {
    closeEntryModal();
  }
}
</script>

<template>
  <section class="container mt-3">
    <h1>Race details</h1>

    <div v-if="isLoading" class="alert alert-info mt-3">Loading race details...</div>
    <div v-else-if="errorMessage" class="alert alert-danger mt-3">{{ errorMessage }}</div>
    <div v-else-if="!race" class="alert alert-warning mt-3">Race not found.</div>

    <div v-else>
      <table class="table table-bordered mt-3">
        <tbody>
          <tr>
            <th style="width: 220px">#</th>
            <td>{{ race.id }}</td>
          </tr>
          <tr>
            <th>Name</th>
            <td>
              <input v-model="form.name" :readonly="!isEditing" class="form-control" type="text" />
            </td>
          </tr>
          <tr>
            <th>Date</th>
            <td>
              <input
                v-model="form.startDate"
                :readonly="!isEditing"
                class="form-control"
                type="date"
              />
            </td>
          </tr>
          <tr>
            <th>Start time</th>
            <td>
              <input
                v-model="form.startTime"
                :readonly="!isEditing"
                class="form-control"
                type="time"
              />
            </td>
          </tr>
          <tr>
            <th>Track</th>
            <td>
              <input
                v-model="form.track"
                :readonly="!isEditing"
                class="form-control"
                type="text"
              />
            </td>
          </tr>
          <tr>
            <th>Race class</th>
            <td>
              <RouterLink v-if="!isEditing" :to="`/race-class/${form.raceClassId}`">
                {{ raceClassName }}
              </RouterLink>
              <select v-else v-model.number="form.raceClassId" class="form-control">
                <option v-for="item in raceClasses" :key="item.id" :value="item.id">
                  {{ item.name }}
                </option>
              </select>
            </td>
          </tr>
          <tr>
            <th>Series</th>
            <td>
              <RouterLink v-if="!isEditing && form.seriesId" :to="`/series/${form.seriesId}`">
                {{ seriesName }}
              </RouterLink>
              <span v-else-if="!isEditing">{{ seriesName }}</span>
              <select v-else v-model.number="form.seriesId" class="form-control">
                <option :value="0">No series</option>
                <option v-for="item in seriesRows" :key="item.id" :value="item.id">
                  {{ item.name }}
                </option>
              </select>
            </td>
          </tr>
          <tr>
            <th>Completed</th>
            <td>
              <input v-model="form.isCompleted" :disabled="!isEditing" type="checkbox" />
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
        <RouterLink :to="`/race/delete/${race.id}`" class="btn btn-danger">Delete</RouterLink>
      </div>

      <h2 class="h4 mt-4">Entries</h2>
      <DataTable class="table table-striped table-bordered mt-2">
        <thead>
          <tr>
            <th>Boat</th>
            <th v-if="form.isCompleted">Result</th>
            <th v-if="form.isCompleted">Position</th>
            <th v-if="form.isCompleted">Finish time</th>
            <th v-if="form.isCompleted">Elapsed time</th>
            <th v-if="form.isCompleted">Corrected time</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in allBoatRows" :key="row.rowKey">
            <td>
              <RouterLink :to="`/boat/${row.boat.id}`">{{ row.boat.name }}</RouterLink>
            </td>
            <td v-if="form.isCompleted">{{ row.outcome?.result || '-' }}</td>
            <td v-if="form.isCompleted">{{ row.outcome?.position ?? '-' }}</td>
            <td v-if="form.isCompleted">{{ row.outcome?.finishTime ?? '-' }}</td>
            <td v-if="form.isCompleted">{{ row.outcome?.elapsedTime ?? '-' }}</td>
            <td v-if="form.isCompleted">{{ row.outcome?.correctedTime ?? '-' }}</td>
            <td>
              <div class="d-flex gap-2">
                <button class="btn btn-sm btn-primary" type="button" @click="openEntryModal(row)">
                  Edit
                </button>
                <button
                  class="btn btn-sm btn-outline-danger"
                  type="button"
                  @click="removeEntry(row)"
                >
                  Remove
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </DataTable>

      <div class="card p-3 mt-3">
        <h3 class="h6">Add entry (prototype UX)</h3>
        <div class="d-flex gap-2 align-items-center">
          <select v-model.number="selectedBoatId" class="form-control" style="max-width: 320px">
            <option :value="null">Select a boat</option>
            <option v-for="boat in selectableBoats" :key="boat.id" :value="boat.id">
              {{ boat.name }}
            </option>
          </select>
          <button class="btn btn-outline-primary" type="button" @click="addEntry">Add</button>
        </div>
      </div>

      <div v-if="isEntryModalOpen" class="modal fade show d-block" role="dialog" tabindex="-1">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Edit entry result</h5>
              <button aria-label="Close" class="close" type="button" @click="closeEntryModal">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <div v-if="modalError" class="alert alert-danger py-2">{{ modalError }}</div>

              <div class="form-group">
                <label>Boat</label>
                <input
                  :value="boats.find((boat) => boat.id === entryModalDraft.boatId)?.name ?? '-'"
                  class="form-control"
                  readonly
                  type="text"
                />
              </div>

              <div class="form-group">
                <label>Result</label>
                <select v-model="entryModalDraft.result" class="form-control">
                  <option v-for="option in resultOptions" :key="option || 'empty'" :value="option">
                    {{ option || '-' }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label>Position</label>
                <input
                  v-model="entryModalDraft.position"
                  class="form-control"
                  min="1"
                  type="number"
                />
              </div>

              <div class="form-group">
                <label>Finish time</label>
                <input
                  v-model="entryModalDraft.finishTime"
                  class="form-control"
                  type="datetime-local"
                />
              </div>

              <div class="form-group">
                <label>Elapsed time</label>
                <input
                  v-model="entryModalDraft.elapsedTime"
                  class="form-control"
                  min="0"
                  step="1"
                  type="number"
                />
              </div>

              <div class="form-group">
                <label>Corrected time</label>
                <input
                  v-model="entryModalDraft.correctedTime"
                  class="form-control"
                  min="0"
                  step="1"
                  type="number"
                />
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-primary" type="button" @click="saveEntryModal">Save</button>
              <button class="btn btn-outline-secondary" type="button" @click="closeEntryModal">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
      <div v-if="isEntryModalOpen" class="modal-backdrop fade show"></div>
    </div>
  </section>
</template>


