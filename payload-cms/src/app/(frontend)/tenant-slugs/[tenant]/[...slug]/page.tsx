import type { Metadata } from 'next'
import type { Where } from 'payload'
import { headers as getHeaders } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import { RenderPage } from '@/components/RenderPage'
import { LivePreviewProvider } from '@/components/LivePreviewProvider'

type Props = {
  params: Promise<{
    tenant: string
    slug?: string[]
  }>
}

export default async function TenantPage({ params }: Props) {
  const { tenant, slug } = await params
  const headers = await getHeaders()
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers })

  try {
    // First, verify the tenant exists and user has access
    const tenantsQuery = await payload.find({
      collection: 'tenants',
      overrideAccess: false,
      user,
      where: {
        slug: {
          equals: tenant,
        },
      },
    })

    // If no tenant is found, the user does not have access
    if (tenantsQuery.docs.length === 0) {
      redirect(
        `/tenant-slugs/${tenant}/login?redirect=${encodeURIComponent(
          `/tenant-slugs/${tenant}${slug ? `/${slug.join('/')}` : ''}`,
        )}`,
      )
    }

    // Determine the page slug constraint
    const slugConstraint: Where = slug
      ? {
          slug: {
            equals: slug.join('/'),
          },
        }
      : {
          or: [
            {
              slug: {
                equals: '',
              },
            },
            {
              slug: {
                equals: 'home',
              },
            },
            {
              slug: {
                exists: false,
              },
            },
          ],
        }

    // Find the page for this tenant
    const pageQuery = await payload.find({
      collection: 'pages',
      overrideAccess: false,
      user,
      where: {
        and: [
          {
            'tenant.slug': {
              equals: tenant,
            },
          },
          slugConstraint,
        ],
      },
    })

    const pageData = pageQuery.docs?.[0]

    // If no page is found, return 404
    if (!pageData) {
      return notFound()
    }

    // Render the page with live preview support
    return (
      <LivePreviewProvider>
        <RenderPage data={pageData} />
      </LivePreviewProvider>
    )
  } catch (error) {
    console.error('Error fetching tenant page:', error)
    // If the query fails, it means the user did not have access
    redirect(
      `/tenant-slugs/${tenant}/login?redirect=${encodeURIComponent(
        `/tenant-slugs/${tenant}${slug ? `/${slug.join('/')}` : ''}`,
      )}`,
    )
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tenant, slug } = await params
  const payload = await getPayload({ config })

  try {
    const slugConstraint: Where = slug
      ? {
          slug: {
            equals: slug.join('/'),
          },
        }
      : {
          or: [
            {
              slug: {
                equals: 'home',
              },
            },
            {
              slug: {
                exists: false,
              },
            },
          ],
        }

    const pageQuery = await payload.find({
      collection: 'pages',
      where: {
        and: [
          {
            'tenant.slug': {
              equals: tenant,
            },
          },
          slugConstraint,
        ],
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
