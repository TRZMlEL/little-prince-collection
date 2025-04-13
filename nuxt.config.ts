import tailwindcss from "@tailwindcss/vite";
import glsl from "vite-plugin-glsl";

export default defineNuxtConfig({
  app: {
    baseURL: '/little-prince-collection/',
    head: {
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/little-prince-collection/favicon.ico' },
        { rel: 'icon', type: 'image/svg+xml', href: '/little-prince-collection/icon0.svg' },
        { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/little-prince-collection/icon1.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/little-prince-collection/apple-icon.png' },
        { rel: 'manifest', href: '/little-prince-collection/site.webmanifest' }
      ],
      meta: [
        { 'http-equiv': 'Permissions-Policy', content: 'interest-cohort=()' }
      ],
    },
  },
  routeRules: {
    '/**': { prerender: true }
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
});