import {defineStore} from 'pinia'
import {ref} from 'vue'

export const animalsStore = defineStore('animaltypes', () => {
    const products = ref(
        [
            {key: 'milk', icon: '🥛', label: 'milk', basePrice: 3, shelfLife: 2},
            {key: 'goat_milk', icon: '🥛', label: 'goat milk', basePrice: 4, shelfLife: 2},
            {key: 'eggs', icon: '🥚', label: 'eggs', basePrice: 2, shelfLife: 3},
            {key: 'duck_eggs', icon: '🥚', label: 'duck eggs', basePrice: 3, shelfLife: 3},
            {key: 'honey', icon: '🍯', label: 'honey', basePrice: 5, shelfLife: 1000},
            {key: 'wool', icon: '🧶', label: 'wool', basePrice: 7, shelfLife: 1000}
        ])

    const animalTypes = ref([
        {
            type: 'cow',
            icon: '🐄',
            food: ['grass', 'corn', 'animal_feed'],
            foodConsumption: 3,
            waterConsumption: 4,
            health: 100,
            cost: 20,
            appreciationPerTurn: 1,
            product: 'milk',
            outputFrequency: 1,
            wastePerTurn: 2,
            effects: [{type: 'fertilizer', strength: 2}],
            synergies: [
                {target: 'clover', strength: 1},
                {target: 'grass', strength: 1}
            ]
        },
        {
            type: 'goat',
            icon: '🐐',
            food: ['grass', 'lettuce', 'corn', 'animal_feed'],
            foodConsumption: 2,
            waterConsumption: 3,
            health: 100,
            cost: 15,
            appreciationPerTurn: 1,
            product: 'goat milk',
            outputFrequency: 2,
            wastePerTurn: 2,
            effects: [{type: 'fertilizer', strength: 1}],
            synergies: [
                {target: 'clover', strength: 1},
                {target: 'grass', strength: 1},
                {target: 'lavender', strength: 1}
            ]
        },
        {
            type: 'sheep',
            icon: '🐑',
            food: ['grass', 'clover', 'animal_feed'],
            foodConsumption: 2,
            waterConsumption: 3,
            health: 100,
            cost: 14,
            appreciationPerTurn: 1,
            product: 'wool',
            outputFrequency: 10,
            wastePerTurn: 2,
            effects: [{type: 'fertilizer', strength: 1}],
            synergies: [
                {target: 'clover', strength: 1},
                {target: 'grass', strength: 1}
            ]
        },
        {
            type: 'pig',
            icon: '🐖',
            food: ['corn', 'carrot', 'pumpkin', 'animal_feed'],
            foodConsumption: 2,
            waterConsumption: 2,
            health: 100,
            cost: 12,
            appreciationPerTurn: 1,
            product: '',
            outputFrequency: 0,
            wastePerTurn: 3,
            effects: [{type: 'fertilizer', strength: 2}],
            synergies: [
                {target: 'pumpkin', strength: 1},
                {target: 'carrot', strength: 1},
                {target: 'grass', strength: 1}
            ]
        },
        {
            type: 'chicken',
            icon: '🐔',
            food: ['seeds', 'corn', 'grass', 'animal_feed'],
            foodConsumption: 1,
            waterConsumption: 1,
            health: 100,
            cost: 10,
            appreciationPerTurn: 0.5,
            product: 'eggs',
            outputFrequency: 1,
            wastePerTurn: 1,
            effects: [{type: 'pest_control', strength: 1}],
            synergies: [
                {target: 'tomato', strength: 1},
                {target: 'pumpkin', strength: 1},
                {target: 'carrot', strength: 1}
            ]
        },
        {
            type: 'duck',
            icon: '🦆',
            food: ['seeds', 'grass', 'animal_feed'],
            foodConsumption: 1,
            waterConsumption: 2,
            health: 100,
            cost: 11,
            appreciationPerTurn: 0.5,
            product: 'duck eggs',
            outputFrequency: 2,
            wastePerTurn: 1,
            effects: [
                {type: 'pest_control', strength: 1},
                {type: 'weed_suppression', strength: 1}
            ],
            synergies: [
                {target: 'rice', strength: 1},
                {target: 'lettuce', strength: 1},
                {target: 'clover', strength: 1}
            ]
        },
        {
            type: 'bee',
            icon: '🐝',
            food: ['flowers', 'clover', 'lavender', 'sunflower', 'animal_feed'],
            foodConsumption: 0.5,
            waterConsumption: 0.5,
            health: 100,
            cost: 15,
            appreciationPerTurn: 0.2,
            product: 'honey',
            outputFrequency: 3,
            wastePerTurn: 0,
            effects: [{type: 'pollination', strength: 2}],
            synergies: [
                {target: 'apple_tree', strength: 1},
                {target: 'pear_tree', strength: 1},
                {target: 'lavender', strength: 1},
                {target: 'sunflower', strength: 1},
                {target: 'strawberry', strength: 1},
                {target: 'blueberry', strength: 1},
                {target: 'grape_vine', strength: 1},
                {target: 'pumpkin', strength: 1}
            ]
        },
        {
            type: 'rabbit',
            icon: '🐇',
            food: ['grass', 'carrot', 'lettuce', 'clover', 'animal_feed'],
            foodConsumption: 1,
            waterConsumption: 1,
            health: 100,
            cost: 8,
            appreciationPerTurn: 0.5,
            product: '',
            outputFrequency: 0,
            wastePerTurn: 1,
            effects: [
                {type: 'soil_loosen', strength: 1},
                {type: 'weed_suppression', strength: 1}
            ],
            synergies: []
        },
        {
            type: 'horse',
            icon: '🐎',
            food: ['grass', 'oats', 'animal_feed'],
            foodConsumption: 3,
            waterConsumption: 4,
            health: 100,
            cost: 50,
            appreciationPerTurn: 2,
            product: '',
            outputFrequency: 0,
            wastePerTurn: 3,
            effects: [{type: 'defense', strength: 1}],
            synergies: [
                {target: 'cow', strength: 1},
                {target: 'sheep', strength: 1},
                {target: 'goat', strength: 1}
            ]
        },
        {
            type: 'donkey',
            icon: '🫏',
            food: ['grass', 'oats', 'animal_feed'],
            foodConsumption: 2,
            waterConsumption: 3,
            health: 100,
            cost: 25,
            appreciationPerTurn: 1,
            product: '',
            outputFrequency: 0,
            wastePerTurn: 2,
            effects: [
                {type: 'surprise', strength: 2},
                {type: 'defense', strength: 2},
                {type: 'fertilizer', strength: 1}
            ],
            synergies: []
        },
        {
            type: 'ladybug',
            icon: '🐞',
            food: ['clover', 'animal_feed'],
            foodConsumption: 0,
            waterConsumption: 0.1,
            health: 100,
            cost: 5,
            appreciationPerTurn: 0,
            product: '',
            outputFrequency: 0,
            wastePerTurn: 0,
            effects: [{type: 'pest_control', strength: 3}],
            synergies: [
                {target: 'lettuce', strength: 2},
                {target: 'tomato', strength: 1}
            ]
        },
        {
            type: 'dog',
            icon: '🐕',
            food: ['animal_feed'],
            foodConsumption: 1,
            waterConsumption: 1,
            health: 100,
            cost: 16,
            appreciationPerTurn: 0,
            product: '',
            outputFrequency: 0,
            wastePerTurn: 1,
            effects: [{type: 'defense', strength: 2}],
            synergies: [
                {target: 'sheep', strength: 1},
                {target: 'goat', strength: 1}
            ]
        }
    ])



    return {animalTypes, products}
})
