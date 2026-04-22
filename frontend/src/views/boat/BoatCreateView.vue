<script lang="ts" setup>
import axios from 'axios'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import BoatForm from '../../components/BoatForm.vue'

const router = useRouter()

type BoatClassOption = {
  id: number
  name: string
}

type BoatClassApiRow = {
  id?: unknown
  name?: unknown
}

const boatClasses = ref<BoatClassOption[]>([])
const isLoadingBoatClasses = ref(true)
const isSubmitting = ref(false)
const errorMessage = ref('')
const hasBoatClasses = computed(() => boatClasses.value.length > 0)

onMounted(() => {
  void loadBoatClasses()
})

async function loadBoatClasses() {
  isLoadingBoatClasses.value = true
  errorMessage.value = ''

  try {
    const response = await axios.get<BoatClassApiRow[]>('/boat-classes')
    boatClasses.value = response.data
      .map((row) => ({
        id: Number(row.id),
        name: typeof row.name === 'string' ? row.name : '',
      }))
      .filter((row) => Number.isFinite(row.id) && row.name !== '')
  } catch {
    errorMessage.value = 'Unable to load boat classes. Please try again.'
  } finally {
    isLoadingBoatClasses.value = false
  }
}

function getApiErrorMessage(payload: unknown): string | null {
  if (typeof payload === 'string') {
    return payload
  }

  if (payload && typeof payload === 'object') {
    if ('error' in payload && typeof (payload as { error?: unknown }).error === 'string') {
      return (payload as { error: string }).error
    }

    if ('message' in payload && typeof (payload as { message?: unknown }).message === 'string') {
      return (payload as { message: string }).message
    }
  }

  return null
}

async function createBoat(payload: {
  name: string
  boatClassId: number
  sailNumber: number
  helmName: string
}) {
  if (isSubmitting.value) {
    return
  }

  errorMessage.value = ''
  isSubmitting.value = true

  try {
    const body = new FormData()
    body.append('name', payload.name)
    body.append('boatClassId', String(payload.boatClassId))
    body.append('sailNumber', String(payload.sailNumber))
    body.append('helmName', payload.helmName)

    await axios.post('/boat/create', body)
    await router.push({ name: 'boat' })
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      errorMessage.value =
        getApiErrorMessage(error.response?.data) ?? 'Unable to create boat. Please try again.'
      return
    }

    errorMessage.value = 'An unexpected error occurred. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}

function cancel() {
  router.push({ name: 'boat' })
}
</script>

<template>
  <section class="container mt-3">
    <div v-if="errorMessage" class="alert alert-danger" role="alert">
      {{ errorMessage }}
    </div>

    <div v-if="isLoadingBoatClasses" class="mt-3">Loading boat classes...</div>
    <div v-else-if="!hasBoatClasses" class="alert alert-warning mt-3" role="alert">
      No boat class found. Create a boat class first.
    </div>

    <BoatForm
      v-else
      :boat-classes="boatClasses"
      :is-submitting="isSubmitting"
      submit-label="Create"
      title="Create boat"
      @cancel="cancel"
      @submit="createBoat"
    />
  </section>
</template>
