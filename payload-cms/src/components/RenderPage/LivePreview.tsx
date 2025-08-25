'use client'

import type { Page } from '@/payload-types'
import React from 'react'

// Simple rich text renderer for Lexical content
const renderRichText = (content: any): React.ReactNode => {
  if (!content || !content.root) {
    return null
  }

  const renderNode = (node: any, index: number = 0): React.ReactNode => {
    if (node.type === 'paragraph') {
      return (
        <p key={index}>
          {node.children?.map((child: any, childIndex: number) => renderNode(child, childIndex))}
        </p>
      )
    }

    if (node.type === 'text') {
      let element = <span key={index}>{node.text}</span>

      if (node.format & 1) {
        // Bold
        element = <strong key={index}>{node.text}</strong>
      }
      if (node.format & 2) {
        // Italic
        element = <em key={index}>{node.text}</em>
      }

      return element
    }

    if (node.type === 'heading') {
      const tag = node.tag || 1
      switch (tag) {
        case 1:
          return (
            <h1 key={index}>
              {node.children?.map((child: any, childIndex: number) =>
                renderNode(child, childIndex),
              )}
            </h1>
          )
        case 2:
          return (
            <h2 key={index}>
              {node.children?.map((child: any, childIndex: number) =>
                renderNode(child, childIndex),
              )}
            </h2>
          )
        case 3:
          return (
            <h3 key={index}>
              {node.children?.map((child: any, childIndex: number) =>
                renderNode(child, childIndex),
              )}
            </h3>
          )
        case 4:
          return (
            <h4 key={index}>
              {node.children?.map((child: any, childIndex: number) =>
                renderNode(child, childIndex),
              )}
            </h4>
          )
        case 5:
          return (
            <h5 key={index}>
              {node.children?.map((child: any, childIndex: number) =>
                renderNode(child, childIndex),
              )}
            </h5>
          )
        case 6:
          return (
            <h6 key={index}>
              {node.children?.map((child: any, childIndex: number) =>
                renderNode(child, childIndex),
              )}
            </h6>
          )
        default:
          return (
            <h2 key={index}>
              {node.children?.map((child: any, childIndex: number) =>
                renderNode(child, childIndex),
              )}
            </h2>
          )
      }
    }

    return null
  }

  return (
    <div>{content.root.children?.map((child: any, index: number) => renderNode(child, index))}</div>
  )
}

export const RenderPageWithLivePreview = ({ initialData }: { initialData: Page }) => {
  const [livePreviewData, setLivePreviewData] = React.useState<Page>(initialData)
  const [isLoading, setIsLoading] = React.useState(false)

  React.useEffect(() => {
    let cleanup: (() => void) | undefined

    const loadLivePreview = async () => {
      try {
        // Import the useLivePreview for potential future use
        await import('@payloadcms/live-preview-react')

        // The hook needs to be called in the component body, not in useEffect
        // So we'll implement manual live preview listening
        const handleLivePreviewUpdate = (event: MessageEvent) => {
          if (event.data && event.data.type === 'payload-live-preview') {
            setIsLoading(true)
            setLivePreviewData(event.data.data || initialData)
            setTimeout(() => setIsLoading(false), 100) // Brief loading state
          }
        }

        if (typeof window !== 'undefined') {
          window.addEventListener('message', handleLivePreviewUpdate)

          cleanup = () => {
            window.removeEventListener('message', handleLivePreviewUpdate)
          }
        }
      } catch (error) {
        console.warn('Live preview hook not available:', error)
      }
    }

    loadLivePreview()

    return () => {
      if (cleanup) cleanup()
    }
  }, [initialData])

  return (
    <React.Fragment>
      <form action="/api/users/logout" method="post">
        <button type="submit">Logout</button>
      </form>

      {isLoading && (
        <div
          style={{
            position: 'fixed',
            top: '10px',
            right: '10px',
            background: '#4a90e2',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '4px',
            zIndex: 1000,
          }}
        >
          🔄 Updating preview...
        </div>
      )}

      <div>
        <h1>{livePreviewData.title}</h1>
        {livePreviewData.content && renderRichText(livePreviewData.content)}
        {!livePreviewData.content && <p>No content available</p>}
      </div>

      <div
        style={{
          marginTop: '2rem',
          padding: '1rem',
          backgroundColor: '#f0f8ff',
          borderRadius: '4px',
          border: '2px solid #4a90e2',
        }}
      >
        <h3>🔴 Live Preview Enabled</h3>
        <p>This page will automatically update when you make changes in the admin panel.</p>
        <details>
          <summary>Debug Info (Click to expand)</summary>
          <pre style={{ fontSize: '12px', overflow: 'auto', marginTop: '1rem' }}>
            {JSON.stringify(livePreviewData, null, 2)}
          </pre>
        </details>
      </div>
    </React.Fragment>
  )
}
