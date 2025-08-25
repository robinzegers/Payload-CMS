'use client'

import React from 'react'

export const useLivePreviewData = <T extends Record<string, any>>(initialData: T): T => {
  const [livePreviewData, setLivePreviewData] = React.useState<T>(initialData)

  React.useEffect(() => {
    // Listen for live preview updates
    const handleLivePreviewUpdate = (event: MessageEvent) => {
      if (event.data && event.data.type === 'payload-live-preview') {
        setLivePreviewData(event.data.data || initialData)
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('message', handleLivePreviewUpdate)

      return () => {
        window.removeEventListener('message', handleLivePreviewUpdate)
      }
    }
  }, [initialData])

  return livePreviewData
}
