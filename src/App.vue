<template>
  <div id="app">
    <h1>Memory Game</h1>
    <!-- Your game component goes here -->\
    <GameBoard />
  </div>
</template>

<script lang="ts">
import GameBoard from './components/GameBoard.vue';
export default {
  name: 'App',
  components: {
    GameBoard
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  margin-top: 60px;
}
</style>
