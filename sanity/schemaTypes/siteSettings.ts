import {defineField, defineType} from 'sanity'

import {ctaLinkMember, navLinkMember} from './objects'

export const siteSettingsType = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Short Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'longName',
      title: 'Long Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'institution',
      title: 'Institution',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'locale',
      title: 'Locale',
      type: 'string',
      initialValue: 'ko-KR',
    }),
    defineField({
      name: 'url',
      title: 'Site URL',
      type: 'url',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Default Description',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'addressKo',
      title: 'Address (Korean)',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'addressEn',
      title: 'Address (English)',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'navItems',
      title: 'Navigation',
      type: 'array',
      of: [navLinkMember],
    }),
    defineField({
      name: 'footerLinks',
      title: 'Footer Links',
      type: 'array',
      of: [ctaLinkMember],
    }),
    defineField({
      name: 'footerNote',
      title: 'Footer Note',
      type: 'text',
      rows: 3,
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Site Settings',
      }
    },
  },
})
