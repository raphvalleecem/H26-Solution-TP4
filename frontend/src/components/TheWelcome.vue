```vue
<script lang="ts" setup>
import { reactive, ref } from 'vue'
import ListBoats from './ListBoats.vue'

interface FormDataModel {
  yacht: string
  owner: string
  pyn: string
  place: string
  points: string
  elapsed_sec: string
  notes: string
}

const form = reactive<FormDataModel>({
  yacht: '',
  owner: '',

  elapsed_sec: '',

  pyn: '',

  place: '',
  points: '',

  notes: '',
})

const boatsRefreshKey = ref(0)

const submitForm = async () => {
  console.log('Form data:', form)

  const yachtName = form.yacht.trim()
  if (!yachtName) {
    alert('Le nom du bateau est obligatoire.')
    return
  }

  const formData = new FormData()
  formData.append('name', yachtName)
  formData.append('owner', form.owner)
  formData.append('pyn', form.pyn)
  formData.append('place', form.place)
  formData.append('points', form.points)
  formData.append('elapsed_sec', form.elapsed_sec)
  formData.append('notes', form.notes)

  try {
    // Si ton backend est monte sous /api, remplace ici par /api/boat.
    const response = await fetch('http://localhost:3000/boat', {
      method: 'POST',
      // Ne pas fixer Content-Type manuellement avec FormData (boundary auto)
      body: formData,
    })

    const data = await response.json().catch(() => null)

    if (response.ok) {
      alert('Données envoyées avec succès !')
      console.log('Réponse du serveur:', data)
      boatsRefreshKey.value += 1
    } else {
      const detail = data?.error || data?.message || response.statusText
      console.error('Erreur serveur:', response.status, detail)
      alert(`Erreur serveur (${response.status}) : ${detail}`)
    }
  } catch (error) {
    console.error('Erreur réseau ou connexion impossible:', error)
    alert('Impossible de contacter le serveur Express.')
  }
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
        <legend>Elapsed Time in sec</legend>
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

    <section class="boats-section">
      <ListBoats :key="boatsRefreshKey" />
    </section>
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

.boats-section {
  margin-top: 24px;
}
</style>
```
