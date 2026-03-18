import dynamicImport from 'next/dynamic'

const StudioClient = dynamicImport(() => import('./StudioClient'), {
  ssr: false,
})

export const dynamic = 'force-static'

export {metadata, viewport} from 'next-sanity/studio'

export default function StudioPage() {
  return <StudioClient />
}
