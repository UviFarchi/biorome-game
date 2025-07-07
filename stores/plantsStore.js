import { defineStore } from 'pinia'
import { ref } from 'vue'

export const plantsStore = defineStore('plantTypes', () => {
    const plantTypes = ref([
        {
            type: 'Grass',
            growthStages: [ 'Mature'],
            preferredSeason: 'Spring',
            minWater: 0,
            maxWater: 2,
            minFertility: 0,
            maxFertility: 2,
            waterRequired: 1,
            fertilizerRequired: 1,
            yield: 1,
            cost: 5,
            icon: '🌱'
        },
        {
            type: 'Corn',
            growthStages: ['Seedling', 'Growing', 'Mature', 'Overripe', 'Rotten'],
            preferredSeason: 'Summer',
            minWater: 1,
            maxWater: 3,
            minFertility: 1,
            maxFertility: 3,
            waterRequired: 2,
            fertilizerRequired: 2,
            yield: 3,
            cost: 8,
            icon: '🌽'
        },
        {
            type: 'Tomato',
            growthStages: ['Seedling', 'Growing', 'Mature', 'Overripe', 'Rotten'],
            preferredSeason: 'Summer',
            minWater: 1,
            maxWater: 3,
            minFertility: 0,
            maxFertility: 2,
            waterRequired: 2,
            fertilizerRequired: 1,
            yield: 2,
            cost: 10,
            icon: '🍅'
        },
        {
            type: 'Lettuce',
            growthStages: ['Seedling', 'Growing', 'Mature', 'Overripe', 'Rotten'],
            preferredSeason: 'Spring',
            minWater: 1,
            maxWater: 2,
            minFertility: 1,
            maxFertility: 2,
            waterRequired: 2,
            fertilizerRequired: 1,
            yield: 2,
            cost: 7,
            icon: '🥬'
        },
        {
            type: 'Carrot',
            growthStages: ['Seedling', 'Growing', 'Mature', 'Overripe', 'Rotten'],
            preferredSeason: 'Autumn',
            minWater: 1,
            maxWater: 2,
            minFertility: 1,
            maxFertility: 2,
            waterRequired: 1,
            fertilizerRequired: 1,
            yield: 2,
            cost: 6,
            icon: '🥕'
        },
        {
            type: 'Coffee',
            growthStages: ['Seedling', 'Growing', 'Mature', 'Overripe', 'Rotten'],
            preferredSeason: 'Summer',
            minWater: 2,
            maxWater: 3,
            minFertility: 2,
            maxFertility: 3,
            waterRequired: 3,
            fertilizerRequired: 2,
            yield: 2,
            cost: 14,
            icon: '☕'
        },
        {
            type: 'Pumpkin',
            growthStages: ['Seedling', 'Growing', 'Mature', 'Overripe', 'Rotten'],
            preferredSeason: 'Autumn',
            minWater: 2,
            maxWater: 4,
            minFertility: 1,
            maxFertility: 3,
            waterRequired: 3,
            fertilizerRequired: 2,
            yield: 4,
            cost: 12,
            icon: '🎃'
        }
    ])


    return { plantTypes }
})
