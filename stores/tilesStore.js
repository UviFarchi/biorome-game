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
                animal: null,
                assemblies: []
            }))
        )
    )

    const harvestRequirements = {
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

        // Animal harvesting (for butchering, e.g. Chicken, Cow, Sheep, etc.)
        'Chicken': [
            { type: 'transport' },
            { name: 'Battery Pack' },
            { type: 'arm', subtype: 'small' },
            { name: 'Cutter/Saw' }
        ],
        'Cow': [
            { type: 'transport' },
            { name: 'Battery Pack' },
            { type: 'arm', subtype: 'heavy' },
            { name: 'Cutter/Saw' }
        ],
        'Sheep': [
            { type: 'transport' },
            { name: 'Battery Pack' },
            { type: 'arm', subtype: 'medium' },
            { name: 'Cutter/Saw' }
        ],
    }
    return { tiles, harvestRequirements }
})
