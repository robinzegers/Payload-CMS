import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import { RenderPageWithLivePreview } from '@/components/RenderPage/LivePreview'
import { LivePreviewProvider } from '@/components/LivePreviewProvider'

type Props = {
  searchParams: Promise<{
    slug?: string
    id?: string
  }>
}

export default async function PreviewPage({ searchParams }: Props) {
  const { slug, id } = await searchParams
  const payload = await getPayload({ config })

  try {
    let page

    // If we have an ID, fetch by ID (for drafts)
    if (id) {
      page = await payload.findByID({
        collection: 'pages',
        id,
        draft: true, // This allows fetching draft content
      })
    } else {
      // Otherwise fetch by slug
      const slugString = slug || 'home'
      const pageQuery = await payload.find({
        collection: 'pages',
        where: {
          slug: {
            equals: slugString,
          },
        },
        limit: 1,
        draft: true, // This allows fetching draft content
      })
      page = pageQuery.docs[0]
    }

    if (!page) {
      return notFound()
    }

    return (
      <LivePreviewProvider>
        <RenderPageWithLivePreview initialData={page} />
      </LivePreviewProvider>
    )
  } catch (error) {
    console.error('Error fetching page for preview:', error)
    return notFound()
  }
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { slug, id } = await searchParams

  return {
    title: `Preview: ${slug || id || 'Page'}`,
    robots: 'noindex, nofollow', // Prevent search engines from indexing preview pages
  }
}
