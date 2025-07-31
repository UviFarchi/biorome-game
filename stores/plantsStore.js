import {defineStore} from 'pinia'
import {ref} from 'vue'

export const plantsStore = defineStore('plantTypes', () => {
    const plantTypes = ref({
        annuals: [
            {
                type: 'grass',
                plantingOptions: ['seed', 'seedling'],
                growthStages: ['seed', 'seedling', 'vegetative', 'ripe', 'overripe'],
                daysPerGrowthStage: [7, 21, 40, 20, 8],
                waterRequired: 600,
                fertilizerRequired: 50,
                yield: 8000,
                // Spring & early autumn hay cuts
                harvestWindows: [
                    { startMonth: 5, startDay: 15, endMonth: 6, endDay: 30 },
                    { startMonth: 9, startDay: 1, endMonth: 9, endDay: 30 }
                ],
                seedCost: 0.1,
                seedlingCost: 0.5,
                icon: '🌱',
                productKey: 'hay',
                plantMaterialKey: 'biomass',
                removedWhenHarvested: false,
                effects: [{ type: 'weed_suppression', strength: 1 }],
                synergies: [{ target: 'clover', strength: 1 }]
            },
            {
                type: 'corn',
                plantingOptions: ['seed', 'seedling'],
                growthStages: ['seed', 'seedling', 'vegetative', 'flowering', 'green fruit', 'ripe', 'overripe'],
                daysPerGrowthStage: [7, 14, 50, 10, 8, 8, 4],
                waterRequired: 600,
                fertilizerRequired: 150,
                yield: 8000,
                // One harvest period
                harvestWindows: [
                    { startMonth: 7, startDay: 1, endMonth: 8, endDay: 15 },
                    { startMonth: 9, startDay: 1, endMonth: 10, endDay: 15 }
                ],
                seedCost: 0.1,
                seedlingCost: 0.5,
                icon: '🌽',
                productKey: 'corn_cob',
                plantMaterialKey: 'biomass',
                removedWhenHarvested: true,
                effects: [{ type: 'water_consumption', strength: 2 }],
                synergies: [{ target: 'beans', strength: 1 }, { target: 'pumpkin', strength: 1 }]
            },
            {
                type: 'tomato',
                plantingOptions: ['seed', 'seedling'],
                growthStages: ['seed', 'seedling', 'vegetative', 'flowering', 'green fruit', 'ripe', 'overripe'],
                daysPerGrowthStage: [8, 12, 30, 15, 10, 10, 5],
                waterRequired: 700,
                fertilizerRequired: 120,
                yield: 50000,
                // Summer and autumn (can harvest indeterminate tomatoes twice)
                harvestWindows: [
                    { startMonth: 7, startDay: 1, endMonth: 8, endDay: 15 },
                    { startMonth: 9, startDay: 1, endMonth: 9, endDay: 30 }
                ],
                seedCost: 0.2,
                seedlingCost: 1.0,
                icon: '🍅',
                productKey: 'tomato_fruit',
                plantMaterialKey: 'biomass',
                removedWhenHarvested: true,
                effects: [{ type: 'water_consumption', strength: 2 }],
                synergies: [
                    { target: 'basil', strength: 1 },
                    { target: 'marigold', strength: 1 },
                    { target: 'bee', strength: 1 },
                    { target: 'ladybug', strength: 1 },
                    { target: 'chicken', strength: 1 }
                ]
            },
            {
                type: 'lettuce',
                plantingOptions: ['seed', 'seedling'],
                growthStages: ['seed', 'seedling', 'vegetative', 'green fruit', 'ripe', 'overripe'],
                daysPerGrowthStage: [4, 10, 30, 7, 6, 4],
                waterRequired: 300,
                fertilizerRequired: 50,
                yield: 25000,
                // Spring & early autumn (often two crops)
                harvestWindows: [
                    { startMonth: 4, startDay: 15, endMonth: 6, endDay: 15 },
                    { startMonth: 9, startDay: 1, endMonth: 10, endDay: 15 }
                ],
                seedCost: 0.05,
                seedlingCost: 0.5,
                icon: '🥬',
                productKey: 'lettuce_leaf',
                plantMaterialKey: 'biomass',
                removedWhenHarvested: true,
                effects: [{ type: 'water_consumption', strength: 1 }],
                synergies: [{ target: 'clover', strength: 1 }, { target: 'duck', strength: 1 }]
            },
            // ...repeat for all other crops, following this window pattern...
        ],
        perennials: [
            {
                type: 'strawberry',
                plantingOptions: ['seed', 'seedling'],
                growthStages: ['seed', 'seedling', 'juvenile', 'fruiting', 'old'],
                daysPerGrowthStage: [14, 14, 90, 730, 730],
                fruitStages: ['flowering', 'green fruit', 'ripe', 'overripe'],
                daysPerFruitStage: [7, 10, 10, 5],
                waterRequired: 600,
                fertilizerRequired: 100,
                yield: 20000,
                // Two fruiting periods: spring/early summer, and again late summer
                harvestWindows: [
                    { startMonth: 5, startDay: 20, endMonth: 6, endDay: 30 },
                    { startMonth: 8, startDay: 15, endMonth: 9, endDay: 15 }
                ],
                seedCost: 0.05,
                seedlingCost: 1.0,
                icon: '🍓',
                productKey: 'strawberry_fruit',
                plantMaterialKey: 'biomass',
                removedWhenHarvested: false,
                effects: [{ type: 'pollination', strength: 1 }],
                synergies: [{ target: 'bee', strength: 1 }, { target: 'ladybug', strength: 1 }]
            },
            {
                type: 'blueberry',
                plantingOptions: ['seed', 'seedling'],
                growthStages: ['seed', 'seedling', 'juvenile', 'fruiting', 'old'],
                daysPerGrowthStage: [0, 30, 365, 3650, 3650],
                fruitStages: ['flowering', 'green fruit', 'ripe', 'overripe'],
                daysPerFruitStage: [10, 15, 10, 7],
                waterRequired: 700,
                fertilizerRequired: 50,
                yield: 20000,
                // Two windows: late June/early July and August
                harvestWindows: [
                    { startMonth: 6, startDay: 25, endMonth: 7, endDay: 15 },
                    { startMonth: 8, startDay: 1, endMonth: 8, endDay: 20 }
                ],
                seedCost: 0.1,
                seedlingCost: 3.0,
                icon: '🫐',
                productKey: 'blueberry_fruit',
                plantMaterialKey: 'biomass',
                removedWhenHarvested: false,
                effects: [{ type: 'pollination', strength: 1 }, { type: 'ph_down', strength: 0.2 }],
                synergies: [{ target: 'bee', strength: 1 }]
            },
            // ...repeat for all other perennials and trees with appropriate windows...
        ]
    })


    const products = {
        // Annuals
        hay: {
            icon: '🌱',
            label: 'Hay',
            basePrice: 1,
            shelfLife: 10,
            harvestType: 'product'
        },
        corn_cob: {
            icon: '🌽',
            label: 'Corn Cob',
            basePrice: 1,
            shelfLife: 15,
            harvestType: 'product'
        },
        tomato_fruit: {
            icon: '🍅',
            label: 'Tomato',
            basePrice: 1,
            shelfLife: 7,
            harvestType: 'product'
        },
        lettuce_leaf: {
            icon: '🥬',
            label: 'Lettuce Leaf',
            basePrice: 1,
            shelfLife: 6,
            harvestType: 'product'
        },
        carrot_root: {
            icon: '🥕',
            label: 'Carrot Root',
            basePrice: 1,
            shelfLife: 20,
            harvestType: 'product'
        },
        pumpkin_fruit: {
            icon: '🎃',
            label: 'Pumpkin',
            basePrice: 2,
            shelfLife: 40,
            harvestType: 'product'
        },
        lavender_flower: {
            icon: '💜',
            label: 'Lavender Flower',
            basePrice: 3,
            shelfLife: 15,
            harvestType: 'product'
        },
        clover_flower: {
            icon: '☘️',
            label: 'Clover Flower',
            basePrice: 1,
            shelfLife: 10,
            harvestType: 'product'
        },
        sunflower_seed: {
            icon: '🌻',
            label: 'Sunflower Seed',
            basePrice: 2,
            shelfLife: 12,
            harvestType: 'product'
        },
        wheat_grain: {
            icon: '🌾',
            label: 'Wheat Grain',
            basePrice: 1,
            shelfLife: 90,
            harvestType: 'product'
        },
        barley_grain: {
            icon: '🌾',
            label: 'Barley Grain',
            basePrice: 1,
            shelfLife: 90,
            harvestType: 'product'
        },
        oats_grain: {
            icon: '🌾',
            label: 'Oats Grain',
            basePrice: 1,
            shelfLife: 90,
            harvestType: 'product'
        },

        // Perennials & fruit/nut trees
        strawberry_fruit: {
            icon: '🍓',
            label: 'Strawberry',
            basePrice: 3,
            shelfLife: 7,
            harvestType: 'product'
        },
        blueberry_fruit: {
            icon: '🫐',
            label: 'Blueberry',
            basePrice: 4,
            shelfLife: 7,
            harvestType: 'product'
        },
        coffee_beans: {
            icon: '☕',
            label: 'Coffee Beans',
            basePrice: 2,
            shelfLife: 30,
            harvestType: 'product'
        },
        apple: {
            icon: '🍏',
            label: 'Apple',
            basePrice: 4,
            shelfLife: 20,
            harvestType: 'product'
        },
        acorn: {
            icon: '🌰',
            label: 'Acorn',
            basePrice: 1,
            shelfLife: 45,
            harvestType: 'product'
        },
        pear: {
            icon: '🍐',
            label: 'Pear',
            basePrice: 4,
            shelfLife: 20,
            harvestType: 'product'
        },
        almond: {
            icon: '🌰',
            label: 'Almond',
            basePrice: 6,
            shelfLife: 30,
            harvestType: 'product'
        },
        orange: {
            icon: '🍊',
            label: 'Orange',
            basePrice: 5,
            shelfLife: 18,
            harvestType: 'product'
        },
        lemon: {
            icon: '🍋',
            label: 'Lemon',
            basePrice: 5,
            shelfLife: 18,
            harvestType: 'product'
        },
        grape: {
            icon: '🍇',
            label: 'Grape',
            basePrice: 5,
            shelfLife: 10,
            harvestType: 'product'
        },
        willow_bark: {
            icon: '',
            label: 'Willow Bark',
            basePrice: 3,
            shelfLife: 60,
            harvestType: 'product'
        },
        biomass: {
            icon: '',
            label: 'Plant Biomass',
            basePrice: 0,
            shelfLife: 7,
            harvestType: 'plant'
        },
        wood: {
            icon: '🪵',
            label: 'Wood',
            basePrice: 6,
            shelfLife: 80,
            harvestType: 'plant'
        }
    }


    return {plantTypes, products}
})
