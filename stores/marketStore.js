import { defineStore } from 'pinia'
import { ref } from 'vue'
export const marketStore = defineStore('market', () => {
  const contracts = ref([
    {
      id: 'contract-1',
      productType: 'Wheat',
      quantity: 20,
      dueDate: '2025-08-01',
      pricePerUnit: 5,
      status: 'pending',
      type: 'one-off'
    },
    {
      id: 'contract-2',
      productType: 'Milk',
      quantity: 10,
      dueDate: '2025-08-05',
      pricePerUnit: 4,
      status: 'pending',
      type: 'one-off'
    }
  ])

  const openMarketOffers = ref([
    {
      id: 'offer-1',
      productType: 'Tomato',
      quantity: 5,
      pricePerUnit: 7,
      expiryDate: '2025-07-30',
      status: 'open'
    }
  ])

  const harvestedProducts = ref([
    { type: 'Tomato', qty: 10, icon: '🍅', shelfLife: 3 },
    { type: 'Milk', qty: 15, icon: '🥛', shelfLife: 2 }
  ])

  const notifications = ref([])
  return {
    contracts,
    openMarketOffers,
    harvestedProducts,
    notifications
  }
})
