import { defineStore } from 'pinia'
import { ref } from 'vue'

export const plantsStore = defineStore('plantTypes', () => {
    const plantTypes = ref([
        {
            type: 'Grass',
            plantingOptions: ['Seed', 'Seedling'],
            growthStages: ['Seed', 'Seedling', 'Growing', 'Mature', 'Overripe', 'Rotten'],
            preferredSeason: 'Spring',
            minWater: 0,
            maxWater: 2,
            minFertility: 0,
            maxFertility: 2,
            waterRequired: 1,
            fertilizerRequired: 1,
            yield: 1,
            seedCost: 2,
            seedlingCost: 5,
            shelfLife: 10, // For harvested product (turns)
            icon: '🌱'
        },
        {
            type: 'Corn',
            plantingOptions: ['Seed', 'Seedling'],
            growthStages: ['Seed', 'Seedling', 'Growing', 'Mature', 'Overripe', 'Rotten'],
            preferredSeason: 'Summer',
            minWater: 1,
            maxWater: 3,
            minFertility: 1,
            maxFertility: 3,
            waterRequired: 2,
            fertilizerRequired: 2,
            yield: 3,
            seedCost: 3,
            seedlingCost: 8,
            shelfLife: 15,
            icon: '🌽'
        },
        {
            type: 'Tomato',
            plantingOptions: ['Seed', 'Seedling'],
            growthStages: ['Seed', 'Seedling', 'Growing', 'Mature', 'Overripe', 'Rotten'],
            preferredSeason: 'Summer',
            minWater: 1,
            maxWater: 3,
            minFertility: 0,
            maxFertility: 2,
            waterRequired: 2,
            fertilizerRequired: 1,
            yield: 2,
            seedCost: 4,
            seedlingCost: 10,
            shelfLife: 7,
            icon: '🍅'
        },
        {
            type: 'Lettuce',
            plantingOptions: ['Seed', 'Seedling'],
            growthStages: ['Seed', 'Seedling', 'Growing', 'Mature', 'Overripe', 'Rotten'],
            preferredSeason: 'Spring',
            minWater: 1,
            maxWater: 2,
            minFertility: 1,
            maxFertility: 2,
            waterRequired: 2,
            fertilizerRequired: 1,
            yield: 2,
            seedCost: 2,
            seedlingCost: 7,
            shelfLife: 6,
            icon: '🥬'
        },
        {
            type: 'Carrot',
            plantingOptions: ['Seed', 'Seedling'],
            growthStages: ['Seed', 'Seedling', 'Growing', 'Mature', 'Overripe', 'Rotten'],
            preferredSeason: 'Autumn',
            minWater: 1,
            maxWater: 2,
            minFertility: 1,
            maxFertility: 2,
            waterRequired: 1,
            fertilizerRequired: 1,
            yield: 2,
            seedCost: 2,
            seedlingCost: 6,
            shelfLife: 20,
            icon: '🥕'
        },
        {
            type: 'Coffee',
            plantingOptions: ['Seed', 'Seedling'],
            growthStages: ['Seed', 'Seedling', 'Growing', 'Mature', 'Overripe', 'Rotten'],
            preferredSeason: 'Summer',
            minWater: 2,
            maxWater: 3,
            minFertility: 2,
            maxFertility: 3,
            waterRequired: 3,
            fertilizerRequired: 2,
            yield: 2,
            seedCost: 6,
            seedlingCost: 14,
            shelfLife: 30,
            icon: '☕'
        },
        {
            type: 'Pumpkin',
            plantingOptions: ['Seed', 'Seedling'],
            growthStages: ['Seed', 'Seedling', 'Growing', 'Mature', 'Overripe', 'Rotten'],
            preferredSeason: 'Autumn',
            minWater: 2,
            maxWater: 4,
            minFertility: 1,
            maxFertility: 3,
            waterRequired: 3,
            fertilizerRequired: 2,
            yield: 4,
            seedCost: 4,
            seedlingCost: 12,
            shelfLife: 40,
            icon: '🎃'
        }
    ])



    return { plantTypes }
})
