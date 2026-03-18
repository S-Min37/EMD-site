import {defineField, defineType} from 'sanity'

import {cardMember, ctaLinkMember, galleryImageMember} from './objects'

export const homePageType = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
    }),
    defineField({
      name: 'title',
      title: 'Hero Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Hero Description',
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
      name: 'heroImageCaption',
      title: 'Hero Image Caption',
      type: 'string',
    }),
    defineField({
      name: 'heroCtas',
      title: 'Hero Buttons',
      type: 'array',
      of: [ctaLinkMember],
    }),
    defineField({
      name: 'labGallery',
      title: 'Lab Gallery',
      type: 'array',
      of: [galleryImageMember],
    }),
    defineField({
      name: 'researchTitle',
      title: 'Research Section Title',
      type: 'string',
      initialValue: 'Research Areas',
    }),
    defineField({
      name: 'researchIntro',
      title: 'Research Section Intro',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'researchCards',
      title: 'Research Cards',
      type: 'array',
      of: [cardMember],
    }),
    defineField({
      name: 'strengthsTitle',
      title: 'Strengths Title',
      type: 'string',
    }),
    defineField({
      name: 'strengthsIntro',
      title: 'Strengths Intro',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'strengths',
      title: 'Strengths',
      type: 'array',
      of: [cardMember],
    }),
    defineField({
      name: 'newsTitle',
      title: 'News Section Title',
      type: 'string',
      initialValue: 'Latest News',
    }),
    defineField({
      name: 'newsIntro',
      title: 'News Section Intro',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'peopleTitle',
      title: 'People Section Title',
      type: 'string',
      initialValue: 'People',
    }),
    defineField({
      name: 'peopleIntro',
      title: 'People Section Intro',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'hiringTitle',
      title: 'Hiring Box Title',
      type: 'string',
    }),
    defineField({
      name: 'hiringDescription',
      title: 'Hiring Box Description',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'hiringCtas',
      title: 'Hiring Buttons',
      type: 'array',
      of: [ctaLinkMember],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Home Page',
      }
    },
  },
})
