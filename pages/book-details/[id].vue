<template>
<div class="p-6 max-w-2xl mx-auto bg-white shadow-lg rounded-lg">
    <button @click="$router.back()" class="mb-4 text-blue-500 hover:underline">← Powrót</button>
    <!-- <div class="flex flex-col items-center text-center">
    <img :src="book?.cover" alt="Book Cover" class="w-40 h-60 object-cover rounded-md mb-4" />
    <h2 class="text-2xl font-bold">{{ book?.title }}</h2>
    <p class="text-gray-600">{{ book?.author }}</p>
    <p class="text-sm text-gray-500 mt-2">Język: {{ book?.language }}</p>
    </div> -->
</div>
</template>

<script setup>
// import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute();
// const book = ref(null);

// onMounted(async () => {
// const response = await fetch('/books.json');
// const allBooks = await response.json();
// book.value = allBooks.find(b => b.id === Number(route.params.id));
// });
</script>
  