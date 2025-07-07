import {defineStore} from 'pinia'
import {ref} from 'vue'

export const modulesStore = defineStore('modules', () => {
    const availableModules = ref([
        {type: 'Light Ground Transport', count: 3, functions: ['move']},
        {type: 'Heavy Ground Transport', count: 1, functions: ['move', 'carryHeavy']},
        {type: 'Heavy Air Transport', count: 2, functions: ['fly', 'carryHeavy']},
        {type: 'Fixed Pole', count: 4, functions: ['staticMount']},
        {type: 'Irrigator', count: 3, functions: ['irrigate']},
        {type: 'Fertilizer', count: 3, functions: ['fertilize']},
        {type: 'Collector', count: 2, functions: ['collect']},
        {type: 'Feeder', count: 2, functions: ['feedAnimals']},
        {type: 'Seeder', count: 2, functions: ['seedPlants']},
        {type: 'Planter', count: 2, functions: ['plantPlants']},
        {type: 'Borer', count: 2, functions: ['boreHoles']},
        {type: 'Robotic Arm', count: 2, functions: ['manipulate', 'harvest']},
        {type: 'Soil Sensor', count: 4, functions: ['senseSoil']},
        {type: 'Multispectral Camera', count: 1, functions: ['sensePlants', 'detectPests']},
        {type: 'Pest Sprayer', count: 1, functions: ['sprayPesticide']},
        {type: 'Animal Collar', count: 5, functions: ['restrictAnimal']}
    ])


    const assemblies = ref([
        {
            id: 1,
            modules: ['Light Ground Transport', 'Irrigator', 'Soil Sensor'],
            deployed: false
        },
        {
            id: 2,
            modules: ['Heavy Air Transport', 'Collector', 'Multispectral Camera'],
            deployed: false
        }, {
            id: 3, modules: ['Fixed Pole', 'Feeder'], deployed: false,
        }, {
            id: 4,
            modules: ['Light Ground Transport', 'Planter', 'Soil Sensor'],
            deployed: false
        }, {
            id: 5,
            modules: ['Light Ground Transport', 'Robotic Arm', 'Multispectral Camera'],
            deployed: false
        }, {
            id: 6,
            modules: ['Light Ground Transport', 'Irrigator', 'Soil Sensor'],
            deployed: false
        }, {
            id: 7,
            modules: ['Light Ground Transport', 'Irrigator', 'Multispectral Camera'],
            deployed: false
        }, {
            id: 8,
            modules: ['Light Ground Transport', 'Irrigator', 'Soil Sensor'],
            deployed: false
        }, {
            id: 9,
            modules: ['Light Ground Transport', 'Irrigator', 'Soil Sensor'],
            deployed: false
        }, {
            id: 10,
            modules: ['Light Ground Transport', 'Irrigator', 'Multispectral Camera'],
            deployed: false
        }
    ])

    return {availableModules, assemblies}
})
