import type { APIRoute } from 'astro'
import { getBookByIsbn } from '../../sanity'
import type { Locale } from '../../i18n/locale'

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url)
  const isbn = url.searchParams.get('isbn') || ''
  const locale = (url.searchParams.get('locale') || 'pl') as Locale

  if (!isbn.trim()) {
    return new Response(JSON.stringify({ error: 'Missing isbn' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const book = await getBookByIsbn(isbn, locale)
    return new Response(JSON.stringify({ book }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.error('Error fetching book by ISBN:', error)
    return new Response(JSON.stringify({ error: 'Failed to fetch book' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
