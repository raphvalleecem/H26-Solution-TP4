<script lang="ts" setup>
import { reactive } from 'vue'
import { boatClasses } from '../data/boatClasses'

type BoatFormPayload = {
  name: string
  boatClassId: number
  sailNumber: number
  helmName: string
}

const props = withDefaults(
  defineProps<{
    title: string
    submitLabel: string
    initialValue?: BoatFormPayload
  }>(),
  {
    initialValue: () => ({
      name: '',
      boatClassId: 1,
      sailNumber: 2000,
      helmName: '',
    }),
  },
)

const emit = defineEmits<{
  submit: [value: BoatFormPayload]
  cancel: []
}>()

const form = reactive<BoatFormPayload>({
  name: props.initialValue.name,
  boatClassId: props.initialValue.boatClassId,
  sailNumber: props.initialValue.sailNumber,
  helmName: props.initialValue.helmName,
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
        <input id="boat-name" v-model.trim="form.name" class="form-control" required type="text" />
      </div>

      <div class="form-group">
        <label for="boat-class">Boat class</label>
        <select id="boat-class" v-model.number="form.boatClassId" class="form-control" required>
          <option v-for="item in boatClasses" :key="item.id" :value="item.id">{{ item.name }}</option>
        </select>
      </div>

      <div class="form-group">
        <label for="sail-number">Sail number</label>
        <input id="sail-number" v-model.number="form.sailNumber" class="form-control" required type="number" />
      </div>

      <div class="form-group">
        <label for="helm-name">Helm name</label>
        <input id="helm-name" v-model.trim="form.helmName" class="form-control" required type="text" />
      </div>

      <div class="d-flex">
        <button class="btn btn-primary mr-2" type="submit">{{ submitLabel }}</button>
        <button class="btn btn-outline-secondary" type="button" @click="emit('cancel')">Cancel</button>
      </div>
    </form>
  </section>
</template>
