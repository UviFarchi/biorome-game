<script setup>
import { computed, onMounted, ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { marketStore } from '/stores/marketStore.js'
import { animalsStore } from '/stores/animalsStore.js'
import { plantsStore } from '/stores/plantsStore.js'
import { gameStateStore } from '/stores/gameStateStore.js'
import eventBus from '@/eventBus.js'

const market = marketStore()

const animals = animalsStore()
const plants = plantsStore()
const gameState = gameStateStore()

const activeContracts = computed(() =>
  market.contracts.filter(c => c.status === 'pending').sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
)
const offeredContracts = computed(() =>
  market.contracts.filter(c => c.status === 'offered').sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
)
const openOffers = computed(() =>
  market.openMarketOffers.filter(o => o.status === 'open').sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate))
)
const filterType = ref('all')
const productTypes = computed(() => Array.from(new Set([
  ...market.contracts.map(c => c.productType),
  ...market.openMarketOffers.map(o => o.productType)
])))

const filteredActiveContracts = computed(() =>
  activeContracts.value.filter(c => filterType.value === 'all' || c.productType === filterType.value)
)
const filteredOfferedContracts = computed(() =>
  offeredContracts.value.filter(c => filterType.value === 'all' || c.productType === filterType.value)
)
const filteredOpenOffers = computed(() =>
  openOffers.value.filter(o => filterType.value === 'all' || o.productType === filterType.value)
)
const latestNotifications = computed(() => market.notifications.slice(-5).reverse())
const newsForToday = computed(() =>
  gameState.newsFeed.filter(n => n.day === gameState.day)
)

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

