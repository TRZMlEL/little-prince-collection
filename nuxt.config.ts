// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
import glsl from "vite-plugin-glsl";

export default defineNuxtConfig({
  app: {
    baseURL: '/little-prince-collection/', // Zmień na nazwę repozytorium
    head: {
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/svg+xml', href: '/icon0.svg' },
        { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/icon1.png' },
        { rel: 'icon', type: 'image/png', sizes: '512x512', href: '/icon2.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' }
      ],
    },
  },
  routeRules: {
    '/**': { prerender: true } // Generowanie statycznych plików
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
  // nitro: {
  //   prerender: {
  //     crawlLinks: false, // Wyłącza automatyczne znajdowanie stron do prerenderowania
  //     routes: [] // Nie renderuje żadnych tras
  //   },
  // },
});