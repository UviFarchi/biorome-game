import { defineStore } from 'pinia'
import { ref } from 'vue'

export const tilesStore = defineStore('tiles', () => {
    // 6x6 grid: [row][col]
    const tiles = ref(
        Array.from({ length: 6 }, (_, row) =>
            Array.from({ length: 6 }, (_, col) => ({
                row,
                col,
                soil: {
                    health: 100,
                    water: 0,
                    fertility: 0,
                    recoveryRate: 5
                },
                plant: null,
                animal: null
            }))
        )
    )


    return { tiles }
})
