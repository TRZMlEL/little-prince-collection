const projectId = process.env.SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID || ''
const dataset = process.env.SANITY_DATASET || process.env.SANITY_STUDIO_DATASET || 'production'

export default {
  api: {
    projectId,
    dataset,
  },
}
