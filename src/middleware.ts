import { defineMiddleware } from 'astro:middleware'
import {
  LOCALE_COOKIE_NAME,
  detectLocaleFromAcceptLanguage,
  resolveLocale,
} from './i18n/locale'

export const onRequest = defineMiddleware(async (context, next) => {
  const cookieLocale = context.cookies.get(LOCALE_COOKIE_NAME)?.value
  const acceptedLocale = detectLocaleFromAcceptLanguage(context.request.headers.get('accept-language'))
  const locale = resolveLocale(cookieLocale || acceptedLocale)

  context.locals.locale = locale

  if (cookieLocale !== locale) {
    context.cookies.set(LOCALE_COOKIE_NAME, locale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
      httpOnly: false,
    })
  }

  const response = await next()

  response.headers.set(
    'X-Robots-Tag',
    'noindex, nofollow, noarchive, nosnippet, noimageindex, notranslate'
  )

  response.headers.set('Content-Language', locale)

  return response
})
