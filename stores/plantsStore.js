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
                harvestWindows: [{month: 5, day: 15}, {month: 6, day: 30}],
                seedCost: 0.1,
                seedlingCost: 0.5,
                icon: '🌱',
                productKey: 'hay',
                plantMaterialKey: 'biomass',
                removedWhenHarvested: false,
                effects: [{type: 'weed_suppression', strength: 1}],
                synergies: [{target: 'clover', strength: 1}]
            },
            {
                type: 'corn',
                plantingOptions: ['seed', 'seedling'],
                growthStages: ['seed', 'seedling', 'vegetative', 'flowering', 'green fruit', 'ripe', 'overripe'],
                daysPerGrowthStage: [7, 14, 50, 10, 8, 8, 4],
                waterRequired: 600,
                fertilizerRequired: 150,
                yield: 8000,
                harvestWindows: [{month: 9, day: 1}, {month: 10, day: 15}],
                seedCost: 0.1,
                seedlingCost: 0.5,
                icon: '🌽',
                productKey: 'corn_cob',
                plantMaterialKey: 'biomass',
                removedWhenHarvested: true,
                effects: [{type: 'water_consumption', strength: 2}],
                synergies: [{target: 'beans', strength: 1}, {target: 'pumpkin', strength: 1}]
            },
            {
                type: 'tomato',
                plantingOptions: ['seed', 'seedling'],
                growthStages: ['seed', 'seedling', 'vegetative', 'flowering', 'green fruit', 'ripe', 'overripe'],
                daysPerGrowthStage: [8, 12, 30, 15, 10, 10, 5],
                waterRequired: 700,
                fertilizerRequired: 120,
                yield: 50000,
                harvestWindows: [{month: 7, day: 1}, {month: 9, day: 30}],
                seedCost: 0.2,
                seedlingCost: 1.0,
                icon: '🍅',
                productKey: 'tomato_fruit',
                plantMaterialKey: 'biomass',
                removedWhenHarvested: true,
                effects: [{type: 'water_consumption', strength: 2}],
                synergies: [
                    {target: 'basil', strength: 1},
                    {target: 'marigold', strength: 1},
                    {target: 'bee', strength: 1},
                    {target: 'ladybug', strength: 1},
                    {target: 'chicken', strength: 1}
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
                harvestWindows: [{month: 5, day: 1}, {month: 6, day: 15}],
                seedCost: 0.05,
                seedlingCost: 0.5,
                icon: '🥬',
                productKey: 'lettuce_leaf',
                plantMaterialKey: 'biomass',
                removedWhenHarvested: true,
                effects: [{type: 'water_consumption', strength: 1}],
                synergies: [{target: 'clover', strength: 1}, {target: 'duck', strength: 1}]
            },
            {
                type: 'carrot',
                plantingOptions: ['seed', 'seedling'],
                growthStages: ['seed', 'seedling', 'vegetative', 'green fruit', 'ripe', 'overripe'],
                daysPerGrowthStage: [14, 14, 35, 10, 10, 5],
                waterRequired: 400,
                fertilizerRequired: 80,
                yield: 40000,
                harvestWindows: [{month: 6, day: 1}, {month: 7, day: 31}],
                seedCost: 0.02,
                seedlingCost: 0.2,
                icon: '🥕',
                productKey: 'carrot_root',
                plantMaterialKey: 'biomass',
                removedWhenHarvested: true,
                effects: [{type: 'soil_loosen', strength: 1}],
                synergies: [
                    {target: 'rabbit', strength: 1},
                    {target: 'pumpkin', strength: 1},
                    {target: 'pig', strength: 1}
                ]
            },
            {
                type: 'pumpkin',
                plantingOptions: ['seed', 'seedling'],
                growthStages: ['seed', 'seedling', 'vegetative', 'flowering', 'green fruit', 'ripe', 'overripe'],
                daysPerGrowthStage: [7, 14, 40, 15, 15, 10, 6],
                waterRequired: 500,
                fertilizerRequired: 100,
                yield: 35000,
                harvestWindows: [{month: 9, day: 15}, {month: 10, day: 31}],
                seedCost: 0.5,
                seedlingCost: 2.0,
                icon: '🎃',
                productKey: 'pumpkin_fruit',
                plantMaterialKey: 'biomass',
                removedWhenHarvested: true,
                effects: [{type: 'water_consumption', strength: 3}],
                synergies: [
                    {target: 'corn', strength: 1},
                    {target: 'beans', strength: 1},
                    {target: 'bee', strength: 1},
                    {target: 'pig', strength: 1}
                ]
            },
            {
                type: 'lavender',
                plantingOptions: ['seed', 'seedling'],
                growthStages: ['seed', 'seedling', 'vegetative', 'flowering', 'green fruit', 'ripe', 'overripe'],
                daysPerGrowthStage: [21, 30, 30, 20, 10, 10, 6],
                waterRequired: 250,
                fertilizerRequired: 20,
                yield: 1000,
                harvestWindows: [{month: 6, day: 1}, {month: 7, day: 15}],
                seedCost: 0.1,
                seedlingCost: 1.0,
                icon: '💜',
                productKey: 'lavender_flower',
                plantMaterialKey: 'biomass',
                removedWhenHarvested: false,
                effects: [
                    {type: 'pollination', strength: 1},
                    {type: 'pest_control', strength: 1}
                ],
                synergies: [
                    {target: 'bee', strength: 1},
                    {target: 'apple_tree', strength: 1},
                    {target: 'pear_tree', strength: 1},
                    {target: 'almond_tree', strength: 1}
                ]
            },
            {
                type: 'clover',
                plantingOptions: ['seed', 'seedling'],
                growthStages: ['seed', 'seedling', 'vegetative', 'flowering', 'green fruit', 'ripe', 'overripe'],
                daysPerGrowthStage: [10, 14, 30, 10, 8, 8, 4],
                waterRequired: 400,
                fertilizerRequired: 0,
                yield: 10000,
                harvestWindows: [{month: 5, day: 1}, {month: 6, day: 30}],
                seedCost: 0.01,
                seedlingCost: 0.1,
                icon: '☘️',
                productKey: 'clover_flower',
                plantMaterialKey: 'biomass',
                removedWhenHarvested: false,
                effects: [{type: 'nitrogen_fixing', strength: 1}],
                synergies: [
                    {target: 'coffee', strength: 1},
                    {target: 'apple_tree', strength: 1}
                ]
            },
            {
                type: 'sunflower',
                plantingOptions: ['seed', 'seedling'],
                growthStages: ['seed', 'seedling', 'vegetative', 'flowering', 'green fruit', 'ripe', 'overripe'],
                daysPerGrowthStage: [7, 10, 40, 15, 10, 10, 6],
                waterRequired: 500,
                fertilizerRequired: 80,
                yield: 2500,
                harvestWindows: [{month: 8, day: 15}, {month: 9, day: 30}],
                seedCost: 0.1,
                seedlingCost: 0.5,
                icon: '🌻',
                productKey: 'sunflower_seed',
                plantMaterialKey: 'biomass',
                removedWhenHarvested: true,
                effects: [{type: 'pollination', strength: 1}],
                synergies: [
                    {target: 'bee', strength: 1},
                    {target: 'grape_vine', strength: 1},
                    {target: 'coffee', strength: 1}
                ]
            },
            {
                type: 'wheat',
                plantingOptions: ['seed', 'seedling'],
                growthStages: ['seed', 'seedling', 'vegetative', 'flowering', 'green fruit', 'ripe', 'overripe'],
                daysPerGrowthStage: [7, 14, 60, 7, 7, 7, 4],
                waterRequired: 500,
                fertilizerRequired: 100,
                yield: 4500,
                harvestWindows: [{month: 7, day: 1}, {month: 8, day: 1}],
                seedCost: 0.005,
                seedlingCost: 0.05,
                icon: '🌾',
                productKey: 'wheat_grain',
                plantMaterialKey: 'biomass',
                removedWhenHarvested: true,
                effects: [{type: 'weed_suppression', strength: 1}],
                synergies: []
            },
            {
                type: 'barley',
                plantingOptions: ['seed', 'seedling'],
                growthStages: ['seed', 'seedling', 'vegetative', 'flowering', 'green fruit', 'ripe', 'overripe'],
                daysPerGrowthStage: [7, 14, 55, 7, 7, 7, 4],
                waterRequired: 450,
                fertilizerRequired: 80,
                yield: 7000,
                harvestWindows: [{month: 7, day: 1}, {month: 7, day: 31}],
                seedCost: 0.005,
                seedlingCost: 0.05,
                icon: '🌾',
                productKey: 'barley_grain',
                plantMaterialKey: 'biomass',
                removedWhenHarvested: true,
                effects: [{type: 'weed_suppression', strength: 1}],
                synergies: []
            },
            {
                type: 'oats',
                plantingOptions: ['seed', 'seedling'],
                growthStages: ['seed', 'seedling', 'vegetative', 'flowering', 'green fruit', 'ripe', 'overripe'],
                daysPerGrowthStage: [7, 14, 50, 7, 7, 7, 4],
                waterRequired: 500,
                fertilizerRequired: 60,
                yield: 5000,
                harvestWindows: [{month: 8, day: 1}, {month: 8, day: 31}],
                seedCost: 0.005,
                seedlingCost: 0.05,
                icon: '🌾',
                productKey: 'oats_grain',
                plantMaterialKey: 'biomass',
                removedWhenHarvested: true,
                effects: [{type: 'weed_suppression', strength: 1}],
                synergies: []
            }

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
                harvestWindows: [{month: 6, day: 1}, {month: 7, day: 15}],
                seedCost: 0.05,
                seedlingCost: 1.0,
                icon: '🍓',
                productKey: 'strawberry_fruit',
                plantMaterialKey: 'biomass',
                removedWhenHarvested: false,
                effects: [{type: 'pollination', strength: 1}],
                synergies: [{target: 'bee', strength: 1}, {target: 'ladybug', strength: 1}]
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
                harvestWindows: [{month: 7, day: 1}, {month: 8, day: 15}],
                seedCost: 0.1,
                seedlingCost: 3.0,
                icon: '🫐',
                productKey: 'blueberry_fruit',
                plantMaterialKey: 'biomass',
                removedWhenHarvested: false,
                effects: [{type: 'pollination', strength: 1}, {type: 'ph_down', strength: 0.2}],
                synergies: [{target: 'bee', strength: 1}]
            },
            {
                type: 'coffee',
                plantingOptions: ['seed', 'seedling'],
                growthStages: ['seed', 'seedling', 'juvenile', 'fruiting', 'old'],
                daysPerGrowthStage: [30, 730, 730, 1460, 1460],
                fruitStages: ['flowering', 'green fruit', 'ripe', 'overripe'],
                daysPerFruitStage: [14, 180, 30, 14],
                waterRequired: 1500,
                fertilizerRequired: 200,
                yield: 3000,
                harvestWindows: [{month: 11, day: 1}, {month: 1, day: 31}],
                seedCost: 0.1,
                seedlingCost: 1.0,
                icon: '☕',
                productKey: 'coffee_beans',
                plantMaterialKey: 'biomass',
                removedWhenHarvested: false,
                effects: [{type: 'ph_down', strength: 0.2}],
                synergies: [
                    {target: 'bee', strength: 1},
                    {target: 'clover', strength: 1},
                    {target: 'sunflower', strength: 1}
                ]
            },
            {
                type: 'apple_tree',
                plantingOptions: ['seed', 'seedling'],
                growthStages: ['seed', 'seedling', 'sapling', 'fruiting', 'old'],
                daysPerGrowthStage: [60, 730, 1095, 5475, 5475],
                fruitStages: ['flowering', 'green fruit', 'ripe', 'overripe'],
                daysPerFruitStage: [10, 120, 30, 15],
                waterRequired: 700,
                fertilizerRequired: 80,
                yield: 30000,
                harvestWindows: [{month: 9, day: 1}, {month: 10, day: 15}],
                seedCost: 0.2,
                seedlingCost: 10.0,
                icon: '🍏',
                productKey: 'apple',
                plantMaterialKey: 'wood',
                removedWhenHarvested: false,
                effects: [{type: 'pollination', strength: 1}],
                synergies: [
                    {target: 'bee', strength: 2},
                    {target: 'lavender', strength: 2},
                    {target: 'sunflower', strength: 2}
                ]
            },
            {
                type: 'oak_tree',
                plantingOptions: ['seed', 'seedling'],
                growthStages: ['seed', 'seedling', 'sapling', 'fruiting', 'old'],
                daysPerGrowthStage: [20, 730, 3650, 18250, 18250],
                fruitStages: ['flowering', 'acorn', 'ripe', 'overripe'],
                daysPerFruitStage: [10, 120, 30, 30],
                waterRequired: 500,
                fertilizerRequired: 0,
                yield: 250000,
                harvestWindows: [{month: 10, day: 1}, {month: 11, day: 15}],
                seedCost: 0.05,
                seedlingCost: 5.0,
                icon: '🌳',
                productKey: 'acorn',
                plantMaterialKey: 'wood',
                removedWhenHarvested: true,
                effects: [{type: 'weed_suppression', strength: 2}],
                synergies: []
            },
            {
                type: 'poplar',
                plantingOptions: ['seed', 'seedling'],
                growthStages: ['seed', 'seedling', 'juvenile', 'fruiting', 'old'],
                daysPerGrowthStage: [1, 180, 1095, 2190, 2190],
                fruitStages: ['flowering', 'seed_catkin', 'ripe', 'overripe'],
                daysPerFruitStage: [7, 30, 7, 0],
                waterRequired: 800,
                fertilizerRequired: 100,
                yield: 100000,
                harvestWindows: [{month: 11, day: 1}, {month: 12, day: 31}],
                seedCost: 0.05,
                seedlingCost: 2.0,
                icon: '🌲',
                productKey: '',
                plantMaterialKey: 'wood',
                removedWhenHarvested: true,
                effects: [{type: 'weed_suppression', strength: 2}],
                synergies: []
            },
            {
                type: 'willow',
                plantingOptions: ['seed', 'seedling'],
                growthStages: ['seed', 'seedling', 'juvenile', 'fruiting', 'old'],
                daysPerGrowthStage: [1, 180, 730, 2190, 2190],
                fruitStages: ['flowering', 'seed_catkin', 'ripe', 'overripe'],
                daysPerFruitStage: [7, 30, 7, 0],
                waterRequired: 1000,
                fertilizerRequired: 80,
                yield: 30000,
                harvestWindows: [{month: 1, day: 1}, {month: 2, day: 28}],
                seedCost: 0.05,
                seedlingCost: 1.0,
                icon: '🌳',
                productKey: 'willow_bark',
                plantMaterialKey: 'wood',
                removedWhenHarvested: false,
                effects: [{type: 'weed_suppression', strength: 2}],
                synergies: []
            },
            {
                type: 'pear_tree',
                plantingOptions: ['seed', 'seedling'],
                growthStages: ['seed', 'seedling', 'sapling', 'fruiting', 'old'],
                daysPerGrowthStage: [60, 730, 1095, 5110, 5110],
                fruitStages: ['flowering', 'green fruit', 'ripe', 'overripe'],
                daysPerFruitStage: [10, 110, 20, 10],
                waterRequired: 600,
                fertilizerRequired: 60,
                yield: 30000,
                harvestWindows: [{month: 8, day: 15}, {month: 9, day: 30}],
                seedCost: 0.2,
                seedlingCost: 10.0,
                icon: '🍐',
                productKey: 'pear',
                plantMaterialKey: 'wood',
                removedWhenHarvested: false,
                effects: [{type: 'pollination', strength: 1}],
                synergies: [
                    {target: 'bee', strength: 2},
                    {target: 'lavender', strength: 2},
                    {target: 'sunflower', strength: 2}
                ]
            },
            {
                type: 'almond_tree',
                plantingOptions: ['seed', 'seedling'],
                growthStages: ['seed', 'seedling', 'sapling', 'fruiting', 'old'],
                daysPerGrowthStage: [30, 730, 730, 3650, 3650],
                fruitStages: ['flowering', 'green fruit', 'ripe', 'overripe'],
                daysPerFruitStage: [7, 150, 30, 10],
                waterRequired: 800,
                fertilizerRequired: 150,
                yield: 2800,
                harvestWindows: [{month: 8, day: 1}, {month: 9, day: 15}],
                seedCost: 0.2,
                seedlingCost: 10.0,
                icon: '🌰',
                productKey: 'almond',
                plantMaterialKey: 'wood',
                removedWhenHarvested: false,
                effects: [{type: 'pollination', strength: 1}],
                synergies: [
                    {target: 'bee', strength: 2},
                    {target: 'clover', strength: 2}
                ]
            },
            {
                type: 'orange_tree',
                plantingOptions: ['seed', 'seedling'],
                growthStages: ['seed', 'seedling', 'sapling', 'fruiting', 'old'],
                daysPerGrowthStage: [30, 730, 730, 3650, 3650],
                fruitStages: ['flowering', 'green fruit', 'ripe', 'overripe'],
                daysPerFruitStage: [14, 240, 60, 30],
                waterRequired: 1000,
                fertilizerRequired: 180,
                yield: 30000,
                harvestWindows: [{month: 12, day: 1}, {month: 3, day: 1}],
                seedCost: 0.1,
                seedlingCost: 15.0,
                icon: '🍊',
                productKey: 'orange',
                plantMaterialKey: 'wood',
                removedWhenHarvested: false,
                effects: [{type: 'pollination', strength: 1}],
                synergies: [
                    {target: 'bee', strength: 1},
                    {target: 'lavender', strength: 1}
                ]
            },
            {
                type: 'lemon_tree',
                plantingOptions: ['seed', 'seedling'],
                growthStages: ['seed', 'seedling', 'sapling', 'fruiting', 'old'],
                daysPerGrowthStage: [30, 730, 730, 3285, 3285],
                fruitStages: ['flowering', 'green fruit', 'ripe', 'overripe'],
                daysPerFruitStage: [14, 180, 60, 30],
                waterRequired: 1000,
                fertilizerRequired: 180,
                yield: 35000,
                harvestWindows: [{month: 11, day: 1}, {month: 2, day: 28}],
                seedCost: 0.1,
                seedlingCost: 15.0,
                icon: '🍋',
                productKey: 'lemon',
                plantMaterialKey: 'wood',
                removedWhenHarvested: false,
                effects: [{type: 'pollination', strength: 1}],
                synergies: [
                    {target: 'bee', strength: 1},
                    {target: 'lavender', strength: 1}
                ]
            },
            {
                type: 'grape_vine',
                plantingOptions: ['seed', 'seedling'],
                growthStages: ['seed', 'seedling', 'juvenile', 'fruiting', 'old'],
                daysPerGrowthStage: [30, 180, 730, 1825, 1825],
                fruitStages: ['flowering', 'green fruit', 'ripe', 'overripe'],
                daysPerFruitStage: [7, 60, 30, 14],
                waterRequired: 600,
                fertilizerRequired: 50,
                yield: 25000,
                harvestWindows: [{month: 8, day: 15}, {month: 10, day: 1}],
                seedCost: 0.05,
                seedlingCost: 5.0,
                icon: '🍇',
                productKey: 'grape',
                plantMaterialKey: 'biomass',
                removedWhenHarvested: false,
                effects: [{type: 'pollination', strength: 1}],
                synergies: [
                    {target: 'bee', strength: 1},
                    {target: 'ladybug', strength: 1}
                ]
            },
        ]
    });

    const plantProducts = {
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

        // Plant material (removal/biomass/wood)
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


    return {plantTypes, plantProducts}
})
