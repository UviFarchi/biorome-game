import { defineStore } from 'pinia'
import { ref } from 'vue'

export const gameStateStore = defineStore('gameState', () => {

    const startDate = ref(new Date().toISOString().slice(0, 10))
    const day = ref(0)
    const temperature = ref(25)       // Celsius
    const rainfall = ref(0)           // mm
    const cloudCover = ref(0.1)       // 0 (clear) to 1 (overcast)

    return {
        startDate,
        day,
        temperature,
        rainfall,
        cloudCover,
    }
})
