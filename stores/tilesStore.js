import {defineStore} from 'pinia'
import {ref} from 'vue'

export const tilesStore = defineStore('tiles', () => {
    const tiles = ref(
        Array.from({length: 6}, (_, row) =>
            Array.from({length: 6}, (_, col) => ({
                row,
                col,
                surveyed: false,
                soil: {
                    health: 100,
                    water: 0,
                    fertility: 0,
                    recoveryRate: 5,
                    compaction: 0,
                    ph: 7
                },
                plant: null,
                animal: null,
                pests: 0,
                weeds: 0,
                pollination: 0,
                defense: 0,
                assemblies: []
            }))
        )
    )

    const gate = ref({animals: [], plants: [], extras: []})

    const selectedSubject = ref({})

    return {tiles, gate, selectedSubject}
})
