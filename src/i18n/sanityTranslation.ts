import type { Book } from '../sanity'
import type { Locale } from './locale'

const GOOGLE_TRANSLATE_ENDPOINT = 'https://translate.googleapis.com/translate_a/single'

const translationCache = new Map<string, string>()

const buildCacheKey = (locale: Locale, text: string) => `${locale}:${text}`

const shouldTranslate = (value?: string) => Boolean(value && value.trim())

const translateText = async (text: string, locale: Locale) => {
  if (!shouldTranslate(text) || locale === 'pl') {
    return text
  }

  const cacheKey = buildCacheKey(locale, text)
  const cached = translationCache.get(cacheKey)
  if (cached) {
    console.log(`Cached translation for "${text}" -> "${cached}"`)
    return cached
  }

  try {
    console.log(`Translating "${text}" to ${locale}`)
    const params = new URLSearchParams({
      client: 'gtx',
      sl: 'auto',
      tl: locale,
      dt: 't',
      q: text,
    })

    const response = await fetch(`${GOOGLE_TRANSLATE_ENDPOINT}?${params.toString()}`, {
      headers: {
        Accept: 'application/json',
      },
    })

    if (!response.ok) {
      console.log(`Translation failed for "${text}": ${response.status}`)
      return text
    }

    const payload = (await response.json()) as unknown
    if (!Array.isArray(payload) || !Array.isArray(payload[0])) {
      console.log(`Invalid response for "${text}":`, payload)
      return text
    }

    const translated = payload[0]
      .map((part) => (Array.isArray(part) ? part[0] : ''))
      .filter((part): part is string => typeof part === 'string' && part.length > 0)
      .join('')

    console.log(`Translated "${text}" -> "${translated}"`)
    const value = translated || text
    translationCache.set(cacheKey, value)
    return value
  } catch (error) {
    console.error(`Translation error for "${text}":`, error)
    return text
  }
}

const translatedFields: Array<keyof Book> = [
  'language',
  'region',
  'country',
  'continent',
  'author',
  'possessionDate',
  'receivedFrom',
  'notes',
]

export const translateBook = async (book: Book, locale: Locale): Promise<Book> => {
  // Zawsze tworzymy kopię, żeby nie mutować oryginalnego obiektu
  const translatedBook: Book = { ...book }

  if (locale === 'pl') {
    return translatedBook
  }

  const translatedEntries = await Promise.all(
    translatedFields.map(async (field) => {
      const originalValue = book[field]
      if (typeof originalValue !== 'string' || !originalValue.trim()) {
        return [field, originalValue] as const
      }

      const translatedValue = await translateText(originalValue, locale)
      return [field, translatedValue] as const
    })
  )

  translatedEntries.forEach(([field, value]) => {
    switch (field) {
      case 'language':
        translatedBook.language = value as string | undefined
        break
      case 'region':
        translatedBook.region = value as string | undefined
        break
      case 'country':
        translatedBook.country = value as string | undefined
        break
      case 'continent':
        translatedBook.continent = value as string | undefined
        break
      case 'author':
        translatedBook.author = value as string | undefined
        break
      case 'possessionDate':
        translatedBook.possessionDate = value as string | undefined
        break
      case 'receivedFrom':
        translatedBook.receivedFrom = value as string | undefined
        break
      case 'notes':
        translatedBook.notes = value as string | undefined
        break
      default:
        break
    }
  })

  return translatedBook
}

export const translateBooks = async (books: Book[], locale: Locale): Promise<Book[]> => {
  if (books.length === 0) {
    return []
  }

  if (locale === 'pl') {
    // Zwracamy kopię tablicy z kopiami obiektów
    return books.map((book) => ({ ...book }))
  }

  return Promise.all(books.map((book) => translateBook(book, locale)))
}
