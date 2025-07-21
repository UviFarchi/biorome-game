<script setup>
import { computed, onMounted } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { marketStore } from '/stores/marketStore.js'
import { userStore } from '/stores/userStore.js'
import { animalsStore } from '/stores/animalsStore.js'
import { plantsStore } from '/stores/plantsStore.js'

const market = marketStore()
const user = userStore()
const animals = animalsStore()
const plants = plantsStore()

const activeContracts = computed(() =>
  market.contracts.filter(c => c.status === 'pending').sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
)
const offeredContracts = computed(() =>
  market.contracts.filter(c => c.status === 'offered').sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
)
const openOffers = computed(() =>
  market.openMarketOffers.filter(o => o.status === 'open').sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate))
)
const latestNotifications = computed(() => market.notifications.slice(-5).reverse())

function addNotification(msg) {
  market.notifications.push(msg)
  if (market.notifications.length > 10) market.notifications.shift()
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function availableProducts() {
  return [
    ...plants.plantTypes.map(p => ({ type: p.type, basePrice: p.basePrice })),
    ...animals.products.map(p => ({ type: p.key, basePrice: p.basePrice }))
  ]
}

function generateRandomContract() {
  const prod = randomItem(availableProducts())
  const quantity = randomInt(5, 20)
  const pricePerUnit = Math.round(prod.basePrice * randomInt(100, 300) / 100)
  const interval = randomInt(3, 7)
  const due = new Date()
  due.setDate(due.getDate() + interval)
  const recurring = Math.random() < 0.3
  market.contracts.push({
    id: uuidv4(),
    productType: prod.type,
    quantity,
    dueDate: due.toISOString().slice(0, 10),
    pricePerUnit,
    status: 'offered',
    type: recurring ? 'recurring' : 'one-off',
    interval,
    penalty: Math.round(pricePerUnit * quantity * 0.2)
  })
  addNotification(`New contract offer for ${quantity} ${prod.type}`)
}

function generateRandomOffer() {
  const prod = randomItem(availableProducts())
  const quantity = randomInt(1, 15)
  const pricePerUnit = Math.round(prod.basePrice * randomInt(80, 120) / 100)
  const expiresIn = randomInt(1, 4)
  const exp = new Date()
  exp.setDate(exp.getDate() + expiresIn)
  market.openMarketOffers.push({
    id: uuidv4(),
    productType: prod.type,
    quantity,
    pricePerUnit,
    expiryDate: exp.toISOString().slice(0, 10),
    status: 'open'
  })
  addNotification(`New open market offer for ${quantity} ${prod.type}`)
}

function generateDailyOffers(numContracts = 1, numOffers = 1) {
  for (let i = 0; i < numContracts; i++) generateRandomContract()
  for (let i = 0; i < numOffers; i++) generateRandomOffer()
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

function canFulfillContract(contract) {
  const item = market.harvestedProducts.find(p => p.type === contract.productType)
  return item && item.qty >= contract.quantity && contract.status === 'pending'
}

function canSellOffer(offer) {
  const item = market.harvestedProducts.find(p => p.type === offer.productType)
  return item && item.qty >= offer.quantity && offer.status === 'open'
}

function acceptContract(id) {
  const contract = market.contracts.find(c => c.id === id && c.status === 'offered')
  if (contract) {
    contract.status = 'pending'
    addNotification(`Accepted contract for ${contract.quantity} ${contract.productType}`)
  }
}

function fulfillContract(id) {
  const contract = market.contracts.find(c => c.id === id && c.status === 'pending')
  if (!contract) return
  if (!removeFromInventory(contract.productType, contract.quantity)) {
    addNotification('Not enough inventory to fulfill contract.')
    return
  }
  const earned = contract.quantity * contract.pricePerUnit
  user.gold += earned
  addNotification(`Fulfilled contract for ${earned} gold.`)
  if (contract.type === 'recurring') {
    const next = new Date(contract.dueDate)
    next.setDate(next.getDate() + contract.interval)
    contract.dueDate = next.toISOString().slice(0, 10)
    contract.quantity = randomInt(Math.max(1, contract.quantity - 5), contract.quantity + 5)
    contract.status = 'pending'
  } else {
    contract.status = 'completed'
  }
}

function sellToOpenMarket(id) {
  const offer = market.openMarketOffers.find(o => o.id === id && o.status === 'open')
  if (!offer) return
  if (!removeFromInventory(offer.productType, offer.quantity)) {
    addNotification('Not enough inventory to sell on offer.')
    return
  }
  const earned = offer.quantity * offer.pricePerUnit
  user.gold += earned
  offer.status = 'sold'
  addNotification(`Sold ${offer.quantity} ${offer.productType} for ${earned} gold.`)
}

onMounted(() => {
  generateDailyOffers()
})

function deliver(id) {
  fulfillContract(id)
}

function sell(id) {
  sellToOpenMarket(id)
}

function accept(id) {
  acceptContract(id)
}

function canFulfill(c) {
  return canFulfillContract(c)
}

function canSell(o) {
  return canSellOffer(o)
}
</script>

<template>
  <div class="market-area">
    <h1>Market</h1>
    <section class="contracts">
      <h2>Available Contracts</h2>
      <div v-if="offeredContracts.length">
        <div v-for="c in offeredContracts" :key="c.id" class="contract-item">
          <div>{{ c.productType }} - {{ c.quantity }} @ {{ c.pricePerUnit }}</div>
          <div>Due: {{ new Date(c.dueDate).toLocaleDateString() }}</div>
          <button @click="accept(c.id)">Accept</button>
        </div>
      </div>
      <p v-else>No available contracts.</p>

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
