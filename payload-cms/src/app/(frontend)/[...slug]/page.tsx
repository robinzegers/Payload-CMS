import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import { RenderPage } from '@/components/RenderPage'
import { LivePreviewProvider } from '@/components/LivePreviewProvider'
import { LocalizationProvider } from '@/components/LocalizationComponents'
import { getBestLocale } from '@/utilities/localization'

type Props = {
  params: Promise<{
    slug?: string[]
  }>
  searchParams: Promise<{
    tenant?: string
    locale?: string
  }>
}

export default async function Page({ params, searchParams }: Props) {
  const { slug } = await params
  const { tenant, locale } = await searchParams
  const payload = await getPayload({ config })

  // Convert slug array to string
  const slugString = slug ? slug.join('/') : 'home'

  // If no tenant is specified, show a tenant selection page or redirect
  if (!tenant) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>Please select a campaign</h1>
        <p>Add ?tenant=CAMPAIGN_ID to the URL to view campaign content.</p>
      </div>
    )
  }

  try {
    // Get the best locale for this tenant
    const bestLocale = locale ? await getBestLocale(payload, tenant, locale) : 'en'

    const pageQuery = await payload.find({
      collection: 'pages',
      where: {
        and: [{ slug: { equals: slugString } }, { tenant: { equals: tenant } }],
      },
      locale: bestLocale as any,
      fallbackLocale: 'en',
      limit: 1,
    })

    const page = pageQuery.docs[0]

    if (!page) {
      return notFound()
    }

    return (
      <LocalizationProvider tenant={tenant} locale={bestLocale} fallbackLocale="en">
        <LivePreviewProvider>
          <RenderPage data={page} />
        </LivePreviewProvider>
      </LocalizationProvider>
    )
  } catch (error) {
    console.error('Error fetching page:', error)
    return notFound()
  }
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug } = await params
  const { tenant, locale } = await searchParams
  const payload = await getPayload({ config })
  const slugString = slug ? slug.join('/') : 'home'

  if (!tenant) {
    return {
      title: 'Campaign Selection Required',
    }
  }

  try {
    const bestLocale = locale ? await getBestLocale(payload, tenant, locale) : 'en'

    const pageQuery = await payload.find({
      collection: 'pages',
      where: {
        and: [{ slug: { equals: slugString } }, { tenant: { equals: tenant } }],
      },
      locale: bestLocale as any,
      fallbackLocale: 'en',
      limit: 1,
    })

    const page = pageQuery.docs[0]

    if (!page) {
      return {
        title: 'Page Not Found',
      }
    }

    // Get localized title
    const title =
      typeof page.title === 'object' && page.title[bestLocale]
        ? page.title[bestLocale]
        : page.title || 'Untitled Page'

    return {
      title: title as string,
    }
  } catch {
    return {
      title: 'Page Not Found',
    }
  }
}
