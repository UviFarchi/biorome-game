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
                    recoveryRate: 5,
                    compaction: 0,
                    ph: 7
                },
                plant: null,
                animal: null,
                pests: 0,
                weeds: 0,
                pollination: 0,
                waste: 0,
                defense: 0,
                assemblies: []
            }))
        )
    )

    const harvestRequirements = {
        // PLANTS
        'Corn': [
            { type: 'transport' },
            { type: 'battery' },
            { type: 'camera', subtype: 'rgb' },
            { type: 'arm', subtype: 'medium' },
            { type: 'cart' },
            { type: 'gripper' }
        ],
        'Tomato': [
            { type: 'transport' },
            { type: 'battery' },
            { type: 'camera', subtype: 'rgb' },
            { type: 'arm', subtype: 'medium' },
            { type: 'gripper' }
        ],
        'Lettuce': [
            { type: 'transport' },
            { type: 'battery' },
            { type: 'camera', subtype: 'rgb' },
            { type: 'arm', subtype: 'small' },
            { type: 'gripper' }
        ],
        'Pumpkin': [
            { type: 'transport' },
            { type: 'battery' },
            { type: 'arm', subtype: 'medium' },
            { type: 'cart' },
            { type: 'cutter' }
        ],
        'Carrot': [
            { type: 'transport' },
            { type: 'battery' },
            { type: 'arm', subtype: 'small' },
            { type: 'digger' }
        ],
        'Grass': [
            { type: 'transport' },
            { type: 'battery' },
            { type: 'cutter', subtype: 'rotating' }
        ],
        'Coffee': [
            { type: 'transport' },
            { type: 'battery' },
            { type: 'arm', subtype: 'small' },
            { type: 'gripper' }
        ],
        'Apple Tree': [
            { type: 'transport' },
            { type: 'battery' },
            { type: 'arm', subtype: 'medium' },
            { type: 'cart' },
            { type: 'gripper' }
        ],
        'Lavender': [
            { type: 'transport' },
            { type: 'battery' },
            { type: 'arm', subtype: 'small' },
            { type: 'gripper' }
        ],
        'Clover': [
            { type: 'transport' },
            { type: 'battery' },
            { type: 'cutter', subtype: 'rotating' }
        ],
        'Sunflower': [
            { type: 'transport' },
            { type: 'battery' },
            { type: 'arm', subtype: 'medium' },
            { type: 'gripper' }
        ],
        'Oak Tree': [
            { type: 'transport' },
            { type: 'battery' },
            { type: 'arm', subtype: 'heavy' },
            { type: 'cart' },
            { type: 'cutter', subtype: 'saw' }
        ],
        'Poplar': [
            { type: 'transport' },
            { type: 'battery' },
            { type: 'arm', subtype: 'heavy' },
            { type: 'cart' },
            { type: 'cutter', subtype: 'saw' }
        ],
        'Willow': [
            { type: 'transport' },
            { type: 'battery' },
            { type: 'arm', subtype: 'heavy' },
            { type: 'cart' },
            { type: 'cutter', subtype: 'saw' }
        ],
        'Strawberry': [
            { type: 'transport' },
            { type: 'battery' },
            { type: 'arm', subtype: 'small' },
            { type: 'gripper' }
        ],
        'Blueberry': [
            { type: 'transport' },
            { type: 'battery' },
            { type: 'arm', subtype: 'small' },
            { type: 'gripper' }
        ],
        'Pear Tree': [
            { type: 'transport' },
            { type: 'battery' },
            { type: 'arm', subtype: 'medium' },
            { type: 'cart' },
            { type: 'gripper' }
        ],
        'Almond Tree': [
            { type: 'transport' },
            { type: 'battery' },
            { type: 'arm', subtype: 'medium' },
            { type: 'cart' },
            { type: 'gripper' }
        ],

        // ANIMAL PRODUCTS
        'Milk': [
            { type: 'transport' },
            { type: 'battery' },
            { type: 'arm', subtype: 'medium' },
            { type: 'gripper' }
        ],
        'Goat Milk': [
            { type: 'transport' },
            { type: 'battery' },
            { type: 'arm', subtype: 'small' },
            { type: 'gripper' }
        ],
        'Eggs': [
            { type: 'transport' },
            { type: 'battery' },
            { type: 'camera', subtype: 'rgb' },
            { type: 'arm', subtype: 'small' },
            { type: 'suction' },
            { type: 'cart' }
        ],
        'Duck Eggs': [
            { type: 'transport' },
            { type: 'battery' },
            { type: 'camera', subtype: 'rgb' },
            { type: 'arm', subtype: 'small' },
            { type: 'suction' },
            { type: 'cart' }
        ],
        'Honey': [
            { type: 'transport' },
            { type: 'battery' },
            { type: 'arm', subtype: 'small' },
            { type: 'extractor', subtype: 'honey' }
        ],
        'Wool': [
            { type: 'transport' },
            { type: 'battery' },
            { type: 'arm', subtype: 'small' },
            { type: 'brush' }
        ],
        'Rabbit Fur': [
            { type: 'transport' },
            { type: 'battery' },
            { type: 'arm', subtype: 'small' },
            { type: 'brush' }
        ],
        'Manure': [
            { type: 'transport' },
            { type: 'battery' },
            { type: 'shovel' }
        ],

        // LIVE ANIMAL TRANSPORT (for market)
        'Cow': [
            { type: 'transport' },
            { type: 'battery' },
            { type: 'cart', subtype: 'animal' }
        ],
        'Goat': [
            { type: 'transport' },
            { type: 'battery' },
            { type: 'cart', subtype: 'animal' }
        ],
        'Sheep': [
            { type: 'transport' },
            { type: 'battery' },
            { type: 'cart', subtype: 'animal' }
        ],
        'Pig': [
            { type: 'transport' },
            { type: 'battery' },
            { type: 'cart', subtype: 'animal' }
        ],
        'Chicken': [
            { type: 'transport' },
            { type: 'battery' },
            { type: 'cage' }
        ],
        'Duck': [
            { type: 'transport' },
            { type: 'battery' },
            { type: 'cage' }
        ],
        'Rabbit': [
            { type: 'transport' },
            { type: 'battery' },
            { type: 'cage' }
        ],
        'Horse': [
            { type: 'transport' },
            { type: 'battery' },
            { type: 'cart', subtype: 'animal' }
        ],
        'Donkey': [
            { type: 'transport' },
            { type: 'battery' },
            { type: 'cart', subtype: 'animal' }
        ],
        'Bee': [
            { type: 'transport' },
            { type: 'battery' },
            { type: 'box', subtype: 'hive' }
        ]
    }

    export const plantingRequirements = {
        Seed: [
            { type: 'transport' },
            { type: 'arm' },
            { type: 'seeder' },
            { type: 'borer' }
        ],
        Seedling: [
            { type: 'transport' },
            { type: 'arm' },
            { type: 'cart' },
            { type: 'gripper' }
        ]
    }
        = {
        // Plants (examples)
        'Corn': [
            { type: 'transport' },
            { name: 'Battery Pack' },
            { name: 'GPS Module' },
            { type: 'arm', subtype: 'medium' },
            { type: 'camera', subtype: 'rgb' },
            { name: 'Gripper' },
            { name: 'Suction Tool' },
            { type: 'cart' }
        ],
        'Tomato': [
            { type: 'transport' },
            { type: 'battery' },
            { type: 'camera' },
            { type: 'arm', subtype: 'medium' },
            { name: 'Gripper' }
        ],
        'Lettuce': [
            { type: 'transport' },
            { name: 'Battery Pack' },
            { type: 'camera', subtype: 'rgb' },
            { type: 'arm', subtype: 'small' },
            { name: 'Gripper' }
        ],
        'Pumpkin': [
            { type: 'transport' },
            { name: 'Battery Pack' },
            { type: 'arm', subtype: 'medium' },
            { name: 'Cutter/Saw' },
            { type: 'cart' }
        ],
        'Carrot': [
            { type: 'transport' },
            { name: 'Battery Pack' },
            { type: 'arm', subtype: 'small' },
            { name: 'Digger' }
        ],
        'Grass': [
            { type: 'transport' },
            { name: 'Battery Pack' },
            { name: 'Rotating Blades' }
        ],
        'Coffee': [
            { type: 'transport' },
            { name: 'Battery Pack' },
            { type: 'arm', subtype: 'small' },
            { name: 'Gripper' }
        ],

        // Animal products (examples)
        'Egg': [
            { type: 'transport' },
            { name: 'Battery Pack' },
            { type: 'camera', subtype: 'rgb' },
            { type: 'arm', subtype: 'small' },
            { name: 'Suction Tool' },
            { type: 'cart' },
            { name: 'Mycelium Box' }
        ],
        'Milk': [
            { type: 'transport' },
            { name: 'Battery Pack' },
            { type: 'camera', subtype: 'rgb' },
            { type: 'arm', subtype: 'medium' },
            { name: 'Gripper' }
        ],
        'Wool': [
            { type: 'transport' },
            { name: 'Battery Pack' },
            { type: 'arm', subtype: 'small' },
            { name: 'Brush Tool' }
        ],

        // Animal harvesting
        'Chicken': [
            { type: 'transport' },
            { name: 'Battery Pack' },
            { type: 'arm', subtype: 'small' }
        ],
        'Cow': [
            { type: 'transport' },
            { name: 'Battery Pack' },
            { type: 'arm', subtype: 'heavy' }
        ],
        'Sheep': [
            { type: 'transport' },
            { name: 'Battery Pack' },
            { type: 'arm', subtype: 'medium' }
        ],
    }
    return { tiles, harvestRequirements, plantingRequirements }
})
