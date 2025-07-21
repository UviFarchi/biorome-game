import { defineStore } from 'pinia'

export const marketStore = defineStore('market', {
  state: () => ({
    harvestedProducts: [
      { type: 'Tomato', qty: 20, icon: '🍅', shelfLife: 3 },
      { type: 'Milk', qty: 12, icon: '🥛', shelfLife: 2 }
    ],
    contracts: [
      {
        id: 'contract-1',
        productType: 'Wheat',
        quantity: 50,
        contractType: 'one-time',
        dueDate: '2025-09-21',
        pricePerUnit: 10,
        penalty: 20,
        status: 'offer',
        deliveries: []
      },
      {
        id: 'contract-2',
        productType: 'Milk',
        quantity: 2,
        contractType: 'recurring',
        startDay: 14,
        endDay: 60,
        interval: 7,
        pricePerUnit: 5,
        penalty: 10,
        status: 'offer',
        deliveries: [
          { day: 21, fulfilled: false, qtyDelivered: 0 }
        ]
      }
    ],
    openMarket: {
      prices: {
        Tomato: { buy: 8, sell: 6 },
        Milk: { buy: 10, sell: 7 }
      },
      lastUpdated: '2025-07-22'
    },
    marketNews: [
      { day: 15, message: 'Drought expected, grain prices may rise soon.' },
      { day: 18, message: 'New animal health regulations take effect.' }
    ]
  })
})
