<template>
  <div class="relative w-screen h-screen pt-4 pb-4 pr-16 pl-16 little-prince">
    <img src="../assets/covers/978-0-15-601404-5.jpg" alt="Book cover" class="h-full absolute right-0 bottom-0" />
    <!-- <canvas id="background-canvas" class="absolute top-0 left-0 w-full h-full z-0"></canvas> -->
    <header class="flex flex-wrap gap-4 items-center mb-6">
      <!-- Wybór trybu -->
      <select v-model="selectedFilter" class="p-2 border rounded-md bg-white shadow">
        <option value="owned">Moje książki</option>
        <option value="all-languages">Wszystkie języki</option>
        <option value="all-editions">Wszystkie wydania</option>
      </select>

      <!-- Wybór języka -->
      <select v-model="selectedLanguage" class="p-2 border rounded-md bg-white shadow">
        <option value="">Filtruj po języku</option>
        <option v-for="(books, lang) in booksByLanguage" :key="lang" :value="lang">{{ lang }}</option>
      </select>

      <!-- Wybór kraju -->
      <select v-model="selectedCountry" class="p-2 border rounded-md bg-white shadow">
        <option value="">Filtruj po kraju</option>
        <option v-for="country in uniqueCountries" :key="country" :value="country">{{ country }}</option>
      </select>

      <!-- Wybór kontynentu -->
      <select v-model="selectedContinent" class="p-2 border rounded-md bg-white shadow">
        <option value="">Filtruj po kontynencie</option>
        <option v-for="continent in uniqueContinents" :key="continent" :value="continent">{{ continent }}</option>
      </select>

      <!-- Wyszukiwarka -->
      <input v-model="searchQuery" type="text" placeholder="Szukaj po ISBN lub tytule" class="p-2 border rounded-md bg-white shadow" />
    </header>

    <main class="flex gap-8 w-[calc(100vw-32px)] flex-wrap">
      <div v-for="book in filteredBooks" :key="book.id"
        class="cursor-pointer flex flex-col items-center z-10"
        @click="handleBookClick(book)">
        <div class="covers">
          <img :src="getCover(book)" alt="Book Cover" :class="{ 'saturate-[40%] blur-[1px] hover:filter-none': book.owned === false }" class="transition duration-400 shadow-lg min-h-92 max-h-92 object-cover hover:scale-105" />
        </div>
        <div class="mt-2 text-center titles">
          <h3 class="text-lg font-semibold">{{ book.language }}</h3>
          <p class="text-sm text-gray-500">{{ book.title }}</p>
          <p class="text-xs text-gray-400">
  <template v-if="book.region">
    {{ book.region }} -
  </template>
  {{ book.country }} - {{ book.continent }}
</p>        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'

import { useRouter } from 'vue-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
// import Three from './three';

const books = ref([]);
const selectedFilter = ref('owned');
const selectedLanguage = ref('');
const selectedCountry = ref('');
const selectedContinent = ref('');
const searchQuery = ref('');
const router = useRouter();

// GSAP
gsap.registerPlugin(ScrollTrigger);

onMounted(async () => {
  const covers = document.querySelector('.covers');
  const titles = document.querySelector('.titles');

  const response = await fetch('/books.json')
  books.value = await response.json()

// THREE.JS
  // const canvas = document.querySelector('#background-canvas');
  //   if (canvas) {
  //     new Three(canvas);
  //   }

  // GSAP
  await nextTick(); // Ensure the elements are in the DOM

  gsap.from('.covers' , {
  y: 70,            // Startowe przesunięcie w dół
  opacity: 0,       // Zanikający efekt
  rotationX: -25,    // Pochylenie do przodu
  rotationY: 25,
  duration: 1.6,
  ease: "power1.inOut",
  stagger: 0.2,     // Dodanie opóźnienia między elementami
  scrollTrigger: {
    trigger: covers,
    start: "top 80%", // Animacja startuje, gdy 80% elementu wejdzie na ekran
    toggleActions: "play none none none",
    once: false       // Animacja uruchamia się tylko raz
  }
});

  gsap.from('.titles', {
    x: -50,            // Startowe przesunięcie w dół
    opacity: 0,       // Zanikający efekt
    duration: 1.2,
    ease: "power3.out",
    stagger: 0.2,     // Dodanie opóźnienia między elementami
    scrollTrigger: {
      trigger: titles,
      start: "top 100%", // Animacja startuje, gdy 80% elementu wejdzie na ekran
      toggleActions: "play none none none",
      once: true       // Animacja uruchamia się tylko raz
    }
  });
});

const getCover = (book) => new URL(`../assets/covers/${book.isbn}.jpg`, import.meta.url).href;

// Unikalne wartości krajów i kontynentów
const uniqueCountries = computed(() => [...new Set(books.value.map(book => book.country))]);
const uniqueContinents = computed(() => [...new Set(books.value.map(book => book.continent))]);

// Grupowanie książek według języka
const booksByLanguage = computed(() => {
  return books.value.reduce((grouped, book) => {
    (grouped[book.language] ||= []).push(book);
    return grouped;
  }, {});
});

// Filtracja książek
const filteredBooks = computed(() => {
  let filtered = books.value;

  // Filtracja po trybie
  if (selectedFilter.value === 'owned') {
    filtered = filtered.filter(book => book.owned);
  }

  // Filtracja po języku
  if (selectedLanguage.value) {
    if (selectedFilter.value === 'owned') {
      filtered = filtered.filter(book => book.language === selectedLanguage.value && book.owned);
    } else if (selectedFilter.value === 'all-languages') {
      filtered = booksByLanguage.value[selectedLanguage.value] ? [booksByLanguage.value[selectedLanguage.value][0]] : [];
    } else if (selectedFilter.value === 'all-editions') {
      filtered = filtered.filter(book => book.language === selectedLanguage.value);
    }
  } else {
    if (selectedFilter.value === 'all-languages') {
      filtered = Object.values(booksByLanguage.value).map(bookList => bookList[0]);
    } else if (selectedFilter.value === 'all-editions') {
      filtered = books.value;
    }
  }

  // Filtracja po kraju
  if (selectedCountry.value) {
    filtered = filtered.filter(book => book.country === selectedCountry.value);
  }

  // Filtracja po kontynencie
  if (selectedContinent.value) {
    filtered = filtered.filter(book => book.continent === selectedContinent.value);
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(book => 
      book.isbn.includes(query) || 
      book.title.toLowerCase().includes(query)
    );
  }

  // Sortowanie alfabetyczne po języku
  filtered.sort((a, b) => a.language.localeCompare(b.language));

  return filtered;
});

// Jeśli jesteśmy w "Wszystkie języki" i klikniemy książkę → przełączamy na "Wszystkie wydania" w tym języku
const handleBookClick = (book) => {
  if (selectedFilter.value === 'all-languages') {
    selectedFilter.value = 'all-editions';
    selectedLanguage.value = book.language;
  } else {
    router.push(`/book-details/${book.id}`);
  }
};

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