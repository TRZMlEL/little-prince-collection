// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
import glsl from "vite-plugin-glsl";

export default defineNuxtConfig({
  app: {
    baseURL: '/little-prince/', // Zmień na nazwę repozytorium
  },
  routeRules: {
    '/**': { prerender: false } // Generowanie statycznych plików
  },
  ssr: false,
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [
      tailwindcss(),
      glsl(),
    ],
  },
  nitro: {
    prerender: {
      crawlLinks: false, // Wyłącza automatyczne znajdowanie stron do prerenderowania
      routes: [] // Nie renderuje żadnych tras
    },
  }
});