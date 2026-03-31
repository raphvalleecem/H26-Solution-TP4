<script lang="ts" setup>
import { reactive } from 'vue'
import type { BoatRow } from '../data/boats'

type BoatFormPayload = Omit<BoatRow, 'id'>

const props = withDefaults(
  defineProps<{
    title: string
    submitLabel: string
    initialValue?: BoatFormPayload
  }>(),
  {
    initialValue: () => ({
      nom: '',
      classe: '',
      numeroVoile: '',
      barreur: '',
    }),
  },
)

const emit = defineEmits<{
  submit: [value: BoatFormPayload]
  cancel: []
}>()

const form = reactive<BoatFormPayload>({
  nom: props.initialValue.nom,
  classe: props.initialValue.classe,
  numeroVoile: props.initialValue.numeroVoile,
  barreur: props.initialValue.barreur,
})

function onSubmit() {
  emit('submit', { ...form })
}
</script>

<template>
  <section class="container mt-3">
    <h1 class="mb-3">{{ title }}</h1>

    <form @submit.prevent="onSubmit">
      <div class="form-group">
        <label for="boat-name">Boat name</label>
        <input id="boat-name" v-model.trim="form.nom" class="form-control" required type="text" />
      </div>

      <div class="form-group">
        <label for="boat-class">Boat class</label>
        <input id="boat-class" v-model.trim="form.classe" class="form-control" required type="text" />
      </div>

      <div class="form-group">
        <label for="sail-number">Sail number</label>
        <input
          id="sail-number"
          v-model.trim="form.numeroVoile"
          class="form-control"
          placeholder="QC-0000"
          required
          type="text"
        />
      </div>

      <div class="form-group">
        <label for="helm-name">Helm name</label>
        <input id="helm-name" v-model.trim="form.barreur" class="form-control" required type="text" />
      </div>

      <div class="d-flex">
        <button class="btn btn-primary mr-2" type="submit">{{ submitLabel }}</button>
        <button class="btn btn-outline-secondary" type="button" @click="emit('cancel')">Cancel</button>
      </div>
    </form>
  </section>
</template>


