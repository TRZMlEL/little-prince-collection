export const LOCALES = ['pl', 'en'] as const

export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'pl'
export const LOCALE_COOKIE_NAME = 'site-locale'

export const isLocale = (value: unknown): value is Locale =>
  typeof value === 'string' && (LOCALES as readonly string[]).includes(value)

export const resolveLocale = (value: unknown): Locale => {
  if (!value || typeof value !== 'string') {
    return DEFAULT_LOCALE
  }

  const normalized = value.toLowerCase().trim().slice(0, 2)
  return isLocale(normalized) ? normalized : DEFAULT_LOCALE
}

export const detectLocaleFromAcceptLanguage = (headerValue: string | null): Locale => {
  if (!headerValue) {
    return DEFAULT_LOCALE
  }

  const normalized = headerValue.toLowerCase()
  if (normalized.includes('en')) {
    return 'en'
  }

  return DEFAULT_LOCALE
}
