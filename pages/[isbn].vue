<template>
    <div class="p-8 pl-32 pr-32 h-[calc(100vh-16px)] bg-[url(/images/site-background.jpg)]">
        <button @click="$router.back()" class="mb-4 text-[var(--night-sky) hover:underline">← Powrót</button>
        <div class="flex gap-16 h-full">
            <canvas id="book-canvas" class="w-[calc(50%-8px)] h-full"></canvas>
            <div>
                <h1 class="text-6xl font-bold font-little-prince text-[var(--night-sky)]">{{ book?.title }}</h1>
                <table class="border-collapse border-2">
                    <tr>
                        <td class="border-4 border-[var(--dark-night-sky)] bg-[var(--night-sky)] text-white px-4 py-2">ISBN:</td>
                        <td class="border-4 border-[var(--dark-night-sky)] bg-[var(--night-sky)] text-white px-4 py-2">{{ book?.isbn }}</td>
                    </tr >
                    <tr>
                        <td class="border-4 border-[var(--dark-night-sky)] bg-[var(--night-sky)] text-white px-4 py-2">Tytuł:</td>
                        <td class="border-4 border-[var(--dark-night-sky)] bg-[var(--night-sky)] text-white px-4 py-2">{{ book?.title }}</td>
                    </tr >
                    <tr>
                        <td class="border-4 border-[var(--dark-night-sky)] bg-[var(--night-sky)] text-white px-4 py-2">Język:</td>
                        <td class="border-4 border-[var(--dark-night-sky)] bg-[var(--night-sky)] text-white px-4 py-2">{{ book?.language }}</td>
                    </tr>
                    <tr>
                        <td class="border-4 border-[var(--dark-night-sky)] bg-[var(--night-sky)] text-white px-4 py-2">Region:</td>
                        <td class="border-4 border-[var(--dark-night-sky)] bg-[var(--night-sky)] text-white px-4 py-2">{{ book?.region }}</td>
                    </tr>
                    <tr>
                        <td class="border-4 border-[var(--dark-night-sky)] bg-[var(--night-sky)] text-white px-4 py-2">Kraj:</td>
                        <td class="border-4 border-[var(--dark-night-sky)] bg-[var(--night-sky)] text-white px-4 py-2">{{ book?.country }}</td>
                    </tr>
                    <tr>
                        <td class="border-4 border-[var(--dark-night-sky)] bg-[var(--night-sky)] text-white px-4 py-2">Wydawnictwo:</td>
                        <td class="border-4 border-[var(--dark-night-sky)] bg-[var(--night-sky)] text-white px-4 py-2">{{ book?.publisher }}</td>
                    </tr>
                    <tr>
                        <td class="border-4 border-[var(--dark-night-sky)] bg-[var(--night-sky)] text-white px-4 py-2">Tłumaczenie:</td>
                        <td class="border-4 border-[var(--dark-night-sky)] bg-[var(--night-sky)] text-white px-4 py-2">{{ book?.translator }}</td>
                    </tr>
                    <tr>
                        <td class="border-4 border-[var(--dark-night-sky)] bg-[var(--night-sky)] text-white px-4 py-2">Rok wydania:</td>
                        <td class="border-4 border-[var(--dark-night-sky)] bg-[var(--night-sky)] text-white px-4 py-2">{{ book?.year }}</td>
                    </tr>
                    <tr>
                        <td class="border-4 border-[var(--dark-night-sky)] bg-[var(--night-sky)] text-white px-4 py-2">Autor:</td>
                        <td class="border-4 border-[var(--dark-night-sky)] bg-[var(--night-sky)] text-white px-4 py-2">{{ book?.author }}</td>
                    </tr>
                </table>
                <div id="otherCovers">
                    <h2 class="text-2xl font-bold">Inne okładki</h2>
                    <div class="flex gap-4">
                        <img v-for="cover in book?.otherCovers" :key="cover" :src="cover" alt="Book Cover" class="w-20 h-32 object-cover rounded-md" />
                    </div>
                </div>
            </div>
        </div>
        
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
    const response = await fetch('/little-prince-collection/books.json');
    const allBooks = await response.json();
    book.value = allBooks.find(b => b.isbn === route.params.isbn);

    if (!book.value) {
        console.error('Book not found');
        return;
    }

    const getCover = (book) => {
    return "/little-prince-collection"+book.cover.startsWith('/')
    ? book.cover
    : `/covers/${book.cover}`;
  };
  console.log("/little-prince-collection"+getCover(book.value));
    // Three.js
    const canvas = document.querySelector('#book-canvas');
    if (canvas) {
        new Three(canvas, "/little-prince-collection"+getCover(book.value));
    }
});
</script>