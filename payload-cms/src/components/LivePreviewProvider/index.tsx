'use client'

import { useRouter } from 'next/navigation'
import React from 'react'

interface LivePreviewProviderProps {
  children: React.ReactNode
  serverURL?: string
}

export const LivePreviewProvider: React.FC<LivePreviewProviderProps> = ({
  children,
  serverURL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000',
}) => {
  const router = useRouter()
  const [RefreshComponent, setRefreshComponent] = React.useState<React.ComponentType<any> | null>(
    null,
  )

  React.useEffect(() => {
    const loadRefreshComponent = async () => {
      try {
        const { RefreshRouteOnSave } = await import('@payloadcms/live-preview-react')
        setRefreshComponent(() => RefreshRouteOnSave)
      } catch (error) {
        console.warn('Live preview refresh component not available:', error)
      }
    }
    loadRefreshComponent()
  }, [])

  return (
    <>
      {RefreshComponent && (
        <RefreshComponent serverURL={serverURL} refresh={() => router.refresh()} />
      )}
      {children}
    </>
  )
}
