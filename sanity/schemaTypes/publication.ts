import {defineField, defineType} from 'sanity'

export const publicationType = defineType({
  name: 'publication',
  title: 'Publications',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Body (Markdown)',
      type: 'text',
      rows: 30,
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
  },
})
