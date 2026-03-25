```vue
<script lang="ts" setup>
import { reactive } from 'vue'

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

const submitForm = async () => {
  console.log('Form data:', form)

  try {
    // Remplace 'http://localhost:3000/api/race' par l'URL réelle de ton Express
    const response = await fetch('http://localhost:3000/api/race', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // On transforme l'objet réactif "form" en texte JSON
      body: JSON.stringify(form),
    })

    if (response.ok) {
      const result = await response.json()
      alert('Données envoyées avec succès !')
      console.log('Réponse du serveur:', result)
    } else {
      console.error('Erreur serveur:', response.statusText)
      alert('Le serveur a renvoyé une erreur.')
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
