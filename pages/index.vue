  <template>
    <div class="relative w-screen h-full pt-4 pb-4 px-4 lg:px-16 xl:px-32 little-prince bg-[url(/images/site-background.jpg)] bg-inherit bg-center">
      <canvas id="background-canvas" class="absolute top-0 left-0 w-full h-full z-0"></canvas>
      <header class="flex gap-4 items-center mb-4 flex-wrap xl:flex-row">
        <div class="flex items-center gap-4">
          <!-- Skip to main content button for a11y -->
          <a
          href="#main-content"
          class="text-xs sr-only focus:not-sr-only bg-[var(--night-sky)] text-white focus:text-[var(--stars)] p-32 px-4 py-2 shadow-[var(--shadow-night-sky)] transition-opacity duration-200 text-center"
          >
            Skip to main content
          </a>

          <h1 class="text-[var(--night-sky)] font-little-prince text-4xl">Kolekcja Oliwii</h1>
        </div>
        <div class="flex gap-4 flex-wrap ml-auto">
          <!-- filter mode -->
          <select v-model="selectedFilter" class="w-full sm:w-auto p-2 bg-[var(--night-sky)] text-white hover:text-[var(--stars)] shadow-[var(--shadow-night-sky)]">
            <option value="owned">Moje książki</option>
            <option value="all-languages">Wszystkie języki</option>
            <option value="all-editions">Wszystkie wydania</option>
          </select>

          <!-- filter language -->
          <select v-model="selectedLanguage" class="w-full sm:w-auto p-2 bg-[var(--night-sky)] text-white hover:text-[var(--stars)] shadow-[var(--shadow-night-sky)]">
            <option value="">Filtruj po języku</option>
            <option v-for="(books, lang) in booksByLanguage" :key="lang" :value="lang">{{ lang }}</option>
          </select>

          <!-- filter country -->
          <select v-model="selectedCountry" class="w-full sm:w-auto p-2 bg-[var(--night-sky)] text-white hover:text-[var(--stars)] shadow-[var(--shadow-night-sky)]">
            <option value="">Filtruj po kraju</option>
            <option v-for="country in uniqueCountries" :key="country" :value="country">{{ country }}</option>
          </select>

          <!-- filter continent -->
          <select v-model="selectedContinent" class="w-full sm:w-auto p-2 bg-[var(--night-sky)] text-white hover:text-[var(--stars)] shadow-[var(--shadow-night-sky)]">
            <option value="">Filtruj po kontynencie</option>
            <option v-for="continent in uniqueContinents" :key="continent" :value="continent">{{ continent }}</option>
          </select>

          <!-- search bar -->
          <input v-model="searchQuery" type="text" placeholder="Szukaj po ISBN lub tytule" class="w-full sm:w-auto p-2 bg-[var(--night-sky)] text-white hover:text-[var(--stars)] shadow-[var(--shadow-night-sky)]" />
        </div>
      </header>

      <main class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 w-full flex-wrap" id="main-content">
        <div v-for="book in filteredBooks" :key="book.isbn"
          class="cursor-pointer flex flex-col items-center w-full z-10"
          @click="handleBookClick(book)"
          @keydown.enter="handleBookClick(book)"
          @keydown.space.prevent="handleBookClick(book)"
          tabindex="0">
          <div class="covers">
            <img :src="`/little-prince-collection${getCover(book)}`" alt="Book Cover" :class="{ 'saturate-[40%] blur-[1px] hover:filter-none': book.owned === false }" class="transition duration-400 shadow-lg min-h-72 max-h-72 object-cover hover:scale-105" />
          </div>
          <div class="mt-2 text-center titles">
            <h2 class="text-lg font-semibold">{{ book.language }}</h2>
            <p class="text-sm text-gray-500">{{ book.title }}</p>
            <p class="text-xs text-gray-400">
              <template v-if="book.region">
                {{ book.region }} -
              </template>
              {{ book.country }} - {{ book.continent }}
            </p>
          </div>
        </div>
      </main>
    </div>
  </template>

  <script setup>
  import { ref, computed, watch, onMounted, nextTick } from 'vue'
  import { useRouter } from 'vue-router'
  import gsap from 'gsap'
  import { ScrollTrigger } from 'gsap/ScrollTrigger'
  import Three from './three';

  const books = ref([]);
  const selectedFilter = ref('owned');
  const selectedLanguage = ref('');
  const selectedCountry = ref('');
  const selectedContinent = ref('');
  const searchQuery = ref('');
  const router = useRouter();

  gsap.registerPlugin(ScrollTrigger);

  onMounted(async () => {
    const covers = document.querySelector('.covers');
    const titles = document.querySelector('.titles');

    const response = await fetch('/little-prince-collection/books.json')
    books.value = await response.json()

    // THREE.JS
    const canvas = document.querySelector('#background-canvas');
    if (canvas) {
      new Three(canvas);
    }

    // GSAP
    await nextTick(); // Ensure the elements are in the DOM

    gsap.from('.covers', {
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
      x: -50,
      opacity: 0,
      duration: 1.2,
      ease: "power3.out",
      stagger: 0.2,
      scrollTrigger: {
        trigger: titles,
        start: "top 100%",
        toggleActions: "play none none none",
        once: true
      }
    });
  });

  console.log(books.value);

  const getCover = (book) => {
    return "/little-prince-collection"+book.cover.startsWith('/')
    ? book.cover
    : `/covers/${book.cover}`;
  };

  // Unique values of countries and continents
  const uniqueCountries = computed(() => [...new Set(books.value.map(book => book.country))]);
  const uniqueContinents = computed(() => [...new Set(books.value.map(book => book.continent))]);

  // group books by languages
  const booksByLanguage = computed(() => {
    return books.value.reduce((grouped, book) => {
      (grouped[book.language] ||= []).push(book);
      return grouped;
    }, {});
  });

  // filter books
  const filteredBooks = computed(() => {
    let filtered = books.value;

    // filter mode
    if (selectedFilter.value === 'owned') {
      filtered = filtered.filter(book => book.owned);
    }

    // filter by languages
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

    // filter by country
    if (selectedCountry.value) {
      filtered = filtered.filter(book => book.country === selectedCountry.value);
    }

    // filter by continent
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

    // sort alphabetically by language
    filtered.sort((a, b) => a.language.localeCompare(b.language));

    return filtered;
  });

  // Clicking on a book opens all editions in the given language.
  const handleBookClick = (book) => {
    if (selectedFilter.value === 'all-languages') {
      selectedFilter.value = 'all-editions';
      selectedLanguage.value = book.language;
    } else {
      router.push(`/${book.isbn}`);
    }
  };

  </script>

  <style scoped>
  
  #background-canvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none; 
  }

  </style>