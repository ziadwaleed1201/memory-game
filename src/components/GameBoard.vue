<template>
  <div class="game-container">
    <h2>Sports Memory Game 🏀</h2>

    <!-- Level Selection (only show before game starts) -->
    <div v-if="!gameStarted" class="level-selection">
      <h3>Select Difficulty Level</h3>
      <div class="level-buttons">
        <button 
          v-for="level in [1, 2, 3]" 
          :key="level" 
          @click="startGame(level)"
          class="level-btn"
        >
          Level {{ level }} 
          <br>
          <small>{{ getLevelDescription(level) }}</small>
        </button>
      </div>
    </div>

    <!-- Game Board (only show when game started) -->
    <div v-if="gameStarted" class="game-board">
      <div class="stats">
        <p>Level: {{ currentLevel }}</p>
        <p>Score: {{ score }}</p>
        <p>Matched: {{ matchedPairs }} / {{ totalPairs }}</p>
        <button @click="restart" class="restart-btn">Restart</button>
        <button @click="changeLevel" class="level-change-btn">Change Level</button>
      </div>

      <div class="board" :style="{ gridTemplateColumns: `repeat(${gridColumns}, 100px)` }">
        <Card
          v-for="(card, index) in cards"
          :key="card.id"
          :image="card.image"
          :revealed="card.revealed"
          :matched="card.matched"
          :index="index"
          @flip="onFlip"
        />
      </div>

      <!-- Win Message -->
      <div v-if="allMatched" class="win-message">
        <h3>🎉 Congratulations! 🎉</h3>
        <p>You completed Level {{ currentLevel }} with {{ score }} points!</p>
        <button @click="changeLevel" class="next-level-btn">Play Again</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import Card from './Card.vue'

const store = useStore()

const cards = computed(() => store.state.cards)
const matchedPairs = computed(() => store.state.matchedPairs)
const totalPairs = computed(() => store.state.totalPairs)
const currentLevel = computed(() => store.state.currentLevel)
const score = computed(() => store.state.score)
const gameStarted = computed(() => store.state.gameStarted)
const allMatched = computed(() => store.getters.allMatched)
const gridColumns = computed(() => store.getters.currentLevelConfig?.gridColumns || 4)

function onFlip(index: number) {
  store.dispatch('flipCard', index)
}

function restart() {
  store.dispatch('restart')
}

function startGame(level: number) {
  store.dispatch('startGame', level)
}

function changeLevel() {
  store.commit('setGameStarted', false)
}

function getLevelDescription(level: number): string {
  const descriptions = {
    1: 'Easy - 4 pairs',
    2: 'Medium - 8 pairs', 
    3: 'Hard - 12 pairs'
  }
  return descriptions[level as keyof typeof descriptions] || ''
}
</script>

<style scoped>
.game-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 20px;
}

.level-selection {
  text-align: center;
  margin: 20px 0;
}

.level-buttons {
  display: flex;
  gap: 15px;
  margin-top: 15px;
}

.level-btn {
  padding: 15px 25px;
  font-size: 16px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;
}

.level-btn:hover {
  background: #45a049;
}

.level-btn:nth-child(2) {
  background: #FF9800;
}

.level-btn:nth-child(2):hover {
  background: #e68900;
}

.level-btn:nth-child(3) {
  background: #f44336;
}

.level-btn:nth-child(3):hover {
  background: #da190b;
}

.stats {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 20px;
  flex-wrap: wrap;
  justify-content: center;
}

.board {
  display: grid;
  gap: 10px;
  justify-content: center;
  margin-top: 10px;
}

.restart-btn, .level-change-btn, .next-level-btn {
  padding: 10px 15px;
  margin: 5px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
}

.restart-btn {
  background: #2196F3;
  color: white;
}

.level-change-btn {
  background: #FF9800;
  color: white;
}

.next-level-btn {
  background: #4CAF50;
  color: white;
  padding: 12px 20px;
  font-size: 16px;
}

.win-message {
  text-align: center;
  margin-top: 20px;
  padding: 20px;
  background: #e8f5e8;
  border-radius: 10px;
  border: 2px solid #4CAF50;
}
</style>