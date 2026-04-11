import { BookIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export const bookType = defineType({
  name: 'book',
  title: 'Wydania',
  type: 'document',
  icon: BookIcon,
  fields: [
    defineField({
      name: 'isbn',
      title: 'ISBN',
      description: 'Numer identyfikacyjny wydania (znajduje się na tylniej stronie okładki nad kodem kreskowym)',
      type: 'string',
      validation: (rule) =>
        rule
          .required()
          .custom(async (value, context) => {
            if (!value) {
              return 'ISBN jest wymagany'
            }

            const normalized = value.replace(/[-\s]/g, '')
            if (!/^\d{10,13}$/.test(normalized)) {
              return 'Użyj prawidłowego formatu ISBN-10 lub ISBN-13'
            }

            const client = context.getClient({ apiVersion: '2024-01-01' })
            const currentDocumentId = context.document._id
            // Normalize document ID so draft/published/version variants map to the same base document.
            const baseDocumentId = currentDocumentId?.replace(/^drafts\./, '').replace(/^versions\.[^.]+\./, '')

            const query = `*[_type == "book" && isbn == $isbn]`
            const allBooks = await client.fetch(query, { isbn: value })

            if (allBooks.length > 0) {
              // Treat as duplicate only if another document (different base ID) uses the same ISBN.
              const isDuplicate = allBooks.some(book => {
                const bookBaseId = book._id.replace(/^drafts\./, '').replace(/^versions\.[^.]+\./, '')
                return bookBaseId !== baseDocumentId
              })
              
              if (isDuplicate) {
                return 'Wydanie o tym ISBN jest już w kolekcji. Jeśli to inne wydanie tej samej książki, skontaktuj się z autorem strony.'
              }
            }

            return true
          }),
    }),
    defineField({
      name: 'title',
      title: 'Tytuł',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'cover',
      title: 'Okładka',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'language',
      title: 'Język',
      description: 'Język, w którym wydane jest to wydanie',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'region',
      title: 'Region',
      description: 'Region lub miasto, w któym zostało kupione to wydanie',
      type: 'string',
    }),
    defineField({
      name: 'country',
      title: 'Kraj',
      description: 'Kraj, w któym zostało kupione to wydanie',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'continent',
      title: 'Kontynent',
      description: 'Kontynent, na którym zostało kupione to wydanie',
      type: 'string',
      options: {
        list: [
          { title: 'Afryka', value: 'Afryka' },
          { title: 'Antarktyda', value: 'Antarktyda' },
          { title: 'Azja', value: 'Azja' },
          { title: 'Europa', value: 'Europa' },
          { title: 'Ameryka Północna', value: 'Ameryka Północna' },
          { title: 'Australia', value: 'Australia' },
          { title: 'Ameryka Południowa', value: 'Ameryka Południowa' },
        ],
        layout: 'dropdown',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'possessionDate',
      title: 'Data kupienia / otrzymania',
      type: 'date',
      options: {
        dateFormat: 'YYYY-MM-DD',
      },
    }),
    defineField({
      name: 'receivedFrom',
      title: 'Osoba od której otrzymałam to wydanie',
      description: 'Zostaw puste jeśli wydanie zostało kupione osobiście',
      type: 'object',
      fields: [
        defineField({
          name: 'value',
          title: 'Wartość',
          type: 'string',
        }),
        defineField({
          name: 'visibleToAll',
          title: 'Widoczne dla wszystkich',
          description: 'Jeśli odznaczone, wartość nie będzie widoczna na stronie',
          type: 'boolean',
          initialValue: true,
        }),
      ],
    }),
    defineField({
      name: 'translator',
      title: 'Tłumacz',
      type: 'string',
    }),
    defineField({
      name: 'publisher',
      title: 'Wydawnictwo',
      type: 'string',
    }),
    defineField({
      name: 'year',
      title: 'Rok wydania',
      type: 'number',
      validation: (rule) => rule.integer().min(1943).max(2200),
    }),
    defineField({
      name: 'notes',
      title: 'Notatki',
      description: 'Historia tego wydania, dlaczego jest specjalne, dedykacja, okoliczności pozyskania',
      type: 'object',
      fields: [
        defineField({
          name: 'value',
          title: 'Wartość',
          type: 'text',
          options: {
            rows: 5,
          },
        }),
        defineField({
          name: 'visibleToAll',
          title: 'Widoczne dla wszystkich',
          description: 'Jeśli odznaczone, wartość nie będzie widoczna na stronie',
          type: 'boolean',
          initialValue: true,
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'language',
      media: 'cover',
    },
    prepare(selection) {
      const { title, subtitle, media } = selection
      return {
        title: title || 'Wydanie bez tytułu',
        subtitle,
        media,
      }
    },
  },
})