import type { QueryParams } from '@sanity/client'
import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId, readToken } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token: readToken,
  perspective: 'published',
  useCdn: false,
})

export async function sanityFetch<T>({
  query,
  params = {},
  tags = [],
}: {
  query: string
  params?: QueryParams
  tags?: string[]
}) {
  return client.fetch<T>(query, params, {
    cache: 'no-store',
  })
}
