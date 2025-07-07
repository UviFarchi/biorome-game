import {defineStore} from 'pinia'
import {ref} from 'vue'

export const marketStore = defineStore('villagers', () => {
    // Master list of villagers (add more as you wish)
    const villagers = ref(
        [
            {id: 1, name: 'Ana', mood: 100},
            {id: 2, name: 'Mateo', mood: 90},
            {id: 3, name: 'Juliana', mood: 100},
            {id: 4, name: 'Luca', mood: 85},
            {id: 5, name: 'Carlos', mood: 95}
        ]
    )

    // Requests reference villagerId
    const requests = ref([
        {
            id: 1,
            villagerId: 1, // Ana
            requestedItems: ['Tomato', 'Eggs'],
            offer: 15,
            dueDate: 3
        },
        {
            id: 2,
            villagerId: 2,
            requestedItems: ['Milk', 'Lettuce', 'Corn'],
            offer: 22,
            dueDate: 4
        },
        {
            id: 3,
            villagerId: 3,
            requestedItems: ['Honey'],
            offer: 12,
            dueDate: 2
        },
        {
            id: 4,
            villagerId: 4,
            requestedItems: ['Pumpkin', 'Wool'],
            offer: 25,
            dueDate: 5
        },
        {
            id: 5,
            villagerId: 5,
            requestedItems: ['Coffee'],
            offer: 18,
            dueDate: 6
        }
    ])

    // Accepted orders reference villagerId
    const acceptedOrders = ref(
        [
            {
                id: 6,
                villagerId: 1,
                requestedItems: ['Tomato'],
                offer: 8,
                dueDate: 3
            },
            {
                id: 7,
                villagerId: 3,
                requestedItems: ['Honey'],
                offer: 12,
                dueDate: 2
            },
            {
                id: 8,
                villagerId: 2,
                requestedItems: ['Lettuce'],
                offer: 7,
                dueDate: 4
            }
        ]
    )
    const harvestedProducts = ref([])
    return {villagers, requests, acceptedOrders, harvestedProducts}
})
