<script setup>
import { computed, ref, reactive } from 'vue'
import { marketStore } from '/stores/marketStore.js'
import { userStore } from '/stores/userStore.js'
import { gameStateStore } from '/stores/gameStateStore.js'
import eventBus from '@/eventBus.js'

const market = marketStore()
const user = userStore()
const game = gameStateStore()

const startDate = ref(new Date(game.startDate))
const dayNum = computed(() => (game.day ?? 0) + 1)

const displayDate = computed(() => {
  const d = new Date(startDate.value)
  d.setDate(d.getDate() + (dayNum.value - 1))
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
})

const offerContracts = computed(() => market.contracts.filter(c => c.status === 'offer'))
const activeContracts = computed(() => market.contracts.filter(c => c.status === 'active'))
const historyContracts = computed(() => market.contracts.filter(c => c.status === 'fulfilled' || c.status === 'failed'))

const sellAmounts = reactive({})

function sell(type) {
  const qty = Number(sellAmounts[type] || 0)
  if (!qty) return
  market.sellProduct(type, qty)
  sellAmounts[type] = 0
}

function acceptContract(id) {
  market.acceptContract(id)
}

function fulfillOneTime(contract) {
  market.fulfillContract(contract.id, contract.quantity)
}

function fulfillRecurring(contract, day) {
  market.fulfillContract(contract.id, contract.quantity, day)
}

function hasInventory(type, qty) {
  const item = market.harvestedProducts.find(p => p.type === type)
  return item && item.qty >= qty
}

function dueDayFromDate(dateStr) {
  const start = new Date(game.startDate)
  const due = new Date(dateStr)
  return Math.floor((due - start) / 86400000) + 1
}

function formatDay(dayNumber) {
  const d = new Date(startDate.value)
  d.setDate(d.getDate() + (dayNumber - 1))
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function nextDay() {
  game.day += 1
  applyPenalties()
}

function applyPenalties() {
  const current = dayNum.value
  market.contracts.forEach(c => {
    if (c.status !== 'active') return
    if (c.contractType === 'one-time') {
      const dueDay = dueDayFromDate(c.dueDate)
      if (current > dueDay) {
        market.applyPenalty(c.id, c.penalty)
      }
    } else {
      const missed = c.deliveries.some(d => !d.fulfilled && current > d.day)
      if (missed) {
        market.applyPenalty(c.id, c.penalty)
      }
    }
  })
}

const latestNews = computed(() => market.marketNews.slice(-3).reverse())
</script>

<template>
  <div class="market-area">
    <div class="top-bar">
      <button class="return-btn" @click="eventBus.emit('nav', 'main')">Return to Map</button>
      <div class="stats">
        <span class="gold">💰{{ user.gold }}</span>
        <span class="date">📅{{ displayDate }}</span>
        <button class="next-day" @click="nextDay">Next Day</button>
      </div>
    </div>

    <section class="contracts">
      <h2>Contract Offers</h2>
      <div v-if="offerContracts.length">
        <div v-for="c in offerContracts" :key="c.id" class="contract-row">
          <div class="info">
            <div>{{ c.productType }} x{{ c.quantity }} @ {{ c.pricePerUnit }} each</div>
            <div v-if="c.contractType === 'one-time'">
              Due: {{ new Date(c.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }}
            </div>
            <div v-else>
              Recurring every {{ c.interval }} days from day {{ c.startDay }} to {{ c.endDay }}
            </div>
            <div>Penalty: {{ c.penalty }}</div>
          </div>
          <button @click="acceptContract(c.id)">Accept</button>
        </div>
      </div>
      <div v-else class="empty">No offers at the moment.</div>

      <h2>Active Contracts</h2>
      <div v-if="activeContracts.length">
        <div v-for="c in activeContracts" :key="c.id" class="contract-active">
          <div class="summary">
            <div>{{ c.productType }} x{{ c.quantity }} @ {{ c.pricePerUnit }}</div>
            <div>Penalty: {{ c.penalty }}</div>
            <div>Status: {{ c.status }}</div>
          </div>
          <div v-if="c.contractType === 'one-time'" class="delivery-line">
            <span>Due: {{ new Date(c.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }}</span>
            <button
              v-if="dayNum >= dueDayFromDate(c.dueDate) && c.status === 'active'"
              :disabled="!hasInventory(c.productType, c.quantity)"
              @click="fulfillOneTime(c)"
            >Fulfill</button>
          </div>
          <div v-else class="delivery-list">
            <div
              v-for="d in c.deliveries"
              :key="d.day"
              class="delivery-item"
            >
              <span>Due: {{ formatDay(d.day) }}</span>
              <span v-if="d.fulfilled"> - Delivered</span>
              <span v-else-if="dayNum > d.day"> - Missed</span>
              <span v-else> - Pending</span>
              <button
                v-if="dayNum >= d.day && !d.fulfilled && c.status === 'active'"
                :disabled="!hasInventory(c.productType, c.quantity)"
                @click="fulfillRecurring(c, d.day)"
              >Fulfill</button>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="empty">No active contracts.</div>

      <details class="history">
        <summary>Contract History</summary>
        <div v-if="historyContracts.length">
          <div v-for="c in historyContracts" :key="c.id" class="history-row">
            <div>{{ c.productType }} x{{ c.quantity }} @ {{ c.pricePerUnit }}</div>
            <div>Status: {{ c.status }}</div>
          </div>
        </div>
        <div v-else class="empty">No history yet.</div>
      </details>
    </section>

    <section class="open-market">
      <h2>Open Market</h2>
      <div v-if="market.harvestedProducts.length">
        <div v-for="p in market.harvestedProducts" :key="p.type" class="market-row">
          <span>{{ p.type }} (x{{ p.qty }}) - Price: {{ market.openMarket.prices[p.type]?.sell || 1 }}</span>
          <input type="number" min="1" v-model.number="sellAmounts[p.type]" class="sell-input" />
          <button @click="sell(p.type)">Sell</button>
        </div>
      </div>
      <div v-else class="empty">No products in inventory.</div>
    </section>

    <section class="market-news">
      <h2>Market News</h2>
      <ul>
        <li v-for="n in latestNews" :key="n.day">Day {{ n.day }}: {{ n.message }}</li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.market-area {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  gap: 1.2rem;
}
.top-bar {
  display: flex;
  gap: 1rem;
  align-items: center;
  background: #e0f7fa;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid #b2dfdb;
}
.stats {
  margin-left: auto;
  display: flex;
  gap: 1rem;
  align-items: center;
}
.contracts, .open-market, .market-news {
  background: #f8fdfd;
  padding: 1rem;
  border: 1px solid #b2dfdb;
  border-radius: 8px;
}
.contract-row, .market-row, .history-row {
  display: flex;
  justify-content: space-between;
  padding: 0.3rem 0;
  border-bottom: 1px solid #ddd;
}
.contract-row:last-child, .market-row:last-child, .history-row:last-child {
  border-bottom: none;
}
.contract-active {
  border-bottom: 1px solid #ccc;
  padding: 0.5rem 0;
}
.delivery-item {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}
.sell-input {
  width: 60px;
}
.empty {
  font-style: italic;
  color: #777;
}
</style>
