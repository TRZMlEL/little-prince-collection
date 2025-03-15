<template>
    <div class="p-6 max-w-2xl mx-auto bg-white shadow-lg rounded-lg">
        <button @click="$router.back()" class="mb-4 text-blue-500 hover:underline">← Powrót</button>
        <canvas id="book-canvas" class="w-1/2 h-96"></canvas>
        <!-- <div class="flex flex-col items-center text-center">
        <img :src="book?.cover" alt="Book Cover" class="w-40 h-60 object-cover rounded-md mb-4" />
        <h2 class="text-2xl font-bold">{{ book?.title }}</h2>
        <p class="text-gray-600">{{ book?.author }}</p>
        <p class="text-sm text-gray-500 mt-2">Język: {{ book?.language }}</p>
        </div> -->
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Three from './three-book';

const route = useRoute();
const book = ref(null);

onMounted(async () => {
    // Fetch book
    const response = await fetch('/books.json');
    const allBooks = await response.json();
    book.value = allBooks.find(b => b.isbn === route.params.isbn);

    if (!book.value) {
        console.error('Book not found');
        return;
    }
    const getCover = (book) => book.cover.startsWith(' /') ? book.cover : `/_nuxt${book.cover}`;
    // Three.js
    const canvas = document.querySelector('#book-canvas');
    if (canvas) {
        new Three(canvas, getCover(book.value));
    }
});
</script>

<style scoped>
#book-canvas {
  background: #222;
}
</style>