import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const gameStateStore = defineStore('gameState', () => {
    const startDate = ref(new Date().toISOString().slice(0, 10))
    const day = ref(0)
    const temperature = ref(25) // Celsius
    const rainfall = ref(0)     // mm
    const cloudCover = ref(0.1) // 0 (clear) to 1 (overcast)
    const electricity = ref(0)
    const water = ref(0)
    const waste = ref(0)

    // User/game profile
    const userName = ref('')
    const userAvatar = ref('')
    const gold = ref(10000)
    const difficulty = ref(1)

    if (localStorage.getItem('bioromeUser')) {
        const data = JSON.parse(localStorage.getItem('bioromeUser'))
        userName.value = data.userName || ''
        userAvatar.value = data.userAvatar || ''
        difficulty.value = data.difficulty || 0
    }
    watch([userName, userAvatar, difficulty], () => {
        localStorage.setItem('bioromeUser', JSON.stringify({
            userName: userName.value,
            userAvatar: userAvatar.value,
            difficulty: difficulty.value
        }))
    })

    // News/event log for ticker and event memory
    const eventLog = ref([])

    // Canonical events
    const possibleEvents =
        [

        {
            id: 'event-1',
            type: 'event',
            headline: 'Locust Swarm',
            details: 'Pest pressure rises on all crops.',
            frequency: 0.04,
            duration: 3,
            effect: [
                { target: 'tile', property: 'pests', delta: 2 }
            ]
        },
        {
            id: 'event-2',
            type: 'event',
            headline: 'Organic Trend',
            details: 'Organic produce is in high demand!',
            frequency: 0.02,
            duration: 5,
            effect: [
                { target: 'market', affectedTypes: ['allPlants'], priceModifier: 1.3 }
            ]
        },
        {
            id: 'event-3',
            type: 'event',
            headline: 'Fungal Disease',
            details: 'Humidity triggers fungal problems for some crops.',
            frequency: 0.03,
            duration: 3,
            effect: [
                { target: 'plantType', plant: ['Wheat', 'Barley', 'Oats', 'Strawberry'], health: -8 }
            ]
        },
        {
            id: 'event-4',
            type: 'event',
            headline: 'Wildlife Incursion',
            details: 'Wild boars and birds raid unprotected fields. Defense helps!',
            frequency: 0.01,
            duration: 1,
            effect: [
                { target: 'tile', property: 'defense', delta: -2 },
                { target: 'plantType', plant: null, health: -6 }
            ]
        },
        {
            id: 'event-5',
            type: 'event',
            headline: 'Beneficial Insects',
            details: 'A surge in ladybugs and bees boosts pollination and pest control.',
            frequency: 0.07,
            duration: 2,
            effect: [
                { target: 'tile', property: 'pollination', delta: 2 },
                { target: 'tile', property: 'pests', delta: -2 }
            ]
        },
        // Market events
        {
            id: 'market-1',
            type: 'market',
            headline: 'Corn Price Surge',
            details: 'Corn prices spike after export shortage.',
            frequency: 0.10,
            duration: 4,
            effect: [
                { target: 'market', affectedTypes: ['Corn'], priceModifier: 1.4 }
            ]
        },
        {
            id: 'market-2',
            type: 'market',
            headline: 'Wool Demand Drops',
            details: 'Warm weather lowers demand for wool products.',
            frequency: 0.08,
            duration: 3,
            effect: [
                { target: 'market', affectedTypes: ['Wool'], priceModifier: 0.7 }
            ]
        },
        {
            id: 'market-3',
            type: 'market',
            headline: 'Excess Honey',
            details: 'Local honey market is flooded, prices drop.',
            frequency: 0.05,
            duration: 4,
            effect: [
                { target: 'market', affectedTypes: ['Honey'], priceModifier: 0.6 }
            ]
        },
        // Special/fun
        {
            id: 'special-1',
            type: 'event',
            headline: 'Surprise Donkey Day',
            details: 'Your donkey causes a commotion. See the news for details!',
            frequency: 0.01,
            duration: 1,
            effect: [
                { target: 'event', property: 'surprise', delta: 1 }
            ]
        },
        {
            id: 'special-2',
            type: 'event',
            headline: 'Mushroom Fairy Ring',
            details: 'A magical circle of mushrooms boosts soil fertility in a random tile!',
            frequency: 0.01,
            duration: 1,
            effect: [
                { target: 'tile', property: 'fertility', delta: 3, tileCount: 1 }
            ]
        },
    ]

    const weatherEvents =
        // Weather events
        [{
            id: 'weather-1',
            type: 'weather',
            season: 'spring',
            headline: 'Steady Showers',
            details: 'Gentle rain soaks the fields. Soil moisture rises.',
            frequency: 0.15,
            duration: 2,
            effect: [
                { target: 'weather', parameter: 'rainfall', delta: 3 }
            ]
        },
        {
            id: 'weather-2',
            type: 'weather',
            season: 'spring',
            headline: 'Cool Snap',
            details: 'Night temperatures drop. Growth slows for warm-season crops.',
            frequency: 0.05,
            duration: 2,
            effect: [
                { target: 'weather', parameter: 'temperature', delta: -4 }
            ]
        },
        {
            id: 'weather-3',
            type: 'weather',
            season: 'summer',
            headline: 'Drought',
            details: 'A persistent drought dries out the soil. Water demand increases.',
            frequency: 0.08,
            duration: 5,
            effect: [
                { target: 'weather', parameter: 'rainfall', delta: -3 },
                { target: 'weather', parameter: 'temperature', delta: 2 }
            ]
        },
        {
            id: 'weather-4',
            type: 'weather',
            season: 'summer',
            headline: 'Heatwave',
            details: 'High temperatures stress both plants and animals.',
            frequency: 0.05,
            duration: 3,
            effect: [
                { target: 'weather', parameter: 'temperature', delta: 5 }
            ]
        },
        {
            id: 'weather-5',
            type: 'weather',
            season: 'autumn',
            headline: 'Early Frost',
            details: 'A surprise frost damages tender crops.',
            frequency: 0.04,
            duration: 1,
            effect: [
                { target: 'weather', parameter: 'temperature', delta: -8 }
            ]
        },
        {
            id: 'weather-6',
            type: 'weather',
            season: 'winter',
            headline: 'Snowfall',
            details: 'Snow insulates the soil, but harvests must wait.',
            frequency: 0.09,
            duration: 2,
            effect: [
                { target: 'weather', parameter: 'rainfall', delta: 1 }, // snow adds to soil water after melting
                { target: 'weather', parameter: 'temperature', delta: -4 }
            ]
        },
        {
            id: 'weather-7',
            type: 'weather',
            season: 'spring',
            headline: 'Mild Spring',
            details: 'Perfect weather for planting and growth.',
            frequency: 0.12,
            duration: 3,
            effect: [
                { target: 'weather', parameter: 'temperature', delta: 2 }
            ]
        },
        {
            id: 'weather-8',
            type: 'weather',
            season: 'any',
            headline: 'Thunderstorm',
            details: 'Heavy rains and wind. Occasional equipment outages.',
            frequency: 0.03,
            duration: 1,
            effect: [
                { target: 'weather', parameter: 'rainfall', delta: 5 },
                { target: 'weather', parameter: 'cloudCover', delta: 0.4 }
            ]
        }]
    const seasonalWeather = {
        spring: {
            temperature: { min: 12, max: 22, mean: 17 },
            rainfall: { min: 0, max: 8, mean: 2 },
            cloudCover: { min: 0.1, max: 0.5, mean: 0.25 }
        },
        summer: {
            temperature: { min: 20, max: 35, mean: 28 },
            rainfall: { min: 0, max: 5, mean: 1 },
            cloudCover: { min: 0, max: 0.4, mean: 0.1 }
        },
        autumn: {
            temperature: { min: 10, max: 24, mean: 16 },
            rainfall: { min: 0, max: 10, mean: 3 },
            cloudCover: { min: 0.1, max: 0.7, mean: 0.35 }
        },
        winter: {
            temperature: { min: 1, max: 12, mean: 7 },
            rainfall: { min: 0, max: 7, mean: 2 },
            cloudCover: { min: 0.3, max: 1, mean: 0.6 }
        }
    }


    return {
        startDate,
        day,
        temperature,
        rainfall,
        cloudCover,
        electricity,
        water,
        waste,
        userName,
        userAvatar,
        gold,
        difficulty,
        eventLog,
        possibleEvents,
        weatherEvents,
        seasonalWeather
    }
})
