import { fileURLToPath } from 'node:url'
import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import vercel from '@astrojs/vercel'
import sanity from '@sanity/astro'
import tailwindcss from '@tailwindcss/vite'

const base = process.env.BASE_PATH || '/'
const projectId = process.env.SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID || process.env.NUXT_PUBLIC_SANITY_PROJECT_ID || 'rwpyne1a'
const dataset = process.env.SANITY_DATASET || process.env.SANITY_STUDIO_DATASET || process.env.NUXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = process.env.SANITY_API_VERSION || process.env.NUXT_PUBLIC_SANITY_API_VERSION || '2025-01-01'

export default defineConfig({
  base,
  output: 'server',
  i18n: {
    defaultLocale: 'pl',
    locales: ['pl', 'en'],
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false,
    },
  },
  adapter: vercel(),
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ['sanity', 'sanity/desk', '@sanity/vision', '@sanity/icons'],
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./', import.meta.url)),
      },
    },
  },
  integrations: [
    sanity({
      projectId,
      dataset,
      apiVersion,
      useCdn: false,
      studioBasePath: '/cms',
    }),
    react(),
  ],
})
