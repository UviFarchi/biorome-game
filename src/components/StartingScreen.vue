<script setup>
import { ref } from 'vue'
import { gameStateStore } from '/stores/gameStateStore.js'
const gameState = gameStateStore()
const name = ref('')
import eventBus from "@/eventBus.js";

const avatarOptions = [
  { emoji: '😀', label: 'Smiling Face' },
  { emoji: '😎', label: 'Cool Face' },
  { emoji: '🤖', label: 'Robot' },
  { emoji: '👽', label: 'Alien' },
  { emoji: '🦊', label: 'Fox' },
  { emoji: '🐸', label: 'Frog' },
  { emoji: '🐵', label: 'Monkey' },
  { emoji: '🐙', label: 'Octopus' },
  { emoji: '🍕', label: 'Pizza' },
  { emoji: '🌵', label: 'Cactus' }
]
const selectedAvatar = ref(avatarOptions[0].emoji)

const difficultyOptions = [
  { value: 0, label: 'Easy' },
  { value: 1, label: 'Medium' },
  { value: 2, label: 'High' }
]
const selectedDifficulty = ref(0)



function startGame() {
  if (!name.value.trim()) {
    alert('Please enter your name!')
    return
  }
  gameState.userName = name.value
  gameState.userAvatar = selectedAvatar.value
  gameState.difficulty = selectedDifficulty.value
  eventBus.emit('nav', 'main')
}
</script>

<template>
  <form @submit.prevent="startGame" class="start-form">
    <div>
      <label for="userName">Your Name:</label>
      <input id="userName" type="text" v-model="name" autocomplete="off" />
    </div>

    <div>
      <label for="userAvatar">Choose Your Avatar:</label>
      <select id="userAvatar" v-model="selectedAvatar">
        <option v-for="option in avatarOptions" :key="option.emoji" :value="option.emoji" :title="option.label">
          {{ option.emoji }}
        </option>
      </select>
    </div>

    <div>
      <label>Difficulty:</label>
      <div class="difficulty-options">
        <label v-for="option in difficultyOptions" :key="option.value">
          <input
              type="radio"
              name="difficulty"
              :value="option.value"
              v-model="selectedDifficulty"
          />
          {{ option.label }}
        </label>
      </div>
    </div>

    <button type="submit">Start</button>
  </form>
</template>

<style scoped>
.start-form {
  max-width: 300px;
  margin: 2rem auto;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}
.start-form label {
  font-weight: bold;
}
.difficulty-options {
  display: flex;
  gap: 1.2rem;
}
button[type="submit"] {
  margin-top: 1rem;
  font-weight: bold;
  font-size: 1.1em;
  padding: 0.5em 1.2em;
  border-radius: 8px;
  border: none;
  background: #82c91e;
  color: #fff;
  cursor: pointer;
}
button[type="submit"]:hover {
  background: #5c940d;
}
</style>
>