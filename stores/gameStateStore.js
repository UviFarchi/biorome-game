import {defineStore} from 'pinia'
import {ref} from 'vue'

export const gameStateStore = defineStore('gameState', () => {

    const startDate = ref(new Date().toISOString().slice(0, 10))
    const day = ref(0)
    const temperature = ref(25)       // Celsius
    const rainfall = ref(0)           // mm
    const cloudCover = ref(0.1)       // 0 (clear) to 1 (overcast)
    const newsFeed = ref([
        {
            id: 'news-1',
            type: 'market',
            headline: 'Tomato prices soar',
            details: 'A blight has reduced tomato harvests across the land.',
            day: 0,
            effect: { affectedTypes: ['Tomato'], priceModifier: 1.5 }
        },
        {
            id: 'news-2',
            type: 'weather',
            headline: 'Heavy rains incoming',
            details: 'Expect increased rainfall over the next few days.',
            day: 0
        },
        {
            id: 'news-3',
            type: 'market',
            headline: 'Demand for wool drops',
            details: 'Warm weather lowers demand for wool products.',
            day: 1,
            effect: { affectedTypes: ['Wool'], priceModifier: 0.8 }
        }
    ])
    const electricity = ref(0);
    const water = ref(0);
    const waste = ref(0)


    return {
        startDate,
        day,
        temperature,
        rainfall,
        cloudCover,
        newsFeed,
    }
})
