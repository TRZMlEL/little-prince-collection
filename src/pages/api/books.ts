import type { APIRoute } from 'astro'
import { getBooks } from '../../sanity'
import type { Locale } from '../../i18n/locale'

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url)
  const locale = (url.searchParams.get('locale') || 'pl') as Locale
  // Ignoruj parametry cache-busting
  url.searchParams.delete('_t')

  try {
    const books = await getBooks(locale)

    return new Response(JSON.stringify({ books }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.error('Error fetching books:', error)
    return new Response(JSON.stringify({ error: 'Failed to fetch books' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}