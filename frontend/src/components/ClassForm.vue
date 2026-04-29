<script lang="ts" setup>
import axios from 'axios'
import { computed, reactive, ref, onMounted } from 'vue'
import { handicapTypes } from '../models/handicapTypes'
import { raceClassTypes } from '../models/raceClassTypes'

type ClassFormValues = {
  name: string
  minHandicap: number
  maxHandicap: number
  handicapTypeId: number
  raceClassTypeId: number
  boatClassId: number
}

type ClassFormPayload = {
  name: string
  raceClassTypeId: number
  boatClassId?: number
  handicapTypeId?: number
  minHandicap?: number
  maxHandicap?: number
}

const props = withDefaults(
  defineProps<{
    title: string
    submitLabel: string
    initialValue?: ClassFormValues
  }>(),
  {
    initialValue: () => ({
      name: '',
      minHandicap: 0,
      maxHandicap: 0,
      handicapTypeId: 1,
      raceClassTypeId: 0,
      boatClassId: 0,
    }),
  },
)

const emit = defineEmits<{
  'submit-class': [value: ClassFormPayload]
  cancel: []
}>()

const form = reactive<ClassFormValues>({ ...props.initialValue })

const isMonotype = computed(() => form.raceClassTypeId === 1)
const isHandicap = computed(() => form.raceClassTypeId === 2)

type BoatClassOption = { id: number; name: string }
const boatClassOptions = ref<BoatClassOption[]>([])

async function loadBoatClasses() {
  try {
    const response = await axios.get('/boat-class')
    boatClassOptions.value = (response.data as any[])
      .map((row) => ({ id: Number(row.id), name: typeof row.name === 'string' ? row.name : '' }))
      .filter((r) => Number.isFinite(r.id) && r.name !== '')
  } catch {
    // silent: form can still work with empty list
    boatClassOptions.value = []
  }
}

onMounted(() => {
  void loadBoatClasses()
})

function onSubmit() {
  if (!isMonotype.value && !isHandicap.value) {
    return
  }

  if (isMonotype.value) {
    emit('submit-class', {
      name: form.name,
      raceClassTypeId: form.raceClassTypeId,
      boatClassId: form.boatClassId,
    })
    return
  }

  emit('submit-class', {
    name: form.name,
    raceClassTypeId: form.raceClassTypeId,
    handicapTypeId: form.handicapTypeId,
    minHandicap: form.minHandicap,
    maxHandicap: form.maxHandicap,
  })
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
          <option :value="0">-Choose a race class-</option>
          <option v-for="type in raceClassTypes" :key="type.id" :value="type.id">
            {{ type.name }}
          </option>
        </select>
      </div>

      <div v-if="isMonotype" class="form-group">
        <label for="boat-class">Boat class</label>
        <select id="boat-class" v-model.number="form.boatClassId" class="form-control" required>
          <option :value="0">-Choose a boat class-</option>
          <option v-for="boatClass in boatClassOptions" :key="boatClass.id" :value="boatClass.id">
            {{ boatClass.name }}
          </option>
        </select>
      </div>

      <template v-else-if="isHandicap">
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
