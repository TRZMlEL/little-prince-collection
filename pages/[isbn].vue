<template>
    <div class="p-8 px-4 md:px-32 h-full min-h-screen bg-[url(/images/site-background.jpg)]">
        <button @click="$router.back()" class="mb-4 text-[var(--night-sky) hover:underline">← Powrót</button>
        <div class="flex gap-16 flex-col md:flex-row h-full">
            <canvas id="book-canvas" class="w-full md:w-[calc(50%-8px)] md:h-[calc(100vh-128px)]"></canvas>
            <div class="text-center flex flex-col items-center justify-start">
                <h1 class="text-6xl font-bold font-little-prince text-[var(--night-sky)]">{{ book?.title }}</h1>
                <table class="border-collapse border-2">
                    <tbody>
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
                    </tbody>
                </table>
                <div id="otherCovers">
                    <h2 class="text-2xl mt-8 font-bold text-[var(--night-sky)]">Inne okładki</h2>
                    <div class="flex gap-4">
                        <img v-for="cover in book?.otherCovers" :key="cover" :src="cover" alt="Book Cover" class="w-20 h-32 object-cover rounded-md" />
                    </div>
                </div>
            </div>
        </div>
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
        if (!book?.cover) return '';
        // Usuń przedrostek /covers/ jeśli istnieje
        const coverName = book.cover.replace(/^\/covers\//, '');
        return `/covers/${coverName}`;
    };

    // Three.js
    const canvas = document.querySelector('#book-canvas');
    const coverPath = book.value?.cover ? getCover(book.value) : '';
    if (canvas && coverPath) {
        new Three(canvas, `/little-prince-collection${coverPath}`);
    }
});
</script>