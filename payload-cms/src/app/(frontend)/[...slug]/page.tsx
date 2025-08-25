import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import { RenderPage } from '@/components/RenderPage'
import { LivePreviewProvider } from '@/components/LivePreviewProvider'

type Props = {
  params: Promise<{
    slug?: string[]
  }>
}

export default async function Page({ params }: Props) {
  const { slug } = await params
  const payload = await getPayload({ config })

  // Convert slug array to string
  const slugString = slug ? slug.join('/') : 'home'

  try {
    const pageQuery = await payload.find({
      collection: 'pages',
      where: {
        slug: {
          equals: slugString,
        },
      },
      limit: 1,
    })

    const page = pageQuery.docs[0]

    if (!page) {
      return notFound()
    }

    return (
      <LivePreviewProvider>
        <RenderPage data={page} />
      </LivePreviewProvider>
    )
  } catch (error) {
    console.error('Error fetching page:', error)
    return notFound()
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config })
  const slugString = slug ? slug.join('/') : 'home'

  try {
    const pageQuery = await payload.find({
      collection: 'pages',
      where: {
        slug: {
          equals: slugString,
        },
      },
      limit: 1,
    })

    const page = pageQuery.docs[0]

    if (!page) {
      return {
        title: 'Page Not Found',
      }
    }

    return {
      title: page.title || 'Untitled Page',
    }
  } catch {
    return {
      title: 'Page Not Found',
    }
  }
}
