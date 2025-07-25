import { defineStore } from 'pinia'
import { ref } from 'vue'

export const marketStore = defineStore('market', () => {
  // Contracts for fulfillment
  const contracts = ref([
    // Example data; should be generated dynamically
    {
      id: 'contract-1',
      productType: 'Wheat',
      quantity: 20,
      dueDate: '2025-08-01',
      pricePerUnit: 5,
      status: 'pending',
      type: 'one-off',
      interval: 0,
      penalty: 20
    },
    {
      id: 'contract-2',
      productType: 'Milk',
      quantity: 10,
      dueDate: '2025-08-05',
      pricePerUnit: 4,
      status: 'pending',
      type: 'one-off',
      interval: 0,
      penalty: 10
    }
  ])

  // Offers the player can fulfill for instant sale
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

  // The player's on-hand inventory
  const harvestedProducts = ref([

    // Should be kept in sync with actual game state/inventory logic
    { type: 'tomato', qty: 10, icon: '🍅', shelfLife: 3 },
    { type: 'milk', qty: 15, icon: '🥛', shelfLife: 2 }
  ])

  // Recent notifications to display in market UI
  const notifications = ref([])

  // The buyable product list is derived in the component; store only special-cases if any
  // e.g., a special supply like Animal Feed always in stock
  const extraBuyables = ref([
    { type: 'Animal Feed', basePrice: 2, icon: '🍽️', shelfLife: 30 }
  ])

  return {
    contracts,
    openMarketOffers,
    harvestedProducts,
    notifications,
    extraBuyables // Components merge this with plant/animal products for full buy list
  }
})
