import {defineField, defineType} from 'sanity'

import {ctaLinkMember, researchSectionMember} from './objects'

export const researchPageType = defineType({
  name: 'researchPage',
  title: 'Research Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'intro',
      title: 'Intro',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'sections',
      title: 'Research Sections',
      type: 'array',
      of: [researchSectionMember],
    }),
    defineField({
      name: 'closingTitle',
      title: 'Closing Title',
      type: 'string',
    }),
    defineField({
      name: 'closingBody',
      title: 'Closing Body',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'closingLinks',
      title: 'Closing Links',
      type: 'array',
      of: [ctaLinkMember],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Research Page',
      }
    },
  },
})
