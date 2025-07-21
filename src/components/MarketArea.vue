<script setup>
import { computed, watch } from 'vue'
import eventBus from "@/eventBus.js"
import { marketStore } from '/stores/marketStore.js'
import { userStore } from '/stores/userStore.js'
import { gameStateStore } from '/stores/gameStateStore.js'
import { plantsStore } from '/stores/plantsStore.js'
import { animalsStore } from '/stores/animalsStore.js'
import { ref, nextTick } from 'vue'

const goldChange = ref(null)
const goldAnimPos = ref({ x: 0, y: 0 })
const market = marketStore()
const user = userStore()
const game = gameStateStore()
const plants = plantsStore()
const animals = animalsStore()


function animateGoldChange(amount, event) {
  goldChange.value = `+${amount}`
  if (event && event.target) {
    const btnRect = event.target.getBoundingClientRect()
    goldAnimPos.value = {
      x: btnRect.left + btnRect.width / 2,
      y: btnRect.top
    }
  } else {
    goldAnimPos.value = { x: 100, y: 100 } // fallback
  }
  setTimeout(() => {
    goldChange.value = null
  }, 5000)
}
function formatDate(dayOffset) {
  const start = new Date(game.startDate)
  const d = new Date(start)
  d.setDate(d.getDate() + (dayOffset - 1))
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const requestsDisplay = computed(() =>
  market.requests.map(r => ({
    ...r,
    dueDateString: formatDate(r.dueDate),
    daysLeft: r.dueDate - (game.day + 1)
  }))
)

const acceptedDisplay = computed(() =>
  market.acceptedOrders.map(o => ({
    ...o,
    dueDateString: formatDate(o.dueDate),
    daysLeft: o.dueDate - (game.day + 1)
  }))
)

function getShelfLife(type) {
  const plant = plants.plantTypes.find(p => p.type === type)
  if (plant) return plant.shelfLife
  const prod = animals.products.find(p => p.key === type)
  if (prod) return prod.shelfLife
  return 0
}

function getBasePrice(type) {
  const plant = plants.plantTypes.find(p => p.type === type)
  if (plant) return plant.basePrice
  const prod = animals.products.find(p => p.key === type)
  if (prod) return prod.basePrice
  const animal = animals.animalTypes.find(a => a.type === type)
  if (animal) return animal.basePrice
  return 1
}

function priceForProduct(type, villager) {
  const base = getBasePrice(type)
  const supply = market.harvestedProducts.find(p => p.type === type)?.qty || 0
  const demand = [...market.requests, ...market.acceptedOrders].filter(r => r.productType === type)
      .reduce((s, r) => s + r.quantity, 0)
  const supplyDemandAdj = (demand - supply) * 0.1
  const moodAdj = ((villager.mood - 50) / 50) * 0.5
  const variance = (Math.random() - 0.5) * base * 0.2
  return Math.max(1, Math.round(base + supplyDemandAdj + base * moodAdj + variance))
}

const marketableProducts = [

  ...plants.plantTypes
      .filter(p => !['Grass'].includes(p.type)) // blacklist approach
      .map(p => p.type),
  ...animals.products
      .filter(p => !['Manure'].includes(p.key)) // adjust as needed
      .map(p => p.key),
  ...animals.animalTypes
      .filter(a => !['Bee'].includes(a.type)) // adjust for animal sales
      .map(a => a.type),
]
function generateDailyRequest() {
  const villager = market.villagers[Math.floor(Math.random() * market.villagers.length)]
  if (marketableProducts.length === 0) return // nothing marketable
  const productType = marketableProducts[Math.floor(Math.random() * marketableProducts.length)]
  const quantity = Math.ceil(Math.random() * 5)
  const dueDate = game.day + 1 + Math.ceil(Math.random() * 3)
  const pricePerUnit = priceForProduct(productType, villager)
  market.requests.push({
    id: `req-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    villagerId: villager.id,
    productType,
    quantity,
    dueDate,
    pricePerUnit,
    accepted: false,
    fulfilled: false
  })
}




const inventoryDisplay = computed(() =>
  market.harvestedProducts.map(p => ({
    ...p,
    shelfLife: p.remainingLife ?? getShelfLife(p.type)
  }))
)

function acceptRequest(req) {
  const idx = market.requests.findIndex(r => r.id === req.id)
  if (idx !== -1) {
    const order = { ...market.requests[idx], accepted: true }
    market.requests.splice(idx, 1)
    market.acceptedOrders.push(order)
    const villager = market.villagers.find(v => v.id === req.villagerId)
    if (villager) villager.mood = Math.min(100, villager.mood + 2)
  }
}

function canFulfill(order) {
  if (order.dueDate < game.day + 1) return false // Order expired
  if (order.dueDate > game.day + 1) return false // Not yet due
  const item = market.harvestedProducts.find(p => p.type === order.productType)
  return item && item.qty >= order.quantity
}

function fulfillOrder(order) {
  if (!canFulfill(order)) {
    alert('Not enough inventory to fulfill this order.')
    return
  }
  const item = market.harvestedProducts.find(p => p.type === order.productType)
  item.qty -= order.quantity
  if (item.qty <= 0) {
    const i = market.harvestedProducts.indexOf(item)
    market.harvestedProducts.splice(i, 1)
  }
  user.gold += order.quantity * order.pricePerUnit
  const idx = market.acceptedOrders.findIndex(o => o.id === order.id)
  if (idx !== -1) market.acceptedOrders.splice(idx, 1)
  market.fulfilledOrders.push({ ...order, fulfilled: true })
  const villager = market.villagers.find(v => v.id === order.villagerId)
  if (villager) villager.mood = Math.min(100, villager.mood + 5)
}

function checkExpired() {
  const today = game.day + 1
  const expired = market.acceptedOrders.filter(o => o.dueDate < today)
  expired.forEach(o => {
    const idx = market.acceptedOrders.findIndex(a => a.id === o.id)
    if (idx !== -1) market.acceptedOrders.splice(idx, 1)
    const villager = market.villagers.find(v => v.id === o.villagerId)
    if (villager) villager.mood = Math.max(0, villager.mood - 10)
    user.gold = Math.max(0, user.gold - o.quantity)
    market.failedOrders.push({ ...o })
  })
}

let firstRun = true
watch(
  () => game.day,
  () => {
    checkExpired()
    if (!firstRun) generateDailyRequest()
    firstRun = false
  },
  { immediate: true }
)

</script>

<template>
  <div class="market-area-main">
    <h1>Market Area</h1>
    <span class="gold-counter">Gold: {{user.gold}}</span>
    <span
        v-if="goldChange"
        class="gold-float"
        :style="{
    left: goldAnimPos.x + 'px',
    top: goldAnimPos.y + 'px'
  }"
    >
  {{ goldChange }}💰
</span>
    <section class="section">
      <h2>Villager Requests</h2>
      <table class="orders-table" v-if="requestsDisplay.length">
        <thead>
          <tr>
            <th>Product</th>
            <th>Qty</th>
            <th>Due Date</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="req in requestsDisplay" :key="req.id" :class="{ soon: req.daysLeft <= 1 }">
            <td>{{ req.productType }}</td>
            <td>{{ req.quantity }}</td>
            <td>{{ req.dueDateString }}</td>
            <td>{{ req.pricePerUnit }}</td>
            <td>
              <button @click="acceptRequest(req)">Accept</button>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-else class="empty">No requests</p>
    </section>

    <section class="section">
      <h2>Accepted Orders</h2>
      <table class="orders-table" v-if="acceptedDisplay.length">
        <thead>
          <tr>
            <th>Product</th>
            <th>Qty</th>
            <th>Due Date</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in acceptedDisplay" :key="order.id" :class="{ soon: order.daysLeft <= 1 }">
            <td>{{ order.productType }}</td>
            <td>{{ order.quantity }}</td>
            <td>{{ order.dueDateString }}</td>
            <td>{{ order.pricePerUnit }}</td>
            <td>
              <button :disabled="!canFulfill(order)" @click="e => { fulfillOrder(order); animateGoldChange(order.quantity * order.pricePerUnit, e) }">
                Fulfill
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-else class="empty">No accepted orders</p>
    </section>

    <section class="section">
      <h2>Inventory</h2>
      <table class="orders-table" v-if="inventoryDisplay.length">
        <thead>
          <tr>
            <th>Product</th>
            <th>Qty</th>
            <th>Shelf Life</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in inventoryDisplay" :key="item.type" :class="{ soon: item.shelfLife <= 3 }">
            <td>{{ item.type }}</td>
            <td>{{ item.qty }}</td>
            <td>{{ item.shelfLife }}</td>
          </tr>
        </tbody>
      </table>
      <p v-else class="empty">Inventory empty</p>
    </section>

    <button class="return-btn" @click="eventBus.emit('nav', 'main')">Return to Map</button>
  </div>
</template>

<style scoped>
.market-area-main {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 1em;
  overflow-y: auto;
}

.return-btn {
  margin-top: 1.5em;
  padding: 0.4em 1.2em;
  border-radius: 8px;
  border: none;
  background: #80deea;
  font-weight: bold;
  cursor: pointer;
}

.return-btn:hover {
  background: #00bcd4;
  color: #fff;}

.section {
  margin-bottom: 1.5em;
  width: 80%;
}

.orders-table {
  width: 100%;
  border-collapse: collapse;
}

.orders-table th,
.orders-table td {
  border: 1px solid #ccc;
  padding: 0.4em 0.6em;
  text-align: center;
}

.soon {
  background: #fff3cd;
}

.empty {
  font-style: italic;
  color: #666;
}

.gold-counter {
  display: inline-block;
  background: #fffde7;
  border: 2px solid #ffd600;
  border-radius: 9px;
  padding: 0.4em 1.1em;
  font-size: 1.13em;
  margin: 0.4em 0 1.3em 0;
}

.gold-float {
  position: fixed;
  z-index: 2000;
  font-size: 1.45em;
  color: #ffd600;
  font-weight: bold;
  pointer-events: none;
  animation: goldFloat 5s cubic-bezier(.34,1.56,.64,1) forwards;
  text-shadow: 0 1px 4px #2224;
}

@keyframes goldFloat {
  from { opacity: 1; transform: translateY(0);}
  to { opacity: 0; transform: translateY(-60px) scale(1.25);}
}

</style>