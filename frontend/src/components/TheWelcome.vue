```vue
<script lang="ts" setup>
import { reactive } from 'vue'

const form = reactive({
  yacht: '',
  owner: '',

  elapsed_hr: '',
  elapsed_min: '',
  elapsed_sec: '',

  pyn: '',

  place: '',
  points: '',

  notes: '',
})

const submitForm = () => {
  console.log('Form data:', form)
}
</script>

<template>
  <div class="form-container">
    <h1>Race Record Entry</h1>

    <form @submit.prevent="submitForm">
      <div class="row">
        <label>Yacht</label>
        <input v-model="form.yacht" type="text" />
      </div>

      <div class="row">
        <label>Owner</label>
        <input v-model="form.owner" type="text" />
      </div>

      <fieldset>
        <legend>Elapsed Time</legend>
        <input v-model="form.elapsed_hr" placeholder="hr" type="number" />
        <input v-model="form.elapsed_min" placeholder="min" type="number" />
        <input v-model="form.elapsed_sec" placeholder="sec" type="number" />
      </fieldset>

      <div class="row">
        <label>PYN</label>
        <input v-model="form.pyn" type="number" />
      </div>

      <div class="row">
        <label>Place</label>
        <input v-model="form.place" type="number" />
      </div>

      <div class="row">
        <label>Points</label>
        <input v-model="form.points" type="number" />
      </div>

      <div class="row">
        <label>Notes</label>
        <textarea v-model="form.notes"></textarea>
      </div>

      <button type="submit">Submit</button>
    </form>
  </div>
</template>

<style scoped>
.form-container {
  max-width: 600px;
  margin: auto;
  font-family: Arial, sans-serif;
}

.row {
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
}

fieldset {
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 15px;
}

fieldset input {
  width: 60px;
  margin-right: 5px;
}

button {
  padding: 8px 16px;
  cursor: pointer;
}
</style>
```
