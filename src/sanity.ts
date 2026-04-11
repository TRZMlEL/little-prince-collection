import { sanityClient } from 'sanity:client'
import { translateBook, translateBooks } from './i18n/sanityTranslation'
import type { Locale } from './i18n/locale'

export interface Book {
  isbn: string
  cover?: string
  language?: string
  region?: string
  country?: string
  continent?: string
  publisher?: string
  translator?: string
  title?: string
  year?: number
  author?: string
  possessionDate?: string
  receivedFrom?: string
  notes?: string
  otherCovers?: string[]
}

const BOOKS_QUERY = `
*[_type == "book" && defined(isbn)] | order(language asc) {
  isbn,
  "cover": select(
    defined(cover.asset) => cover.asset->url,
    defined(cover) => cover,
    null
  ),
  language,
  region,
  country,
  continent,
  publisher,
  translator,
  title,
  year,
  author,
  possessionDate,
  "receivedFrom": select(
    receivedFrom.visibleToAll != false => receivedFrom.value,
    null
  ),
  "notes": select(
    notes.visibleToAll != false => notes.value,
    null
  ),
  "otherCovers": select(
    defined(otherCovers) => otherCovers[]{
      "url": select(
        defined(asset) => asset->url,
        defined(url) => url,
        null
      )
    }[].url,
    []
  )
}
`

const BOOK_BY_ISBN_QUERY = `
*[_type == "book" && isbn == $isbn][0] {
  isbn,
  "cover": select(
    defined(cover.asset) => cover.asset->url,
    defined(cover) => cover,
    null
  ),
  language,
  region,
  country,
  continent,
  publisher,
  translator,
  title,
  year,
  author,
  possessionDate,
  "receivedFrom": select(
    receivedFrom.visibleToAll != false => receivedFrom.value,
    null
  ),
  "notes": select(
    notes.visibleToAll != false => notes.value,
    null
  ),
  "otherCovers": select(
    defined(otherCovers) => otherCovers[]{
      "url": select(
        defined(asset) => asset->url,
        defined(url) => url,
        null
      )
    }[].url,
    []
  )
}
`

const ISBN_PATHS_QUERY = `
*[_type == "book" && defined(isbn)]{ "isbn": isbn }
`

const normalizeCover = (cover?: string) => {
  if (!cover) {
    return ''
  }

  if (/^https?:\/\//i.test(cover)) {
    return cover
  }

  if (cover.startsWith('/')) {
    return cover
  }

  return `/${cover}`
}

const normalizeBook = (book: Partial<Book>): Book => ({
  isbn: String(book.isbn ?? ''),
  cover: normalizeCover(book.cover),
  language: book.language ?? '',
  region: book.region ?? '',
  country: book.country ?? '',
  continent: book.continent ?? '',
  publisher: book.publisher ?? '',
  translator: book.translator ?? '',
  title: book.title ?? '',
  year: book.year ? Number(book.year) : undefined,
  author: book.author ?? 'Antoine de Saint-Exupéry',
  possessionDate: book.possessionDate ?? '',
  receivedFrom: book.receivedFrom ?? '',
  notes: book.notes ?? '',
  otherCovers: Array.isArray(book.otherCovers)
    ? book.otherCovers.filter((item) => typeof item === 'string')
    : [],
})

export const getBooks = async (locale: Locale = 'pl') => {
  const result = await sanityClient.fetch<Partial<Book>[]>(BOOKS_QUERY)
  const books = (result || []).map(normalizeBook)
  return translateBooks(books, locale)
}

export const getBookByIsbn = async (isbn: string, locale: Locale = 'pl') => {
  const result = await sanityClient.fetch<Partial<Book> | null>(BOOK_BY_ISBN_QUERY, { isbn })
  if (!result) {
    return null
  }

  const book = normalizeBook(result)
  return translateBook(book, locale)
}

export const getBookPaths = async () => {
  const records = await sanityClient.fetch<{ isbn?: string }[]>(ISBN_PATHS_QUERY)
  return (records || [])
    .map((record) => String(record?.isbn || '').trim())
    .filter(Boolean)
}

export const resolveAssetUrl = (value?: string) => {
  if (!value) {
    return ''
  }

  if (/^https?:\/\//i.test(value)) {
    return value
  }

  const base = import.meta.env.BASE_URL || '/'
  const normalizedBase = base.endsWith('/') ? base : `${base}/`
  const normalizedValue = value.startsWith('/') ? value.slice(1) : value
  return `${normalizedBase}${normalizedValue}`
}
