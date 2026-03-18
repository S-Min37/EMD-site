import {defineField, defineType} from 'sanity'

import {cardMember, ctaLinkMember, galleryImageMember} from './objects'

export const pageType = defineType({
  name: 'page',
  title: 'Pages',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'route',
      title: 'Route',
      type: 'string',
      description: 'Use values like "courses", "contact", or "publications/journals".',
      validation: (Rule) =>
        Rule.required()
          .regex(/^[a-z0-9-]+(?:\/[a-z0-9-]+)*$/, {
            name: 'route',
            invert: false,
          })
          .error('Use lower-case route segments separated by "/" only.'),
    }),
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
    }),
    defineField({
      name: 'intro',
      title: 'Intro',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'heroImageAlt',
      title: 'Hero Image Alt',
      type: 'string',
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      of: [galleryImageMember],
    }),
    defineField({
      name: 'cards',
      title: 'Cards',
      type: 'array',
      of: [cardMember],
    }),
    defineField({
      name: 'ctas',
      title: 'Top Buttons',
      type: 'array',
      of: [ctaLinkMember],
    }),
    defineField({
      name: 'body',
      title: 'Body (Markdown)',
      type: 'text',
      rows: 30,
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      rows: 3,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'route',
    },
  },
})
