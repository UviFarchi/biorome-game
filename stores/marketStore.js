import { defineStore } from 'pinia'
import { userStore } from './userStore.js'

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
  }),

  actions: {
    generateRandomContract() {
      const types = Object.keys(this.openMarket.prices)
      if (types.length === 0) return
      const id = `contract-${Date.now()}-${Math.floor(Math.random() * 1000)}`
      const productType = types[Math.floor(Math.random() * types.length)]
      const priceBase = this.openMarket.prices[productType].buy
      const pricePerUnit = priceBase + Math.ceil(Math.random() * 2)
      const penalty = priceBase * 2
      if (Math.random() < 0.5) {
        const quantity = Math.ceil(Math.random() * 50) + 10
        const due = new Date()
        due.setDate(due.getDate() + 30 + Math.ceil(Math.random() * 30))
        this.contracts.push({
          id,
          productType,
          quantity,
          contractType: 'one-time',
          dueDate: due.toISOString().slice(0, 10),
          pricePerUnit,
          penalty,
          status: 'offer',
          deliveries: []
        })
      } else {
        const quantity = Math.ceil(Math.random() * 3) + 1
        const startDay = Math.ceil(Math.random() * 10)
        const endDay = startDay + 30
        const interval = 3
        const deliveries = []
        for (let d = startDay; d <= endDay; d += interval) {
          deliveries.push({ day: d, fulfilled: false, qtyDelivered: 0 })
        }
        this.contracts.push({
          id,
          productType,
          quantity,
          contractType: 'recurring',
          startDay,
          endDay,
          interval,
          pricePerUnit,
          penalty,
          status: 'offer',
          deliveries
        })
      }
    },

    updateOpenMarketPrices() {
      Object.keys(this.openMarket.prices).forEach(type => {
        const price = this.openMarket.prices[type]
        const delta = Math.floor(Math.random() * 3) - 1
        const buy = Math.max(1, price.buy + delta)
        const sell = Math.max(1, buy - 2)
        this.openMarket.prices[type] = { buy, sell }
      })
      this.openMarket.lastUpdated = new Date().toISOString().slice(0, 10)
    },

    acceptContract(id) {
      const contract = this.contracts.find(c => c.id === id)
      if (contract && contract.status === 'offer') {
        contract.status = 'active'
      }
    },

    fulfillContract(id, qty, day = 0) {
      const contract = this.contracts.find(c => c.id === id)
      if (!contract || contract.status !== 'active') return
      const item = this.harvestedProducts.find(p => p.type === contract.productType)
      if (!item || item.qty < qty) return
      const user = userStore()
      if (contract.contractType === 'one-time') {
        if (qty < contract.quantity) return
        item.qty -= qty
        if (item.qty <= 0) this.harvestedProducts = this.harvestedProducts.filter(p => p.qty > 0)
        user.gold += qty * contract.pricePerUnit
        contract.status = 'fulfilled'
      } else {
        const delivery = contract.deliveries.find(d => d.day === day)
        if (!delivery || delivery.fulfilled || qty < contract.quantity) return
        item.qty -= qty
        if (item.qty <= 0) this.harvestedProducts = this.harvestedProducts.filter(p => p.qty > 0)
        user.gold += qty * contract.pricePerUnit
        delivery.fulfilled = true
        delivery.qtyDelivered = qty
        if (contract.deliveries.every(d => d.fulfilled)) {
          contract.status = 'fulfilled'
        }
      }
    },

    sellProduct(type, qty) {
      const item = this.harvestedProducts.find(p => p.type === type)
      if (!item || item.qty < qty) return
      const price = this.openMarket.prices[type]?.sell || 1
      item.qty -= qty
      if (item.qty <= 0) this.harvestedProducts = this.harvestedProducts.filter(p => p.qty > 0)
      const user = userStore()
      user.gold += qty * price
    },

    applyPenalty(id, amount) {
      const contract = this.contracts.find(c => c.id === id)
      if (!contract) return
      const user = userStore()
      user.gold = Math.max(0, user.gold - amount)
      contract.status = 'failed'
    }
  }
})
