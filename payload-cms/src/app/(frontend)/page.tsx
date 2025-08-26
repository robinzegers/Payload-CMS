import { headers as getHeaders } from 'next/headers.js'
import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'
import React from 'react'
import { fileURLToPath } from 'url'

import config from '@/payload.config'
import './styles.css'

export default async function HomePage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  // Get all available campaigns/tenants
  const tenantsQuery = await payload.find({
    collection: 'tenants',
    limit: 100,
  })

  const tenants = tenantsQuery.docs

  const fileURL = `vscode://file/${fileURLToPath(import.meta.url)}`

  return (
    <div className="home">
      <div className="content">
        <picture>
          <source srcSet="https://raw.githubusercontent.com/payloadcms/payload/main/packages/ui/src/assets/payload-favicon.svg" />
          <Image
            alt="Payload Logo"
            height={65}
            src="https://raw.githubusercontent.com/payloadcms/payload/main/packages/ui/src/assets/payload-favicon.svg"
            width={65}
          />
        </picture>
        {!user && <h1>Welcome to your new project.</h1>}
        {user && <h1>Welcome back, {user.email}</h1>}

        {/* Campaign Selection */}
        {tenants.length > 0 && (
          <div style={{ marginTop: '2rem' }}>
            <h2>Available Campaigns</h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '1rem',
                marginTop: '1rem',
              }}
            >
              {tenants.map((tenant) => (
                <div
                  key={tenant.id}
                  style={{
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '1rem',
                    backgroundColor: '#f9f9f9',
                  }}
                >
                  <h3 style={{ margin: '0 0 0.5rem 0' }}>{tenant.name}</h3>
                  <p style={{ margin: '0 0 1rem 0', color: '#666', fontSize: '0.9rem' }}>
                    {tenant.gameSettings?.languages?.length || 0} language(s) supported
                  </p>

                  {/* Language options */}
                  {tenant.gameSettings?.languages && tenant.gameSettings.languages.length > 0 && (
                    <div style={{ marginBottom: '1rem' }}>
                      <p style={{ fontSize: '0.8rem', margin: '0 0 0.5rem 0', color: '#888' }}>
                        Available languages:
                      </p>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {tenant.gameSettings.languages.map((lang: any, index: number) => (
                          <Link
                            key={index}
                            href={`/home?tenant=${tenant.id}&locale=${lang.language}`}
                            style={{
                              padding: '0.25rem 0.5rem',
                              backgroundColor: '#007acc',
                              color: 'white',
                              textDecoration: 'none',
                              borderRadius: '4px',
                              fontSize: '0.8rem',
                            }}
                          >
                            {lang.language.toUpperCase()}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  <Link
                    href={`/home?tenant=${tenant.id}`}
                    style={{
                      display: 'inline-block',
                      padding: '0.5rem 1rem',
                      backgroundColor: '#333',
                      color: 'white',
                      textDecoration: 'none',
                      borderRadius: '4px',
                    }}
                  >
                    View Campaign
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="links">
          <a
            className="admin"
            href={payloadConfig.routes.admin}
            rel="noopener noreferrer"
            target="_blank"
          >
            Go to admin panel
          </a>
          <a
            className="docs"
            href="https://payloadcms.com/docs"
            rel="noopener noreferrer"
            target="_blank"
          >
            Documentation
          </a>
        </div>
      </div>
      <div className="footer">
        <p>Update this page by editing</p>
        <a className="codeLink" href={fileURL}>
          <code>app/(frontend)/page.tsx</code>
        </a>
      </div>
    </div>
  )
}
