import React from 'react'
import './styles.css'
import { LivePreviewProvider } from '@/components/LivePreviewProvider'

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body>
        <LivePreviewProvider>
          <main>{children}</main>
        </LivePreviewProvider>
      </body>
    </html>
  )
}
