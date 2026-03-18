import {defineArrayMember, defineField} from 'sanity'

export const childLinkFields = [
  defineField({
    name: 'label',
    title: 'Label',
    type: 'string',
    validation: (Rule) => Rule.required(),
  }),
  defineField({
    name: 'href',
    title: 'Href',
    type: 'string',
    validation: (Rule) => Rule.required(),
  }),
]

export const ctaLinkFields = [
  ...childLinkFields,
  defineField({
    name: 'tone',
    title: 'Tone',
    type: 'string',
    initialValue: 'secondary',
    options: {
      list: [
        {title: 'Primary', value: 'primary'},
        {title: 'Secondary', value: 'secondary'},
      ],
      layout: 'radio',
    },
  }),
]

export const childLinkMember = defineArrayMember({
  name: 'childLink',
  title: 'Child Link',
  type: 'object',
  fields: childLinkFields,
})

export const ctaLinkMember = defineArrayMember({
  name: 'ctaLink',
  title: 'CTA Link',
  type: 'object',
  fields: ctaLinkFields,
})

export const navLinkMember = defineArrayMember({
  name: 'navLink',
  title: 'Navigation Link',
  type: 'object',
  fields: [
    ...childLinkFields,
    defineField({
      name: 'children',
      title: 'Children',
      type: 'array',
      of: [childLinkMember],
    }),
  ],
})

export const cardMember = defineArrayMember({
  name: 'card',
  title: 'Card',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'href',
      title: 'Href',
      type: 'string',
    }),
    defineField({
      name: 'anchor',
      title: 'Anchor',
      type: 'string',
    }),
  ],
})

export const galleryImageMember = defineArrayMember({
  name: 'galleryImage',
  title: 'Gallery Image',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'alt',
      title: 'Alt Text',
      type: 'string',
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
    }),
  ],
})

export const researchSectionMember = defineArrayMember({
  name: 'researchSection',
  title: 'Research Section',
  type: 'object',
  fields: [
    defineField({
      name: 'anchor',
      title: 'Anchor',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
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
      name: 'body',
      title: 'Body (Markdown)',
      type: 'text',
      rows: 10,
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'imageAlt',
      title: 'Image Alt',
      type: 'string',
    }),
    defineField({
      name: 'imageCaption',
      title: 'Image Caption',
      type: 'string',
    }),
    defineField({
      name: 'cards',
      title: 'Cards',
      type: 'array',
      of: [cardMember],
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      of: [galleryImageMember],
    }),
  ],
})
