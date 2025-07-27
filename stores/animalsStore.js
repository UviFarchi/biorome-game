import {defineStore} from 'pinia'
import {ref} from 'vue'

export const animalsStore = defineStore('animalTypes', () => {
    const products = ref(
        [
            {key: 'milk', icon: '🥛', label: 'Milk', basePrice: 3, shelfLife: 2},
            {key: 'goat milk', icon: '🥛', label: 'Goat Milk', basePrice: 4, shelfLife: 2},
            {key: 'eggs', icon: '🥚', label: 'Eggs', basePrice: 2, shelfLife: 3},
            {key: 'duck eggs', icon: '🥚', label: 'Duck Eggs', basePrice: 3, shelfLife: 3},
            {key: 'honey', icon: '🍯', label: 'Honey', basePrice: 5, shelfLife: 1000},
            {key: 'wool', icon: '🧶', label: 'Wool', basePrice: 7, shelfLife: 1000}
        ])

    const animalTypes = ref([{
        type: 'cow',
        icon: '🐄',
        food: ['Grass', 'Corn', 'Animal Feed'],
        foodConsumption: 3,
        waterConsumption: 4,
        health: 100,
        cost: 20,
        appreciationPerTurn: 1,
        product:'milk',
        outputFrequency: 1,
        wastePerTurn: 2,
        effect: [{type: 'fertilizer', strength: 2}, {type: 'synergy', strength: 1, target: ['Clover', 'Grass']}]
    }, {
        type: 'goat',
        icon: '🐐',
        food: ['Grass', 'Lettuce', 'Corn', 'Animal Feed'],
        foodConsumption: 2,
        waterConsumption: 3,
        health: 100,
        cost: 15,
        appreciationPerTurn: 1,
        product:'goat milk',
        outputFrequency: 2,
        wastePerTurn: 2,
        effect: [{type: 'fertilizer', strength: 1}, {
            type: 'synergy',
            strength: 1,
            target: ['Clover', 'Grass', 'Lavender']
        }]
    }, {
        type: 'sheep',
        icon: '🐑',
        food: ['Grass', 'Clover', 'Animal Feed'],
        foodConsumption: 2,
        waterConsumption: 3,
        health: 100,
        cost: 14,
        appreciationPerTurn: 1,
        product:'wool',
        outputFrequency: 10,
        wastePerTurn: 2,
        effect: [{type: 'fertilizer', strength: 1}, {type: 'synergy', strength: 1, target: ['Clover', 'Grass']}]
    }, {
        type: 'pig',
        icon: '🐖',
        food: ['Corn', 'Carrot', 'Pumpkin', 'Animal Feed'],
        foodConsumption: 2,
        waterConsumption: 2,
        health: 100,
        cost: 12,
        appreciationPerTurn: 1,
        product:'',
        outputFrequency: 0,
        wastePerTurn: 3,
        effect: [{type: 'fertilizer', strength: 2}, {
            type: 'synergy',
            strength: 1,
            target: ['Pumpkin', 'Carrot', 'Grass']
        }]
    }, {
        type: 'chicken',
        icon: '🐔',
        food: ['Seeds', 'Corn', 'Grass', 'Animal Feed'],
        foodConsumption: 1,
        waterConsumption: 1,
        health: 100,
        cost: 10,
        appreciationPerTurn: 0.5,
        product:'eggs',
        outputFrequency: 1,
        wastePerTurn: 1,
        effect: [{type: 'pest_control', strength: 1}, {
            type: 'synergy',
            strength: 1,
            target: ['Tomato', 'Pumpkin', 'Carrot']
        }]
    }, {
        type: 'duck',
        icon: '🦆',
        food: ['Seeds', 'Grass', 'Animal Feed'],
        foodConsumption: 1,
        waterConsumption: 2,
        health: 100,
        cost: 11,
        appreciationPerTurn: 0.5,
        product:'duck eggs',
        outputFrequency: 2,
        wastePerTurn: 1,
        effect: [{type: 'pest_control', strength: 1}, {type: 'weed_suppression', strength: 1}, {
            type: 'synergy',
            strength: 1,
            target: ['Rice', 'Lettuce', 'Clover']
        }]
    }, {
        type: 'bee',
        icon: '🐝',
        food: ['Flowers', 'Clover', 'Lavender', 'Sunflower', 'Animal Feed'],
        foodConsumption: 0.5,
        waterConsumption: 0.5,
        health: 100,
        cost: 15,
        appreciationPerTurn: 0.2,
        product:'honey',
        outputFrequency: 3,
        wastePerTurn: 0,
        effect: [{type: 'pollination', strength: 2}, {
            type: 'synergy',
            strength: 1,
            target: ['Apple Tree', 'Pear Tree', 'Lavender', 'Sunflower', 'Strawberry', 'Blueberry', 'Grape Vine', 'Pumpkin']
        }]
    }, {
        type: 'rabbit',
        icon: '🐇',
        food: ['Grass', 'Carrot', 'Lettuce', 'Clover', 'Animal Feed'],
        foodConsumption: 1,
        waterConsumption: 1,
        health: 100,
        cost: 8,
        appreciationPerTurn: 0.5,
        product:'',
        outputFrequency: 0,
        wastePerTurn: 1,
        effect: [{type: 'soil_loosen', strength: 1}, {type: 'weed_suppression', strength: 1}]
    }, {
        type: 'horse',
        icon: '🐎',
        food: ['Grass', 'Oats', 'Animal Feed'],
        foodConsumption: 3,
        waterConsumption: 4,
        health: 100,
        cost: 50,
        appreciationPerTurn: 2,
        product:'',
        outputFrequency: 0,
        wastePerTurn: 3,
        effect: [{type: 'defense', strength: 1}, {type: 'synergy', strength: 1, target: ['Cow', 'Sheep', 'Goat']}]
    }, {
        type: 'donkey',
        icon: '🫏',
        food: ['Grass', 'Oats', 'Animal Feed'],
        foodConsumption: 2,
        waterConsumption: 3,
        health: 100,
        cost: 25,
        appreciationPerTurn: 1,
        product:'',
        outputFrequency: 0,
        wastePerTurn: 2,
        effect: [{type: 'surprise', strength: 2}]
    }, {
        type: 'ladybug',
        icon: '🐞',
        food: ['Clover', 'Animal Feed'],
        foodConsumption: 0,
        waterConsumption: 0.1,
        health: 100,
        cost: 5,
        appreciationPerTurn: 0,
        product:'',
        outputFrequency: 0,
        wastePerTurn: 0,
        effect: [{type: 'pest_control', strength: 3}, {type: 'synergy', strength: 2, target: ['Lettuce', 'Tomato']}]
    }, {
        type: 'dog',
        icon: '🐕',
        food: ['Animal Feed'],
        foodConsumption: 1,
        waterConsumption: 1,
        health: 100,
        cost: 16,
        appreciationPerTurn: 0,
        product:'',
        outputFrequency: 0,
        wastePerTurn: 1,
        effect: [{type: 'defense', strength: 2}, {type: 'synergy', strength: 1, target: ['Sheep', 'Goat']}]
    }])


    return {animalTypes, products}
})
