<script lang="ts" setup>
import axios from 'axios'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = reactive({
  name: '',
  handicapValue: '',
  handicapTypeId: '1',
})

const isSubmitting = ref(false)
const errorMessage = ref('')

function getApiErrorMessage(payload: unknown): string | null {
  if (typeof payload === 'string') {
    return payload
  }

  if (payload && typeof payload === 'object' && 'message' in payload) {
    const message = (payload as { message?: unknown }).message

    if (typeof message === 'string') {
      return message
    }
  }

  return null
}

async function onCreate() {
  if (isSubmitting.value) {
    return
  }

  errorMessage.value = ''

  const handicapValue = Number(form.handicapValue)
  if (Number.isNaN(handicapValue)) {
    errorMessage.value = 'Please enter a valid handicap value.'
    return
  }

  const payload = new FormData()
  payload.append('name', form.name)
  payload.append('handicapValue', handicapValue.toString())
  payload.append('handicapTypeId', form.handicapTypeId)

  isSubmitting.value = true

  try {
    await axios.post('/boat-class', payload)
    router.push({ name: 'boat-class' })
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      errorMessage.value = getApiErrorMessage(error.response?.data) ?? 'Unable to create boat class. Please try again.'
      return
    }

    errorMessage.value = 'An unexpected error occurred. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}

function onCancel() {
  router.push({ name: 'boat-class' })
}
</script>

<template>
  <section class="container mt-3">
    <h1>Create boat class</h1>

    <form class="card p-3 mt-3" @submit.prevent="onCreate">
      <div v-if="errorMessage" class="alert alert-danger" role="alert">
        {{ errorMessage }}
      </div>

      <div class="form-group">
        <label for="boat-class-name">Name</label>
        <input id="boat-class-name" v-model.trim="form.name" class="form-control" required type="text" />
      </div>

      <div class="form-group">
        <label for="boat-class-handicap-value">Handicap value</label>
        <input
          id="boat-class-handicap-value"
          v-model="form.handicapValue"
          class="form-control"
          required
          step="0.01"
          type="number"
        />
      </div>

      <div class="form-group">
        <label for="boat-class-handicap-type">Handicap type</label>
        <select id="boat-class-handicap-type" v-model="form.handicapTypeId" class="form-control" required>
          <option value="1">PY</option>
          <option value="2">TMF</option>
        </select>
      </div>

      <div class="d-flex">
        <button class="btn btn-primary mr-2" :disabled="isSubmitting" type="submit">
          {{ isSubmitting ? 'Creating...' : 'Create' }}
        </button>
        <button class="btn btn-outline-secondary" :disabled="isSubmitting" type="button" @click="onCancel">Cancel</button>
      </div>
    </form>
  </section>
</template>

