import {defineStore} from 'pinia'
import {ref} from 'vue'

export const animalsStore = defineStore('animalTypes', () => {
    // Product list for mapping product keys to icons (and optional desc)
    const products = ref([{key: 'Milk', icon: '🥛', label: 'Milk', frequency: 1, basePrice: 1, shelfLife: 1},          // Daily
        {key: 'Eggs', icon: '🥚', label: 'Eggs', frequency: 1, basePrice: 1, shelfLife: 3},          // Daily
        {key: 'Honey', icon: '🍯', label: 'Honey', frequency: 3, basePrice: 1, shelfLife: 1000},        // Every 3 turns
        {key: 'Wool', icon: '🧶', label: 'Wool', frequency: 10, basePrice: 1, shelfLife: 1000},         // Every 10 turns
        {key: 'Manure', icon: '💩', label: 'Manure', frequency: 2, basePrice: 1, shelfLife: 10}       // Every 2 turns
    ])

    const animalTypes = ref([{
        type: 'Cow',
        icon: '🐄',
        favoriteFoods: ['Grass', 'Corn'],
        hungerMax: 100,
        thirstMax: 100,
        mood: 100,
        cost: 20,
        product: 'Milk',
        outputFrequency: 1,
        basePrice: 1,
        shelfLife: 1
    }, {
        type: 'Goat',
        icon: '🐐',
        favoriteFoods: ['Grass', 'Lettuce', 'Corn'],
        hungerMax: 80,
        thirstMax: 100,
        mood: 100,
        cost: 15,
        product: 'Milk',
        outputFrequency: 2,
        basePrice: 1,
        shelfLife: 1
    }, {
        type: 'Chicken',
        icon: '🐔',
        favoriteFoods: ['Seeds', 'Corn'],
        hungerMax: 60,
        thirstMax: 50,
        mood: 100,
        cost: 10,
        product: 'Eggs',
        outputFrequency: 1,
        basePrice: 1,
        shelfLife: 1
    }, {
        type: 'Pig',
        icon: '🐖',
        favoriteFoods: ['Corn', 'Roots', 'Vegetable scraps'],
        hungerMax: 90,
        thirstMax: 70,
        mood: 100,
        cost: 12,
        product: 'Manure',
        outputFrequency: 2,
        basePrice: 1,
        shelfLife: 1
    }, {
        type: 'Bee',
        icon: '🐝',
        favoriteFoods: ['Flowers', 'Clover'],
        hungerMax: 40,
        thirstMax: 20,
        mood: 100,
        cost: 15,
        product: 'Honey',
        outputFrequency: 3,
        basePrice: 1,
        shelfLife: 1
    }, {
        type: 'Sheep',
        icon: '🐑',
        favoriteFoods: ['Grass', 'Clover'],
        hungerMax: 80,
        thirstMax: 70,
        mood: 100,
        cost: 14,
        product: 'Wool',
        outputFrequency: 10,
        basePrice: 1,
        shelfLife: 1
    }])

    return {animalTypes, products}
})
