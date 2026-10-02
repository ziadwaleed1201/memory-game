// store.ts
import { createStore } from 'vuex'

export interface RootState {
  cards: Card[]
  matchedPairs: number
  totalPairs: number
  currentLevel: number
  score: number
  gameStarted: boolean
}

export interface Card {
  id: number
  image: string
  revealed: boolean
  matched: boolean
}

// --- Helper Function ---
function shuffle<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5)
}

// --- Image names ---
const imageNames = [
  'baseball.png', 'basketball.png', 'beachball.png', 'billiard.png',
  'bowling.png', 'chess.png', 'cricket.png', 'domino.png',
  'football.png', 'futsal.png', 'handBall.png', 'pingPong.png',
  'soccer.png', 'squash.png', 'tennis.png', 'volleyBall.png'
]

// --- Difficulty Levels ---
const LEVELS = {
  1: { pairs: 4, points: 10, gridColumns: 4 },    // Easy
  2: { pairs: 8, points: 20, gridColumns: 4 },    // Medium  
  3: { pairs: 12, points: 30, gridColumns: 6 }     // Hard
}

const store = createStore({
  state(): RootState {
    return {
      cards: [],
      matchedPairs: 0,
      totalPairs: 8,
      currentLevel: 1,
      score: 0,
      gameStarted: false
    }
  },

  mutations: {
    setCards(state: RootState, cards: Card[]) {
      state.cards = cards
    },

    flipCard(state: RootState, index: number) {
      const card = state.cards[index]
      if (!card || card.matched || card.revealed) return
      card.revealed = !card.revealed
    },

    matchCards(state: RootState, payload: { indices: [number, number], level: number }) {
      const [i1, i2] = payload.indices
      const card1 = state.cards[i1]
      const card2 = state.cards[i2]
      if (!card1 || !card2) return
      
      card1.matched = true
      card2.matched = true
      state.matchedPairs++
      
      // Increase score based on level
      state.score += LEVELS[state.currentLevel as keyof typeof LEVELS].points
    },

    resetFlips(state: RootState) {
      state.cards.forEach((card) => {
        if (!card.matched) card.revealed = false
      })
    },

    resetGame(state: RootState) {
      state.cards = []
      state.matchedPairs = 0
      state.score = 0
      state.gameStarted = false
    },

    setLevel(state: RootState, level: number) {
      state.currentLevel = level
      state.totalPairs = LEVELS[level as keyof typeof LEVELS].pairs
    },

    setGameStarted(state: RootState, started: boolean) {
      state.gameStarted = started
    }
  },

  actions: {
    startGame({ commit, state }: { commit: Function; state: RootState }, level: number = 1) {
      commit('setLevel', level)
      
      const levelConfig = LEVELS[level as keyof typeof LEVELS]
      const chosen = imageNames.slice(0, levelConfig.pairs)
      const doubled: Card[] = [...chosen, ...chosen].map((name, idx) => ({
        id: idx,
        image: new URL(`../assets/images/${name}`, import.meta.url).href,
        revealed: false,
        matched: false
      }))

      commit('resetGame')
      commit('setCards', shuffle(doubled))
      commit('setGameStarted', true)
    },

    flipCard({ commit, state }: { commit: Function; state: RootState }, index: number) {
      const card = state.cards[index]
      if (!card || card.matched || card.revealed) return

      commit('flipCard', index)

      // Find all currently flipped but unmatched cards
      const flipped = state.cards
        .map((c, i) => ({ c, i }))
        .filter(({ c }) => c.revealed && !c.matched)

      if (flipped.length === 2) {
        const first = flipped[0]
        const second = flipped[1]
        if (!first || !second) return

        if (first.c.image === second.c.image) {
          commit('matchCards', { 
            indices: [first.i, second.i], 
            level: state.currentLevel 
          })
        } else {
          setTimeout(() => {
            commit('resetFlips')
          }, 1000)
        }
      }
    },

    restart({ dispatch }: { dispatch: Function }) {
      dispatch('startGame')
    },

    changeLevel({ dispatch }: { dispatch: Function }, level: number) {
      dispatch('startGame', level)
    }
  },

  getters: {
    allMatched(state: RootState): boolean {
      return state.matchedPairs === state.totalPairs
    },
    currentLevelConfig(state: RootState) {
      return LEVELS[state.currentLevel as keyof typeof LEVELS]
    }
  }
})

export default store