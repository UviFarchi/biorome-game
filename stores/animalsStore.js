import {defineStore} from 'pinia'
import {ref} from 'vue'

export const animalsStore = defineStore('animalTypes', () => {
    const products = ref([{
        key: 'Milk',
        icon: '🥛',
        label: 'Milk',
        frequency: 1,
        basePrice: 1,
        shelfLife: 1
    }, {key: 'Eggs', icon: '🥚', label: 'Eggs', frequency: 1, basePrice: 1, shelfLife: 3}, {
        key: 'Honey',
        icon: '🍯',
        label: 'Honey',
        frequency: 3,
        basePrice: 1,
        shelfLife: 1000
    }, {key: 'Wool', icon: '🧶', label: 'Wool', frequency: 10, basePrice: 1, shelfLife: 1000}, {
        key: 'Manure',
        icon: '💩',
        label: 'Manure',
        frequency: 2,
        basePrice: 1,
        shelfLife: 10
    }, {key: 'Goat Milk', icon: '🥛', label: 'Goat Milk', frequency: 2, basePrice: 1, shelfLife: 2}, {
        key: 'Duck Eggs',
        icon: '🥚',
        label: 'Duck Eggs',
        frequency: 2,
        basePrice: 2,
        shelfLife: 3
    }, {key: 'Rabbit Fur', icon: '🐇', label: 'Rabbit Fur', frequency: 12, basePrice: 4, shelfLife: 12}])


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
        shelfLife: 2
    }, {
        type: 'Goat',
        icon: '🐐',
        favoriteFoods: ['Grass', 'Lettuce', 'Corn'],
        hungerMax: 80,
        thirstMax: 100,
        mood: 100,
        cost: 15,
        product: 'Goat Milk',
        outputFrequency: 2,
        shelfLife: 2
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
        shelfLife: 10
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
        shelfLife: 7
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
        shelfLife: 3
    }, {
        type: 'Duck',
        icon: '🦆',
        favoriteFoods: ['Seeds', 'Insects', 'Grass'],
        hungerMax: 55,
        thirstMax: 40,
        mood: 100,
        cost: 11,
        product: 'Duck Eggs',
        outputFrequency: 2,
        shelfLife: 3
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
        shelfLife: 1000
    }, {
        type: 'Rabbit',
        icon: '🐇',
        favoriteFoods: ['Grass', 'Vegetables'],
        hungerMax: 40,
        thirstMax: 25,
        mood: 100,
        cost: 8,
        product: 'Rabbit Fur',
        outputFrequency: 12,
        shelfLife: 12
    }, {
        type: 'Horse',
        icon: '🐎',
        favoriteFoods: ['Grass', 'Oats'],
        hungerMax: 120,
        thirstMax: 120,
        mood: 100,
        cost: 50,
        product: 'Manure',
        outputFrequency: 2,
        shelfLife: 8
    }, {
        type: 'Donkey',
        icon: '🫏',
        favoriteFoods: ['Grass', 'Hay'],
        hungerMax: 100,
        thirstMax: 110,
        mood: 100,
        cost: 25,
        product: 'Manure',
        outputFrequency: 2,
        shelfLife: 8
    }, // Helper/strategic animals (no commercial product)
        {
            type: 'Ladybug',
            icon: '🐞',
            favoriteFoods: ['Aphids'],
            hungerMax: 20,
            thirstMax: 10,
            mood: 100,
            cost: 5, // No product: deploy for pest control
        }, {
            type: 'Dog',
            icon: '🐕',
            favoriteFoods: ['Meat', 'Dog Food'],
            hungerMax: 70,
            thirstMax: 70,
            mood: 100,
            cost: 16, // No product: deploy for tile stat boost or defense
        }])


    return {animalTypes, products}
})
