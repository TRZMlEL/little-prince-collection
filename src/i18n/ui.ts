import type { Locale } from './locale'

type TranslationKey =
  | 'header.title'
  | 'header.skipToMain'
  | 'search.placeholder'
  | 'search.searchLabel'
  | 'search.clearLabel'
  | 'about.title'
  | 'about.count'
  | 'about.description'
  | 'footer.tagline'
  | 'footer.contact'
  | 'footer.rights'
  | 'footer.createdBy'
  | 'book.notFound'
  | 'book.otherCovers'
  | 'book.alt'
  | 'book.altThumb'
  | 'book.empty'
  | 'book.notesTitle'
  | 'book.notesEmpty'
  | 'book.table.isbn'
  | 'book.table.title'
  | 'book.table.language'
  | 'book.table.region'
  | 'book.table.country'
  | 'book.table.publisher'
  | 'book.table.translator'
  | 'book.table.year'
  | 'book.table.author'
  | 'book.table.possessionDate'
  | 'book.table.receivedFrom'
  | 'notFound.title'
  | 'notFound.heading'
  | 'notFound.description'
  | 'notFound.back'

const translations: Record<Locale, Record<TranslationKey, string>> = {
  pl: {
    'header.title': 'Kolekcja OK',
    'header.skipToMain': 'Przejdź do głównej treści',
    'search.placeholder': 'Szukaj po tytule, lokalizacji, języku lub ISBN',
    'search.searchLabel': 'Szukaj',
    'search.clearLabel': 'Wyczyść wyszukiwanie',
    'about.title': 'O kolekcji',
    'about.count': 'Ilość książek w kolekcji: {count}',
    'about.description': 'Zbieram wydania "Małego Księcia" Antoine\'a de Saint-Exupéry’ego z\u00A0całego świata, każde kupione lokalnie w\u00A0miejscowym języku. Lubię samodzielnie szukać tych książek w\u00A0trakcie podróży, ale\u00A0cieszą mnie też egzemplarze przywiezione przez\u00A0znajomych, jeśli pochodzą prosto z\u00A0danego kraju. Buduję kolekcję z\u00A0historią pełną\u00A0wspomnień.',
    'footer.tagline': 'Kolekcja tworzona z\u00A0podróży i\u00A0wspomnień',
    'footer.contact': 'Kontakt',
    'footer.rights': '©2026 Oliwia Kurzeja, Mateusz Trzmiel • Wszelkie prawa zastrzeżone',
    'footer.createdBy': 'Stworzone z miłością przez',
    'book.notFound': 'Nie znaleziono książki.',
    'book.otherCovers': 'Inne okładki',
    'book.alt': 'Okładka książki',
    'book.altThumb': 'Okładka książki',
    'book.empty': '—',
    'book.notesTitle': 'O egzemplarzu',
    'book.notesEmpty': 'Brak opisu dla tego wydania.',
    'book.table.isbn': 'ISBN',
    'book.table.title': 'Tytuł',
    'book.table.language': 'Język',
    'book.table.region': 'Region',
    'book.table.country': 'Kraj',
    'book.table.publisher': 'Wydawnictwo',
    'book.table.translator': 'Tłumaczenie',
    'book.table.year': 'Rok wydania',
    'book.table.author': 'Autor',
    'book.table.possessionDate': 'Data posiadania',
    'book.table.receivedFrom': 'Otrzymana od',
    'notFound.title': '404 – Nie znaleziono',
    'notFound.heading': 'Tej strony nie ma',
    'notFound.description': 'Strona, której szukasz, nie istnieje lub została przeniesiona.',
    'notFound.back': 'Wróć do kolekcji',
  },
  en: {
    'header.title': "OK Collection",
    'header.skipToMain': 'Skip to main content',
    'search.placeholder': 'Search by title, location, language or ISBN',
    'search.searchLabel': 'Search',
    'search.clearLabel': 'Clear search',
    'about.title': 'About the Collection',
    'about.count': 'Books in the collection: {count}',
    'about.description': 'I\u00A0collect editions of "The Little Prince" by\u00A0Antoine de Saint-Exupéry from around the world, each purchased locally in\u00A0the\u00A0language of\u00A0the\u00A0place. I\u00A0enjoy finding these books on\u00A0my\u00A0own\u00A0while traveling, but\u00A0I\u00A0also love copies brought by\u00A0friends when they come directly from a\u00A0given country. I\u00A0am building a\u00A0collection full of\u00A0stories and\u00A0memories.',
    'footer.tagline': 'A collection built from journeys and\u00A0memories',
    'footer.contact': 'Contact',
    'footer.rights': '©2026 Oliwia Kurzeja, Mateusz Trzmiel • All rights reserved',
    'footer.createdBy': 'Created with love by',
    'book.notFound': 'Book not found.',
    'book.otherCovers': 'Other covers',
    'book.alt': 'Book cover',
    'book.altThumb': 'Book cover',
    'book.empty': '—',
    'book.notesTitle': 'About this book',
    'book.notesEmpty': 'No description for this edition.',
    'book.table.isbn': 'ISBN',
    'book.table.title': 'Title',
    'book.table.language': 'Language',
    'book.table.region': 'Region',
    'book.table.country': 'Country',
    'book.table.publisher': 'Publisher',
    'book.table.translator': 'Translator',
    'book.table.year': 'Publication year',
    'book.table.author': 'Author',
    'book.table.possessionDate': 'Date acquired',
    'book.table.receivedFrom': 'Received from',
    'notFound.title': '404 – Not Found',
    'notFound.heading': 'Page not found',
    'notFound.description': 'The page you are looking for does not exist or has been moved.',
    'notFound.back': 'Back to the collection',
  },
}

export const t = (locale: Locale, key: TranslationKey, vars?: Record<string, string | number>) => {
  const message = translations[locale][key] ?? translations.pl[key] ?? key
  if (!vars) {
    return message
  }

  return Object.entries(vars).reduce((acc, [name, value]) => {
    return acc.replaceAll(`{${name}}`, String(value))
  }, message)
}
