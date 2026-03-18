import {defineArrayMember, defineField, defineType} from 'sanity'

export const peopleType = defineType({
  name: 'people',
  title: 'People',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'name', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      description: 'Legacy fallback field for older records.',
    }),
    defineField({
      name: 'position',
      title: 'Position',
      type: 'string',
      description: 'Displayed on the public site. If blank, Role is used.',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      initialValue: 'Graduate',
    }),
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'photoUrl',
      title: 'Photo URL',
      type: 'url',
      description: 'Optional external or existing site image URL.',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
    }),
    defineField({
      name: 'interests',
      title: 'Interests',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
    }),
    defineField({
      name: 'links',
      title: 'Links',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'link',
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (Rule) => Rule.required(),
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'highlights',
      title: 'Highlights',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
    }),
    defineField({
      name: 'projects',
      title: 'Projects',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'personProject',
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'role',
              title: 'Role',
              type: 'string',
            }),
            defineField({
              name: 'period',
              title: 'Period',
              type: 'string',
            }),
            defineField({
              name: 'summary',
              title: 'Summary',
              type: 'text',
              rows: 3,
            }),
            defineField({
              name: 'link',
              title: 'Link',
              type: 'url',
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'publications',
      title: 'Selected Publications',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'selectedPublication',
          type: 'object',
          fields: [
            defineField({
              name: 'citation',
              title: 'Citation',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'link',
              title: 'Link',
              type: 'url',
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'body',
      title: 'Profile Body (Markdown)',
      type: 'text',
      rows: 18,
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      initialValue: 100,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'position',
      legacyRole: 'role',
      media: 'photo',
    },
    prepare({title, subtitle, legacyRole, media}) {
      return {
        title,
        subtitle: subtitle || legacyRole,
        media,
      }
    },
  },
})