function getPriceModifier(productType) {
  return newsForToday.value.reduce((mult, n) => {
    if (n.effect && n.effect.affectedTypes && n.effect.affectedTypes.includes(productType)) {
      return mult * (n.effect.priceModifier || 1)
    }
    return mult
  }, 1)
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

function isContractExpired(contract) {
  return new Date(contract.dueDate) < new Date()
}

function isOfferExpired(offer) {
  return new Date(offer.expiryDate) < new Date()
}

function canFulfillContract(contract) {
  const item = market.harvestedProducts.find(p => p.type === contract.productType)
  return item && item.qty >= contract.quantity && contract.status === 'pending' && !isContractExpired(contract)
}

function canSellOffer(offer) {
  const item = market.harvestedProducts.find(p => p.type === offer.productType)
  return item && item.qty >= offer.quantity && offer.status === 'open' && !isOfferExpired(offer)
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
  if (isContractExpired(contract)) {
    contract.status = 'expired'
    addNotification('Contract has expired and cannot be fulfilled.')
    return
  }
  if (!removeFromInventory(contract.productType, contract.quantity)) {
    addNotification('Not enough inventory to fulfill contract.')
    return
  }
  const mod = getPriceModifier(contract.productType)
  const earned = contract.quantity * contract.pricePerUnit * mod
  gameState.gold += earned
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
  if (isOfferExpired(offer)) {
    offer.status = 'expired'
    addNotification('Offer has expired and cannot be sold.')
    return
  }
  if (!removeFromInventory(offer.productType, offer.quantity)) {
    addNotification('Not enough inventory to sell on offer.')
    return
  }
  const mod = getPriceModifier(offer.productType)
  const earned = offer.quantity * offer.pricePerUnit * mod
  gameState.gold += earned
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
    <div class="news-ticker" aria-label="News ticker">
      <div v-if="newsForToday.length" :class="{ animate: newsForToday.length > 1 }" class="ticker-inner">
        <span v-for="n in newsForToday" :key="n.id" :class="['news-item', n.type]">{{ n.headline }}</span>
      </div>
      <div v-else class="ticker-inner">No news today.</div>
    </div>
    <button class="return-btn" @click="eventBus.emit('nav', 'main')">Back to Map</button>
    <h1>Market</h1>
    <div class="filter-row">
      <label>Filter:</label>
      <select v-model="filterType">
        <option value="all">All</option>
        <option v-for="t in productTypes" :key="t" :value="t">{{ t }}</option>
      </select>
    </div>
    <div class="lists">
      <section class="contracts">
        <h2>Contracts</h2>
        <div class="sub-list" v-if="filteredOfferedContracts.length">
          <h3>Offered</h3>
          <div v-for="c in filteredOfferedContracts" :key="c.id" class="contract-item">
            <div class="row"><span class="type">{{ c.productType }}</span> x{{ c.quantity }} @ {{ c.pricePerUnit }}</div>
            <div class="row">Due: {{ new Date(c.dueDate).toLocaleDateString() }}</div>
            <div class="row">Penalty: {{ c.penalty }}</div>
            <button @click="accept(c.id)">Accept</button>
          </div>
        </div>
        <p v-else>No contract offers.</p>

        <div class="sub-list" v-if="filteredActiveContracts.length">
          <h3>Active</h3>
          <div v-for="c in filteredActiveContracts" :key="c.id" class="contract-item">
            <div class="row"><span class="type">{{ c.productType }}</span> x{{ c.quantity }} @ {{ c.pricePerUnit }}</div>
            <div class="row">Due: {{ new Date(c.dueDate).toLocaleDateString() }}</div>
            <div class="row">Penalty: {{ c.penalty }}</div>
            <div class="row">Status: {{ isContractExpired(c) ? 'Expired' : c.status }}</div>
            <button @click="deliver(c.id)" :disabled="!canFulfill(c)">Deliver</button>
          </div>
        </div>
        <p v-else>No active contracts.</p>
      </section>

      <section class="offers">
        <h2>Open Offers</h2>
        <div class="sub-list" v-if="filteredOpenOffers.length">
          <div v-for="o in filteredOpenOffers" :key="o.id" class="offer-item">
            <div class="row"><span class="type">{{ o.productType }}</span> x{{ o.quantity }} @ {{ o.pricePerUnit }}</div>
            <div class="row">Expires: {{ new Date(o.expiryDate).toLocaleDateString() }}</div>
            <div class="row">Status: {{ isOfferExpired(o) ? 'Expired' : o.status }}</div>
            <button @click="sell(o.id)" :disabled="!canSell(o)">Sell</button>
          </div>
        </div>
        <p v-else>No open offers.</p>
      </section>
    </div>

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

    <div class="gold">Gold: {{ gameState.gold }}</div>
  </div>
</template>

<style scoped>
.market-area {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
}
.filter-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.lists {
  display: flex;
  gap: 1rem;
  max-height: 40vh;
  overflow-y: auto;
}
.contracts, .offers {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.sub-list {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  border-bottom: 1px solid #ccc;
  padding-bottom: 0.3rem;
}
.contract-item,
.offer-item {
  border-bottom: 1px solid #ccc;
  padding: 0.5rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}
.row {
  display: flex;
  justify-content: space-between;
}
.type {
  font-weight: bold;
}
.gold {
  margin-top: 1rem;
  font-weight: bold;
}

.news-ticker {
  overflow: hidden;
  white-space: nowrap;
  border: 1px solid #ccc;
  margin-bottom: 0.5rem;
}
.ticker-inner {
  display: inline-block;
}
.ticker-inner.animate {
  animation: scroll 15s linear infinite;
  padding-left: 100%;
}
.news-item {
  padding: 0 1em;
  margin-right: 0.5em;
  display: inline-block;
}
.news-item.market {
  background: #fff176;
  color: #333;
}
.news-item.weather {
  background: #90caf9;
  color: #333;
}
.return-btn {
  align-self: flex-end;
  margin-bottom: 0.5rem;
  font-weight: bold;
  padding: 0.4em 1em;
  background: #80deea;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.return-btn:hover {
  background: #26c6da;
  color: #fff;
}

@keyframes scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-100%); }
}
</style>
