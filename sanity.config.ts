import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {schemaTypes} from './sanity/schemaTypes'
import {structure} from './sanity/structure'

export default defineConfig({
  name: 'default',
  title: 'EMD Lab',
  projectId: 'afv9fztg',
  dataset: 'production',
  basePath: '/studio',
  plugins: [deskTool({structure})],
  schema: {
    types: schemaTypes,
  },
})
