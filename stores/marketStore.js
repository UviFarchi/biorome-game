import { defineStore } from 'pinia'
console.log('marketStore loaded!', Math.random())

export const marketStore = defineStore('market', {
  state: () => ({
    // Master list of villagers (add more as you wish)
    villagers: [
      { id: 1, name: 'Ana', mood: 100 },
      { id: 2, name: 'Mateo', mood: 90 },
      { id: 3, name: 'Juliana', mood: 100 },
      { id: 4, name: 'Luca', mood: 85 },
      { id: 5, name: 'Carlos', mood: 95 }
    ],
    // Requests reference villagerId
    requests: [
      {
        id: 'req-1',
        villagerId: '1',
        productType: 'Tomato',
        quantity: 5,
        dueDate: 3,
        pricePerUnit: 3,
        accepted: false,
        fulfilled: false
      },
      {
        id: 'req-2',
        villagerId: '2',
        productType: 'Milk',
        quantity: 10,
        dueDate: 4,
        pricePerUnit: 4,
        accepted: false,
        fulfilled: false
      },
      {
        id: 'req-3',
        villagerId: '3',
        productType: 'Honey',
        quantity: 2,
        dueDate: 2,
        pricePerUnit: 6,
        accepted: false,
        fulfilled: false
      }
    ],
    // Accepted orders reference villagerId
    acceptedOrders: [
      {
        id: 'req-4',
        villagerId: '1',
        productType: 'Cow',
        quantity: 1,
        dueDate:1,
        pricePerUnit: 200,
        accepted: true,
        fulfilled: false
      }
    ],
    // History arrays for statistics
    fulfilledOrders: [],
    failedOrders: [],
    harvestedProducts: []
  })
})
