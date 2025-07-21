<script setup>
import { computed } from 'vue'
import { marketStore } from '/stores/marketStore.js'
import { userStore } from '/stores/userStore.js'

const market = marketStore()
const user = userStore()

const activeContracts = computed(() =>
  market.contracts.filter(c => c.status === 'pending').sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
)
const openOffers = computed(() =>
  market.openMarketOffers.filter(o => o.status === 'open').sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate))
)
const latestNotifications = computed(() => market.notifications.slice(-5).reverse())

function addNotification(msg) {
  market.notifications.push(msg)
  if (market.notifications.length > 10) market.notifications.shift()
}

function removeFromInventory(type, qty) {
  const item = market.harvestedProducts.find(p => p.type === type)
  if (!item || item.qty < qty) return false
  item.qty -= qty
  if (item.qty <= 0) {
    const idx = market.harvestedProducts.findIndex(p => p.type === type)
    market.harvestedProducts.splice(idx, 1)
  }
  return true
}

function canFulfill(contract) {
  const item = market.harvestedProducts.find(p => p.type === contract.productType)
  return item && item.qty >= contract.quantity && contract.status === 'pending'
}

function canSell(offer) {
  const item = market.harvestedProducts.find(p => p.type === offer.productType)
  return item && item.qty >= offer.quantity && offer.status === 'open'
}

function fulfillContract(id) {
  const contract = market.contracts.find(c => c.id === id)
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
  const offer = market.openMarketOffers.find(o => o.id === id)
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

function deliver(id) {
  fulfillContract(id)
}

function sell(id) {
  sellToOpenMarket(id)
}
</script>

<template>
  <div class="market-area">
    <h1>Market</h1>
    <section class="contracts">
      <h2>Active Contracts</h2>
      <div v-if="activeContracts.length">
        <div v-for="c in activeContracts" :key="c.id" class="contract-item">
          <div>{{ c.productType }} - {{ c.quantity }} @ {{ c.pricePerUnit }}</div>
          <div>Due: {{ new Date(c.dueDate).toLocaleDateString() }}</div>
          <div>Status: {{ c.status }}</div>
          <button @click="deliver(c.id)" :disabled="!canFulfill(c)">Deliver</button>
        </div>
      </div>
      <p v-else>No active contracts.</p>
    </section>

    <section class="offers">
      <h2>Open Market Offers</h2>
      <div v-if="openOffers.length">
        <div v-for="o in openOffers" :key="o.id" class="offer-item">
          <div>{{ o.productType }} - {{ o.quantity }} @ {{ o.pricePerUnit }}</div>
          <div>Expires: {{ new Date(o.expiryDate).toLocaleDateString() }}</div>
          <button @click="sell(o.id)" :disabled="!canSell(o)">Sell</button>
        </div>
      </div>
      <p v-else>No open offers.</p>
    </section>

    <section class="inventory">
      <h2>Harvested Products</h2>
      <ul>
        <li v-for="p in market.harvestedProducts" :key="p.type">
          {{ p.type }} - {{ p.qty }} (shelf {{ p.shelfLife }})
        </li>
      </ul>
    </section>

    <section class="notifications">
      <h2>Notifications</h2>
      <ul>
        <li v-for="(n, i) in latestNotifications" :key="i">{{ n }}</li>
      </ul>
    </section>

    <div class="gold">Gold: {{ user.gold }}</div>
  </div>
</template>

<style scoped>
.market-area {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
}
.contract-item,
.offer-item {
  border-bottom: 1px solid #ccc;
  padding: 0.5rem 0;
}
.gold {
  margin-top: 1rem;
  font-weight: bold;
}
</style>
