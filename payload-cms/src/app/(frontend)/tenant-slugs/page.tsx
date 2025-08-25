import { getPayload } from 'payload'
import React from 'react'
import Link from 'next/link'
import config from '@/payload.config'
import type { Tenant, Page } from '@/payload-types'

export default async function TenantsIndexPage() {
  const payload = await getPayload({ config })

  try {
    const tenants = await payload.find({
      collection: 'tenants',
      limit: 100,
    })

    const pages = await payload.find({
      collection: 'pages',
      limit: 100,
    })

    return (
      <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <h1>Tenant-based Routing Test</h1>

        <div style={{ marginBottom: '2rem' }}>
          <h2>Available Tenants:</h2>
          <ul>
            {tenants.docs.map((tenant: Tenant) => (
              <li key={tenant.id} style={{ marginBottom: '0.5rem' }}>
                <strong>{tenant.name}</strong> (slug: {tenant.slug})
                <br />
                <small>Domain: {tenant.domain}</small>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h2>Available Pages:</h2>
          <ul>
            {pages.docs.map((page: Page) => (
              <li key={page.id} style={{ marginBottom: '0.5rem' }}>
                <strong>{page.title}</strong>
                <br />
                <small>
                  Slug: {page.slug} | Tenant:{' '}
                  {typeof page.tenant === 'object' && page.tenant ? page.tenant.slug : 'No tenant'}
                </small>
                <br />
                {typeof page.tenant === 'object' && page.tenant?.slug && (
                  <Link
                    href={`/tenant-slugs/${page.tenant.slug}/${page.slug}`}
                    style={{ color: '#0070f3', textDecoration: 'underline' }}
                  >
                    → View Page
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div style={{ backgroundColor: '#f5f5f5', padding: '1rem', borderRadius: '4px' }}>
          <h3>URL Examples:</h3>
          <ul>
            <li>
              <code>http://localhost:3001/tenant-slugs/gold/home-gold</code>
            </li>
            <li>
              <code>http://localhost:3001/tenant-slugs/silver/home-silver</code>
            </li>
            <li>
              <code>http://localhost:3001/tenant-slugs/bronze/home-bronze</code>
            </li>
          </ul>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <Link
            href="/admin"
            style={{
              display: 'inline-block',
              padding: '10px 20px',
              backgroundColor: '#0070f3',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px',
              marginRight: '1rem',
            }}
          >
            Go to Admin Panel
          </Link>
          <Link
            href="/"
            style={{
              display: 'inline-block',
              padding: '10px 20px',
              backgroundColor: '#666',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px',
            }}
          >
            Back to Home
          </Link>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error fetching data:', error)
    return (
      <div style={{ padding: '2rem' }}>
        <h1>Error Loading Tenant Data</h1>
        <p>There was an error loading the tenant and page information.</p>
        <pre style={{ background: '#f5f5f5', padding: '1rem', overflow: 'auto' }}>
          {String(error)}
        </pre>
        <Link href="/admin" style={{ color: '#0070f3' }}>
          Go to Admin Panel
        </Link>
      </div>
    )
  }
}
