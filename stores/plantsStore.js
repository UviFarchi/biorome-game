import {defineStore} from 'pinia'
import {ref} from 'vue'

export const plantsStore = defineStore('plantTypes', () => {
    const plantTypes = ref(
        [
            {
                type: 'Grass',
                plantingOptions: ['Seed', 'Seedling'],
                growthStages: ['Seed', 'Seedling', 'Growing', 'Mature', 'Overripe', 'Rotten'],
                daysPerStage: [2, 3, 8, 8, 2, 2],
                preferredSeason: 'Spring',
                minWater: 0, maxWater: 2, minFertility: 0, maxFertility: 2,
                waterRequired: 1, fertilizerRequired: 1,
                yield: 1,
                seedCost: 2, seedlingCost: 5,
                basePrice: 1, shelfLife: 10,
                icon: '🌱',
                product: 'Grass',
                removedWhenHarvested: true,
                effect: [
                    { type: 'weed_suppression', strength: 1 },
                    { type: 'synergy', strength: 1, target: ['Cow', 'Goat', 'Sheep'] }
                ]
            },
            {
                type: 'Corn',
                plantingOptions: ['Seed', 'Seedling'],
                growthStages: ['Seed', 'Seedling', 'Growing', 'Mature', 'Overripe', 'Rotten'],
                daysPerStage: [3, 5, 12, 10, 4, 3],
                preferredSeason: 'Summer',
                minWater: 1, maxWater: 3, minFertility: 1, maxFertility: 3,
                waterRequired: 2, fertilizerRequired: 2,
                yield: 3,
                seedCost: 3, seedlingCost: 8,
                basePrice: 1, shelfLife: 15,
                icon: '🌽',
                product: 'Corn',
                removedWhenHarvested: true,
                effect: [
                    { type: 'water_consumption', strength: 2 },
                    { type: 'synergy', strength: 1, target: ['Beans', 'Pumpkin'] }
                ]
            },
            {
                type: 'Tomato',
                plantingOptions: ['Seed', 'Seedling'],
                growthStages: ['Seed', 'Seedling', 'Growing', 'Mature', 'Overripe', 'Rotten'],
                daysPerStage: [3, 5, 10, 12, 3, 2],
                preferredSeason: 'Summer',
                minWater: 1, maxWater: 3, minFertility: 0, maxFertility: 2,
                waterRequired: 2, fertilizerRequired: 1,
                yield: 2,
                seedCost: 4, seedlingCost: 10,
                basePrice: 1, shelfLife: 7,
                icon: '🍅',
                product: 'Tomato',
                removedWhenHarvested: true,
                effect: [
                    { type: 'water_consumption', strength: 2 },
                    { type: 'synergy', strength: 1, target: ['Basil', 'Marigold', 'Bee', 'Ladybug', 'Chicken'] }
                ]
            },
            {
                type: 'Lettuce',
                plantingOptions: ['Seed', 'Seedling'],
                growthStages: ['Seed', 'Seedling', 'Growing', 'Mature', 'Overripe', 'Rotten'],
                daysPerStage: [2, 4, 8, 6, 2, 2],
                preferredSeason: 'Spring',
                minWater: 1, maxWater: 2, minFertility: 1, maxFertility: 2,
                waterRequired: 2, fertilizerRequired: 1,
                yield: 2,
                seedCost: 2, seedlingCost: 7,
                basePrice: 1, shelfLife: 6,
                icon: '🥬',
                product: 'Lettuce',
                removedWhenHarvested: true,
                effect: [
                    { type: 'water_consumption', strength: 1 },
                    { type: 'synergy', strength: 1, target: ['Clover', 'Duck', 'Ladybug'] }
                ]
            },
            {
                type: 'Carrot',
                plantingOptions: ['Seed', 'Seedling'],
                growthStages: ['Seed', 'Seedling', 'Growing', 'Mature', 'Overripe', 'Rotten'],
                daysPerStage: [3, 6, 15, 15, 3, 2],
                preferredSeason: 'Autumn',
                minWater: 1, maxWater: 2, minFertility: 1, maxFertility: 2,
                waterRequired: 1, fertilizerRequired: 1,
                yield: 2,
                seedCost: 2, seedlingCost: 6,
                basePrice: 1, shelfLife: 20,
                icon: '🥕',
                product: 'Carrot',
                removedWhenHarvested: true,
                effect: [
                    { type: 'soil_loosen', strength: 1 },
                    { type: 'synergy', strength: 1, target: ['Rabbit', 'Pumpkin', 'Pig'] }
                ]
            },
            {
                type: 'Coffee',
                plantingOptions: ['Seed', 'Seedling'],
                growthStages: ['Seed', 'Seedling', 'Growing', 'Mature', 'Overripe', 'Rotten'],
                daysPerStage: [10, 20, 60, 80, 20, 10],
                preferredSeason: 'Summer',
                minWater: 2, maxWater: 3, minFertility: 2, maxFertility: 3,
                waterRequired: 3, fertilizerRequired: 2,
                yield: 2,
                seedCost: 6, seedlingCost: 14,
                basePrice: 2, shelfLife: 30,
                icon: '☕',
                product: 'Coffee Beans',
                removedWhenHarvested: false,
                effect: [
                    { type: 'ph_down', strength: 0.2 },
                    { type: 'synergy', strength: 1, target: ['Bee', 'Clover', 'Sunflower'] }
                ]
            },
            {
                type: 'Pumpkin',
                plantingOptions: ['Seed', 'Seedling'],
                growthStages: ['Seed', 'Seedling', 'Growing', 'Mature', 'Overripe', 'Rotten'],
                daysPerStage: [5, 7, 14, 16, 5, 3],
                preferredSeason: 'Autumn',
                minWater: 2, maxWater: 4, minFertility: 1, maxFertility: 3,
                waterRequired: 3, fertilizerRequired: 2,
                yield: 4,
                seedCost: 4, seedlingCost: 12,
                basePrice: 2, shelfLife: 40,
                icon: '🎃',
                product: 'Pumpkin',
                removedWhenHarvested: true,
                effect: [
                    { type: 'water_consumption', strength: 3 },
                    { type: 'synergy', strength: 1, target: ['Corn', 'Beans', 'Bee', 'Pig'] }
                ]
            },
            {
                type: 'Apple Tree',
                plantingOptions: ['Seedling'],
                growthStages: ['Seedling', 'Growing', 'Young Tree', 'Mature', 'Harvestable', 'Old'],
                daysPerStage: [7, 40, 80, 90, 30, 180],
                preferredSeason: 'Spring',
                minWater: 2, maxWater: 4, minFertility: 2, maxFertility: 4,
                waterRequired: 3, fertilizerRequired: 2,
                yield: 5,
                seedCost: 0, seedlingCost: 20,
                basePrice: 4, shelfLife: 20,
                icon: '🍏',
                product: 'Apple',
                removedWhenHarvested: false,
                effect: [
                    { type: 'pollination', strength: 1 },
                    { type: 'synergy', strength: 2, target: ['Bee', 'Lavender', 'Sunflower'] }
                ]
            },
            {
                type: 'Pear Tree',
                plantingOptions: ['Seedling'],
                growthStages: ['Seedling', 'Growing', 'Young Tree', 'Mature', 'Harvestable', 'Old'],
                daysPerStage: [7, 40, 80, 90, 30, 180],
                preferredSeason: 'Spring',
                minWater: 2, maxWater: 4, minFertility: 2, maxFertility: 4,
                waterRequired: 3, fertilizerRequired: 2,
                yield: 5,
                seedCost: 0, seedlingCost: 20,
                basePrice: 4, shelfLife: 20,
                icon: '🍐',
                product: 'Pear',
                removedWhenHarvested: false,
                effect: [
                    { type: 'pollination', strength: 1 },
                    { type: 'synergy', strength: 2, target: ['Bee', 'Lavender', 'Sunflower'] }
                ]
            },
            {
                type: 'Almond Tree',
                plantingOptions: ['Seedling'],
                growthStages: ['Seedling', 'Growing', 'Young Tree', 'Mature', 'Harvestable', 'Old'],
                daysPerStage: [10, 50, 100, 100, 50, 200],
                preferredSeason: 'Spring',
                minWater: 2, maxWater: 4, minFertility: 2, maxFertility: 4,
                waterRequired: 3, fertilizerRequired: 3,
                yield: 5,
                seedCost: 0, seedlingCost: 24,
                basePrice: 6, shelfLife: 30,
                icon: '🌰',
                product: 'Almond',
                removedWhenHarvested: false,
                effect: [
                    { type: 'pollination', strength: 1 },
                    { type: 'synergy', strength: 2, target: ['Bee', 'Clover'] }
                ]
            },
            {
                type: 'Lavender',
                plantingOptions: ['Seed', 'Seedling'],
                growthStages: ['Seed', 'Seedling', 'Growing', 'Mature', 'Blooming', 'Overripe', 'Rotten'],
                daysPerStage: [4, 7, 10, 12, 12, 2, 2],
                preferredSeason: 'Spring',
                minWater: 1, maxWater: 3, minFertility: 0, maxFertility: 2,
                waterRequired: 1, fertilizerRequired: 1,
                yield: 2,
                seedCost: 2, seedlingCost: 8,
                basePrice: 3, shelfLife: 15,
                icon: '💜',
                product: 'Lavender',
                removedWhenHarvested: true,
                effect: [
                    { type: 'pollination', strength: 1 },
                    { type: 'synergy', strength: 1, target: ['Bee', 'Apple Tree', 'Pear Tree', 'Almond Tree'] }
                ]
            },
            {
                type: 'Clover',
                plantingOptions: ['Seed', 'Seedling'],
                growthStages: ['Seed', 'Seedling', 'Growing', 'Mature', 'Flowering', 'Overripe', 'Rotten'],
                daysPerStage: [2, 3, 8, 10, 10, 2, 2],
                preferredSeason: 'Spring',
                minWater: 1, maxWater: 2, minFertility: 0, maxFertility: 2,
                waterRequired: 1, fertilizerRequired: 0,
                yield: 1,
                seedCost: 2, seedlingCost: 5,
                basePrice: 1, shelfLife: 10,
                icon: '☘️',
                product: 'Clover',
                removedWhenHarvested: true
            },
            {
                type: 'Sunflower',
                plantingOptions: ['Seed', 'Seedling'],
                growthStages: ['Seed', 'Seedling', 'Growing', 'Mature', 'Flowering', 'Overripe', 'Rotten'],
                daysPerStage: [3, 5, 8, 12, 6, 2, 2],
                preferredSeason: 'Summer',
                minWater: 1, maxWater: 3, minFertility: 1, maxFertility: 3,
                waterRequired: 2, fertilizerRequired: 1,
                yield: 3,
                seedCost: 3, seedlingCost: 8,
                basePrice: 2, shelfLife: 12,
                icon: '🌻',
                product: 'Sunflower Seed',
                removedWhenHarvested: true
            },
            {
                type: 'Oak Tree',
                plantingOptions: ['Seedling'],
                growthStages: ['Seedling', 'Growing', 'Sapling', 'Mature', 'Harvestable', 'Old'],
                daysPerStage: [20, 120, 180, 360, 60, 600],
                preferredSeason: 'Autumn',
                minWater: 2, maxWater: 4, minFertility: 1, maxFertility: 3,
                waterRequired: 3, fertilizerRequired: 2,
                yield: 8,
                seedCost: 0, seedlingCost: 28,
                basePrice: 7, shelfLife: 60,
                icon: '🌳',
                product: 'Oak Wood',
                removedWhenHarvested: false,
                effect: [
                    { type: 'weed_suppression', strength: 2 }
                  //  TODO => oaks, poplars and willows are habitat, should add synergy with animals
                ]
            },
            {
                type: 'Poplar',
                plantingOptions: ['Seedling'],
                growthStages: ['Seedling', 'Growing', 'Sapling', 'Mature', 'Harvestable', 'Old'],
                daysPerStage: [16, 90, 140, 240, 60, 400],
                preferredSeason: 'Autumn',
                minWater: 2, maxWater: 4, minFertility: 1, maxFertility: 3,
                waterRequired: 3, fertilizerRequired: 2,
                yield: 7,
                seedCost: 0, seedlingCost: 18,
                basePrice: 6, shelfLife: 55,
                icon: '🌲',
                product: 'Poplar Wood',
                removedWhenHarvested: false,
                effect: [
                    { type: 'weed_suppression', strength: 2 }
                ]
            },
            {
                type: 'Willow',
                plantingOptions: ['Seedling'],
                growthStages: ['Seedling', 'Growing', 'Sapling', 'Mature', 'Harvestable', 'Old'],
                daysPerStage: [12, 70, 110, 160, 40, 400],
                preferredSeason: 'Autumn',
                minWater: 2, maxWater: 4, minFertility: 1, maxFertility: 3,
                waterRequired: 3, fertilizerRequired: 2,
                yield: 7,
                seedCost: 0, seedlingCost: 18,
                basePrice: 6, shelfLife: 50,
                icon: '🌳',
                product: 'Willow Wood',
                removedWhenHarvested: false,
                effect: [
                    { type: 'weed_suppression', strength: 2 }
                ]
            },
            {
                type: 'Strawberry',
                plantingOptions: ['Seed', 'Seedling'],
                growthStages: ['Seed', 'Seedling', 'Growing', 'Mature', 'Flowering', 'Harvestable', 'Overripe', 'Rotten'],
                daysPerStage: [2, 4, 8, 10, 8, 3, 2, 2],
                preferredSeason: 'Spring',
                minWater: 1, maxWater: 2, minFertility: 1, maxFertility: 2,
                waterRequired: 2, fertilizerRequired: 1,
                yield: 2,
                seedCost: 3, seedlingCost: 9,
                basePrice: 3, shelfLife: 7,
                icon: '🍓',
                product: 'Strawberry',
                removedWhenHarvested: true,
                effect: [
                    { type: 'pollination', strength: 1 },
                    { type: 'synergy', strength: 1, target: ['Bee', 'Ladybug'] }
                ]
            },
            {
                type: 'Blueberry',
                plantingOptions: ['Seed', 'Seedling'],
                growthStages: ['Seed', 'Seedling', 'Growing', 'Mature', 'Flowering', 'Harvestable', 'Overripe', 'Rotten'],
                daysPerStage: [2, 4, 10, 12, 8, 3, 2, 2],
                preferredSeason: 'Spring',
                minWater: 1, maxWater: 2, minFertility: 1, maxFertility: 2,
                waterRequired: 2, fertilizerRequired: 1,
                yield: 2,
                seedCost: 3, seedlingCost: 9,
                basePrice: 4, shelfLife: 7,
                icon: '🫐',
                product: 'Blueberry',
                removedWhenHarvested: true,
                effect: [
                    { type: 'pollination', strength: 1 },
                    { type: 'ph_down', strength: 0.2 },
                    { type: 'synergy', strength: 1, target: ['Bee'] }
                ]
            },
            // Cereal and fruit staples to add to plantTypes:
            {
                type: 'Wheat',
                plantingOptions: ['Seed', 'Seedling'],
                growthStages: ['Seed', 'Seedling', 'Growing', 'Mature', 'Overripe', 'Rotten'],
                daysPerStage: [2, 5, 16, 10, 3, 2],
                preferredSeason: 'Spring',
                minWater: 1, maxWater: 2, minFertility: 1, maxFertility: 2,
                waterRequired: 1, fertilizerRequired: 1,
                yield: 3,
                seedCost: 2, seedlingCost: 6,
                basePrice: 1, shelfLife: 90,
                icon: '🌾',
                product: 'Wheat',
                removedWhenHarvested: true,
                effect: [
                    { type: 'weed_suppression', strength: 1 }
                ]
            },
            {
                type: 'Barley',
                plantingOptions: ['Seed', 'Seedling'],
                growthStages: ['Seed', 'Seedling', 'Growing', 'Mature', 'Overripe', 'Rotten'],
                daysPerStage: [2, 5, 15, 9, 3, 2],
                preferredSeason: 'Spring',
                minWater: 1, maxWater: 2, minFertility: 1, maxFertility: 2,
                waterRequired: 1, fertilizerRequired: 1,
                yield: 3,
                seedCost: 2, seedlingCost: 6,
                basePrice: 1, shelfLife: 90,
                icon: '🌾',
                product: 'Barley',
                removedWhenHarvested: true,
                effect: [
                    { type: 'weed_suppression', strength: 1 }
                ]
            },
            {
                type: 'Oats',
                plantingOptions: ['Seed', 'Seedling'],
                growthStages: ['Seed', 'Seedling', 'Growing', 'Mature', 'Overripe', 'Rotten'],
                daysPerStage: [2, 5, 15, 9, 3, 2],
                preferredSeason: 'Spring',
                minWater: 1, maxWater: 2, minFertility: 1, maxFertility: 2,
                waterRequired: 1, fertilizerRequired: 1,
                yield: 3,
                seedCost: 2, seedlingCost: 6,
                basePrice: 1, shelfLife: 90,
                icon: '🌾',
                product: 'Oats',
                removedWhenHarvested: true,
                effect: [
                    { type: 'weed_suppression', strength: 1 }
                ]
            },
            {
                type: 'Orange Tree',
                plantingOptions: ['Seedling'],
                growthStages: ['Seedling', 'Growing', 'Young Tree', 'Mature', 'Harvestable', 'Old'],
                daysPerStage: [8, 50, 90, 90, 30, 250],
                preferredSeason: 'Spring',
                minWater: 2, maxWater: 4, minFertility: 2, maxFertility: 4,
                waterRequired: 3, fertilizerRequired: 2,
                yield: 6,
                seedCost: 0, seedlingCost: 22,
                basePrice: 5, shelfLife: 18,
                icon: '🍊',
                product: 'Orange',
                removedWhenHarvested: false,
                effect: [
                    { type: 'pollination', strength: 1 },
                    { type: 'synergy', strength: 1, target: ['Bee', 'Lavender'] }
                ]
            },
            {
                type: 'Lemon Tree',
                plantingOptions: ['Seedling'],
                growthStages: ['Seedling', 'Growing', 'Young Tree', 'Mature', 'Harvestable', 'Old'],
                daysPerStage: [8, 50, 90, 90, 30, 250],
                preferredSeason: 'Spring',
                minWater: 2, maxWater: 4, minFertility: 2, maxFertility: 4,
                waterRequired: 3, fertilizerRequired: 2,
                yield: 6,
                seedCost: 0, seedlingCost: 22,
                basePrice: 5, shelfLife: 18,
                icon: '🍋',
                product: 'Lemon',
                removedWhenHarvested: false,
                effect: [
                    { type: 'pollination', strength: 1 },
                    { type: 'synergy', strength: 1, target: ['Bee', 'Lavender'] }
                ]
            },
            {
                type: 'Grape Vine',
                plantingOptions: ['Seedling'],
                growthStages: ['Seedling', 'Growing', 'Young Vine', 'Mature', 'Harvestable', 'Old'],
                daysPerStage: [6, 25, 40, 40, 20, 200],
                preferredSeason: 'Spring',
                minWater: 2, maxWater: 4, minFertility: 1, maxFertility: 3,
                waterRequired: 2, fertilizerRequired: 2,
                yield: 4,
                seedCost: 0, seedlingCost: 15,
                basePrice: 5, shelfLife: 10,
                icon: '🍇',
                product: 'Grape',
                removedWhenHarvested: false,
                effect: [
                    { type: 'pollination', strength: 1 },
                    { type: 'synergy', strength: 1, target: ['Bee', 'Ladybug'] }
                ]
            }

        ])


    const plantProducts =
        [
            {key: 'Grass', icon: '🌱', label: 'Grass', basePrice: 1, shelfLife: 10},
            {key: 'Corn', icon: '🌽', label: 'Corn', basePrice: 1, shelfLife: 15},
            {key: 'Tomato', icon: '🍅', label: 'Tomato', basePrice: 1, shelfLife: 7},
            {key: 'Lettuce', icon: '🥬', label: 'Lettuce', basePrice: 1, shelfLife: 6},
            {key: 'Carrot', icon: '🥕', label: 'Carrot', basePrice: 1, shelfLife: 20},
            {key: 'Coffee Beans', icon: '☕', label: 'Coffee Beans', basePrice: 2, shelfLife: 30},
            {key: 'Pumpkin', icon: '🎃', label: 'Pumpkin', basePrice: 2, shelfLife: 40},
            {key: 'Apple', icon: '🍏', label: 'Apple', basePrice: 4, shelfLife: 20},
            {key: 'Pear', icon: '🍐', label: 'Pear', basePrice: 4, shelfLife: 20},
            {key: 'Almond', icon: '🌰', label: 'Almond', basePrice: 6, shelfLife: 30},
            {key: 'Lavender', icon: '💜', label: 'Lavender', basePrice: 3, shelfLife: 15},
            {key: 'Clover', icon: '☘️', label: 'Clover', basePrice: 1, shelfLife: 10},
            {key: 'Sunflower Seed', icon: '🌻', label: 'Sunflower Seed', basePrice: 2, shelfLife: 12},
            {key: 'Oak Wood', icon: '🌳', label: 'Oak Wood', basePrice: 7, shelfLife: 60},
            {key: 'Poplar Wood', icon: '🌲', label: 'Poplar Wood', basePrice: 6, shelfLife: 55},
            {key: 'Willow Wood', icon: '🌳', label: 'Willow Wood', basePrice: 6, shelfLife: 50},
            {key: 'Strawberry', icon: '🍓', label: 'Strawberry', basePrice: 3, shelfLife: 7},
            {key: 'Blueberry', icon: '🫐', label: 'Blueberry', basePrice: 4, shelfLife: 7},
            {key: 'Wheat', icon: '🌾', label: 'Wheat', basePrice: 1, shelfLife: 90},
            {key: 'Barley', icon: '🌾', label: 'Barley', basePrice: 1, shelfLife: 90},
            {key: 'Oats', icon: '🌾', label: 'Oats', basePrice: 1, shelfLife: 90},
            {key: 'Orange', icon: '🍊', label: 'Orange', basePrice: 5, shelfLife: 18},
            {key: 'Lemon', icon: '🍋', label: 'Lemon', basePrice: 5, shelfLife: 18},
            {key: 'Grape', icon: '🍇', label: 'Grape', basePrice: 5, shelfLife: 10}

        ]
    return {plantTypes, plantProducts}
})
