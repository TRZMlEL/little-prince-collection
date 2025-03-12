<template>
  <div class="relative w-screen h-screen">
    <img src="../assets/images/book-cover.jpg" alt="Book cover" class="h-full absolute right-0 bottom-0" />
    <canvas id="background-canvas" class="absolute top-0 left-0 w-full h-full z-0"></canvas>
    <div class="relative grid grid-cols-1 md:grid-cols-3 gap-4 p-6 z-10">
      <div v-for="(book, index) in books" :key="index" class="p-4 bg-gray-100 rounded-lg shadow">
        <h2 class="text-xl font-bold">{{ book.title }}</h2>
        <p class="text-gray-600">{{ book.author }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Three from './three';

const books = ref([]);

onMounted(async () => {
  const response = await fetch('/books.json');
  books.value = await response.json();

  const canvas = document.querySelector('#background-canvas');
  if (canvas) {
    new Three(canvas);
  }
});
</script>

<style scoped>
/* Ensure the canvas covers the entire background */
#background-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none; /* Ensure the canvas does not interfere with user interactions */
}
</style>