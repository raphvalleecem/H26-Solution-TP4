<script lang="ts" setup>
import axios from 'axios'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

type BoatClassDetail = {
  id: number
  name: string
  handicapValue: number
  handicapTypeId: number
}

type BoatClassApiRow = {
  id?: unknown
  name?: unknown
  handicapValue?: unknown
  handicap_value?: unknown
  handicapTypeId?: unknown
  handicap_type_id?: unknown
  handicapType?: { id?: unknown; name?: unknown } | string | null
}

const route = useRoute()
const router = useRouter()

const classId = computed(() => Number.parseInt(String(route.params.id), 10))
const boatClass = ref<BoatClassDetail | null>(null)
const isDeleting = ref(false)
const errorMessage = ref('')

function toNumberOrNull(value: unknown): number | null {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

function normalizeBoatClass(row: BoatClassApiRow): BoatClassDetail {
  return {
    id: toNumberOrNull(row.id) ?? 0,
    name: typeof row.name === 'string' ? row.name : '',
    handicapValue: toNumberOrNull(row.handicapValue ?? row.handicap_value) ?? 0,
    handicapTypeId:
      toNumberOrNull(row.handicapTypeId ?? row.handicap_type_id) ?? 1,
  }
}

async function loadBoatClass() {
  if (Number.isNaN(classId.value)) {
    boatClass.value = null
    return
  }

  try {
    const response = await axios.get<BoatClassApiRow>(`/boat-class/${classId.value}`)
    boatClass.value = normalizeBoatClass(response.data)
  } catch {
    boatClass.value = null
  }
}

async function confirmDelete() {
  if (!boatClass.value || isDeleting.value) {
    return
  }

  isDeleting.value = true
  errorMessage.value = ''

  try {
    await axios.post('/boat-class/delete', {
      id: boatClass.value.id,
    })
    await router.push({ name: 'boat-class' })
  } catch {
    errorMessage.value = 'Unable to delete boat class. Please try again.'
    isDeleting.value = false
  }
}

onMounted(() => {
  void loadBoatClass()
})
</script>

<template>
  <section class="container mt-3">
    <h1>Delete boat class</h1>

    <div v-if="!boatClass" class="alert alert-warning mt-3">Boat class not found.</div>

    <div v-else class="card mt-3">
      <div class="card-body">
        <div v-if="errorMessage" class="alert alert-danger mb-3">{{ errorMessage }}</div>

        <p class="mb-2"><strong>#:</strong> {{ boatClass.id }}</p>
        <p class="mb-2"><strong>Name:</strong> {{ boatClass.name }}</p>
        <p class="text-danger">Are you sure you want to delete this boat class?</p>

        <button
          :disabled="isDeleting"
          class="btn btn-danger mr-2"
          type="button"
          @click="confirmDelete"
        >
          {{ isDeleting ? 'Deleting...' : 'Delete' }}
        </button>
        <RouterLink :to="{ name: 'boat-class' }" class="btn btn-outline-secondary"
          >Cancel</RouterLink
        >
      </div>
    </div>
  </section>
</template>
