import React from 'react'
import Link from 'next/link'

type RouteParams = {
  tenant: string
}

export default async function LoginPage({ params }: { params: Promise<RouteParams> }) {
  const { tenant } = await params

  return (
    <div style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto' }}>
      <h1>Login to {tenant}</h1>
      <p>You need to log in to access this tenant&apos;s content.</p>
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
          }}
        >
          Go to Admin Panel
        </Link>
      </div>
      <div style={{ marginTop: '1rem' }}>
        <Link href="/" style={{ color: '#0070f3' }}>
          &larr; Back to Home
        </Link>
      </div>
    </div>
  )
}
