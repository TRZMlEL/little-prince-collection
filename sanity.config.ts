import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemaTypes/index.js'

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID || 'rwpyne1a'
const dataset = import.meta.env.PUBLIC_SANITY_DATASET || 'production'

export default defineConfig({
  name: 'default',
  title: 'Little Prince Collection CMS',
  projectId,
  dataset,
  basePath: '/cms',
  plugins: [deskTool(), visionTool()],
  schema: {
    types: schemaTypes,
  },
})
