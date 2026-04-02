<script lang="ts" setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function onCreate() {
  // Prototype UX only: no real persistence
  router.push({ name: 'boat-class' })
}

function onCancel() {
  router.push({ name: 'boat-class' })
}
</script>

<template>
  <section class="container mt-3">
    <h1>Create boat class</h1>

    <form class="card p-3 mt-3" @submit.prevent="onCreate">
      <div class="form-group">
        <label for="boat-class-name">Name</label>
        <input id="boat-class-name" class="form-control" required type="text" />
      </div>

      <div class="form-group">
        <label for="boat-class-handicap-value">Handicap value</label>
        <input id="boat-class-handicap-value" class="form-control" required step="0.01" type="number" />
      </div>

      <div class="form-group">
        <label for="boat-class-handicap-type">Handicap type</label>
        <select id="boat-class-handicap-type" class="form-control" required>
          <option>PY</option>
          <option>TMF</option>
        </select>
      </div>

      <div class="d-flex">
        <button class="btn btn-primary mr-2" type="submit">Create</button>
        <button class="btn btn-outline-secondary" type="button" @click="onCancel">Cancel</button>
      </div>
    </form>
  </section>
</template>


