import { defineStore } from 'pinia'
import { ref } from 'vue'

export const animalsStore = defineStore('animalTypes', () => {
    // Products available from animals
    const products = ref([
        { key: 'Milk', icon: '🥛', label: 'Milk', basePrice: 3, shelfLife: 2 },
        { key: 'Goat Milk', icon: '🥛', label: 'Goat Milk', basePrice: 4, shelfLife: 2 },
        { key: 'Eggs', icon: '🥚', label: 'Eggs', basePrice: 2, shelfLife: 3 },
        { key: 'Duck Eggs', icon: '🥚', label: 'Duck Eggs', basePrice: 3, shelfLife: 3 },
        { key: 'Honey', icon: '🍯', label: 'Honey', basePrice: 5, shelfLife: 1000 },
        { key: 'Wool', icon: '🧶', label: 'Wool', basePrice: 7, shelfLife: 1000 },
        { key: 'Rabbit Fur', icon: '🐇', label: 'Rabbit Fur', basePrice: 4, shelfLife: 12 },
        { key: 'Manure', icon: '💩', label: 'Manure', basePrice: 1, shelfLife: 10 }
    ])

    // Animals
    const animalTypes = ref([
        {
            type: 'Cow',
            icon: '🐄',
            favoriteFoods: ['Grass', 'Corn'],
            foodConsumption: 3,
            waterConsumption: 4,
            health: 100,
            cost: 20,
            appreciationPerTurn: 1,
            product: 'Milk',
            outputFrequency: 1,
            wastePerTurn: 2,
            effect: { type: 'fertilizer', strength: 2 }
        },
        {
            type: 'Goat',
            icon: '🐐',
            favoriteFoods: ['Grass', 'Lettuce', 'Corn'],
            foodConsumption: 2,
            waterConsumption: 3,
            health: 100,
            cost: 15,
            appreciationPerTurn: 1,
            product: 'Goat Milk',
            outputFrequency: 2,
            wastePerTurn: 2,
            effect: { type: 'fertilizer', strength: 1 }
        },
        {
            type: 'Sheep',
            icon: '🐑',
            favoriteFoods: ['Grass', 'Clover'],
            foodConsumption: 2,
            waterConsumption: 3,
            health: 100,
            cost: 14,
            appreciationPerTurn: 1,
            product: 'Wool',
            outputFrequency: 10,
            wastePerTurn: 2,
            effect: { type: 'fertilizer', strength: 1 }
        },
        {
            type: 'Pig',
            icon: '🐖',
            favoriteFoods: ['Corn', 'Roots', 'Vegetable scraps'],
            foodConsumption: 2,
            waterConsumption: 2,
            health: 100,
            cost: 12,
            appreciationPerTurn: 1,
            product: 'Manure',
            outputFrequency: 2,
            wastePerTurn: 3,
            effect: { type: 'fertilizer', strength: 2 }
        },
        {
            type: 'Chicken',
            icon: '🐔',
            favoriteFoods: ['Seeds', 'Corn'],
            foodConsumption: 1,
            waterConsumption: 1,
            health: 100,
            cost: 10,
            appreciationPerTurn: 0.5,
            product: 'Eggs',
            outputFrequency: 1,
            wastePerTurn: 1,
            effect: { type: 'pest_control', strength: 1 }
        },
        {
            type: 'Duck',
            icon: '🦆',
            favoriteFoods: ['Seeds', 'Insects', 'Grass'],
            foodConsumption: 1,
            waterConsumption: 2,
            health: 100,
            cost: 11,
            appreciationPerTurn: 0.5,
            product: 'Duck Eggs',
            outputFrequency: 2,
            wastePerTurn: 1,
            effect: { type: 'pest_control', strength: 1 }
        },
        {
            type: 'Bee',
            icon: '🐝',
            favoriteFoods: ['Flowers', 'Clover'],
            foodConsumption: 0.5,
            waterConsumption: 0.5,
            health: 100,
            cost: 15,
            appreciationPerTurn: 0.2,
            product: 'Honey',
            outputFrequency: 3,
            wastePerTurn: 0,
            effect: { type: 'pollination', strength: 2 }
        },
        {
            type: 'Rabbit',
            icon: '🐇',
            favoriteFoods: ['Grass', 'Vegetables'],
            foodConsumption: 1,
            waterConsumption: 1,
            health: 100,
            cost: 8,
            appreciationPerTurn: 0.5,
            product: 'Rabbit Fur',
            outputFrequency: 12,
            wastePerTurn: 1,
            effect: { type: 'soil_loosen', strength: 1 }
        },
        {
            type: 'Horse',
            icon: '🐎',
            favoriteFoods: ['Grass', 'Oats'],
            foodConsumption: 3,
            waterConsumption: 4,
            health: 100,
            cost: 50,
            appreciationPerTurn: 2,
            product: 'Manure',
            outputFrequency: 2,
            wastePerTurn: 3,
            effect: { type: 'defense', strength: 1 }
        },
        {
            type: 'Donkey',
            icon: '🫏',
            favoriteFoods: ['Grass', 'Hay'],
            foodConsumption: 2,
            waterConsumption: 3,
            health: 100,
            cost: 25,
            appreciationPerTurn: 1,
            product: 'Manure',
            outputFrequency: 2,
            wastePerTurn: 2,
            effect: { type: 'surprise', strength: 2 }
        },
        {
            type: 'Ladybug',
            icon: '🐞',
            favoriteFoods: ['Aphids'],
            foodConsumption: 0,
            waterConsumption: 0.1,
            health: 100,
            cost: 5,
            appreciationPerTurn: 0,
            product: '',
            outputFrequency: 0,
            wastePerTurn: 0,
            effect: { type: 'pest_control', strength: 3 }
        },
        {
            type: 'Dog',
            icon: '🐕',
            favoriteFoods: ['Meat', 'Dog Food'],
            foodConsumption: 1,
            waterConsumption: 1,
            health: 100,
            cost: 16,
            appreciationPerTurn: 0,
            product: '',
            outputFrequency: 0,
            wastePerTurn: 1,
            effect: { type: 'defense', strength: 2, radius: 2 }
        }
    ])

    return { animalTypes, products }
})
