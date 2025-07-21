import { defineStore } from 'pinia'
import { ref } from 'vue'
import { userStore } from './userStore.js'

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
  const user = userStore()

  function addNotification(msg) {
    notifications.value.push(msg)
    if (notifications.value.length > 10) notifications.value.shift()
  }

  function removeFromInventory(type, qty) {
    const item = harvestedProducts.value.find(p => p.type === type)
    if (!item || item.qty < qty) return false
    item.qty -= qty
    if (item.qty <= 0) {
      const idx = harvestedProducts.value.findIndex(p => p.type === type)
      harvestedProducts.value.splice(idx, 1)
    }
    return true
  }

  function fulfillContract(id) {
    const contract = contracts.value.find(c => c.id === id)
    if (!contract || contract.status !== 'pending') return
    if (!removeFromInventory(contract.productType, contract.quantity)) {
      addNotification('Not enough inventory to fulfill contract.')
      return
    }
    contract.status = 'completed'
    const earned = contract.quantity * contract.pricePerUnit
    user.gold += earned
    addNotification(`Fulfilled contract ${id} for ${earned} gold.`)
  }

  function sellToOpenMarket(id) {
    const offer = openMarketOffers.value.find(o => o.id === id)
    if (!offer || offer.status !== 'open') return
    if (!removeFromInventory(offer.productType, offer.quantity)) {
      addNotification('Not enough inventory to sell on offer.')
      return
    }
    offer.status = 'sold'
    const earned = offer.quantity * offer.pricePerUnit
    user.gold += earned
    addNotification(`Sold ${offer.quantity} ${offer.productType} for ${earned} gold.`)
  }

  function expireOffers(currentDate) {
    openMarketOffers.value.forEach(o => {
      if (o.status === 'open' && new Date(currentDate) > new Date(o.expiryDate)) {
        o.status = 'expired'
        addNotification(`Offer ${o.id} has expired.`)
      }
    })
  }

  return {
    contracts,
    openMarketOffers,
    harvestedProducts,
    notifications,
    fulfillContract,
    sellToOpenMarket,
    expireOffers,
    addNotification
  }
})
