<script setup>
import { computed, watch } from 'vue'
import eventBus from "@/eventBus.js"
import { marketStore } from '/stores/marketStore.js'
import { userStore } from '/stores/userStore.js'
import { gameStateStore } from '/stores/gameStateStore.js'
import { plantsStore } from '/stores/plantsStore.js'
import { animalsStore } from '/stores/animalsStore.js'

const market = marketStore()
const user = userStore()
const game = gameStateStore()
const plants = plantsStore()
const animals = animalsStore()

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

const inventoryDisplay = computed(() =>
  market.harvestedProducts.map(p => ({
    ...p,
    shelfLife: getShelfLife(p.type)
  }))
)

function acceptRequest(req) {
  const idx = market.requests.findIndex(r => r.id === req.id)
  if (idx !== -1) {
    const order = { ...market.requests[idx], accepted: true }
    market.requests.splice(idx, 1)
    market.acceptedOrders.push(order)
  }
}

function canFulfill(order) {
  if (order.dueDate !== game.day + 1) return false
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
}

function checkExpired() {
  const today = game.day + 1
  const expired = market.acceptedOrders.filter(o => o.dueDate < today)
  expired.forEach(o => {
    const idx = market.acceptedOrders.findIndex(a => a.id === o.id)
    if (idx !== -1) market.acceptedOrders.splice(idx, 1)
    const villager = market.villagers.find(v => v.id === o.villagerId)
    if (villager) villager.mood = Math.max(0, villager.mood - 10)
    market.failedOrders.push({ ...o })
  })
}

watch(() => game.day, checkExpired, { immediate: true })
</script>

<template>
  <div class="market-area-main">
    <h1>Market Area</h1>

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
              <button :disabled="!canFulfill(order)" @click="fulfillOrder(order)">Fulfill</button>
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
</style>