<template>
  <div
    class="card"
    :class="{ flipped: revealed || matched }"
    @click="flipCard"
  >
    <div class="inner">
      <div class="front">
        <img :src="image" alt="card" />
      </div>
      <div class="back">?</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  image: String,
  revealed: Boolean,
  matched: Boolean,
  index: Number
})

const emit = defineEmits(['flip'])

function flipCard() {
  if (!props.revealed && !props.matched) emit('flip', props.index)
}
</script>

<style scoped>
.card {
  width: 100px;
  height: 100px;
  perspective: 1000px;
  cursor: pointer;
}

.inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.5s;
  transform-style: preserve-3d;
}

.flipped .inner {
  transform: rotateY(180deg);
}

.front,
.back {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  backface-visibility: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  background: #f0f0f0;
}

.front {
  transform: rotateY(180deg);
  background-color: #fff;
}

.front img {
  width: 80%;
  height: 80%;
  object-fit: contain;
}

.back {
  background-color: #3b82f6;
  color: white;
  font-weight: bold;
}
</style>
