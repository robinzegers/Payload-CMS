import type { Page } from '@/payload-types'
import React from 'react'
import { LocalizedText, LanguageSwitcher } from '../LocalizationComponents'

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

export const RenderPage = ({ data }: { data: Page }) => {
  const isLandingPage = data.pageType === 'landing'

  return (
    <React.Fragment>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
        }}
      >
        <form action="/api/users/logout" method="post">
          <button type="submit">Logout</button>
        </form>
        <LanguageSwitcher className="language-switcher" />
      </div>

      <div className={isLandingPage ? 'landing-page' : 'standard-page'}>
        {isLandingPage ? (
          // Landing page layout
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: '#333' }}>
              <LocalizedText data={data} field="title" fallback="Page Title" />
            </h1>
            <LocalizedText data={data} field="landingDescription" fallback="" />
            {data.content && (
              <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'left' }}>
                {renderRichText(data.content)}
              </div>
            )}
          </div>
        ) : (
          // Standard page layout
          <div>
            <h1>
              <LocalizedText data={data} field="title" fallback="Page Title" />
            </h1>

            {/* Show appropriate description based on page type */}
            {data.pageType === 'loading' && (
              <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '2rem' }}>
                <LocalizedText data={data} field="loadingDescription" fallback="" />
              </p>
            )}

            {data.pageType === 'leaderboard' && (
              <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '2rem' }}>
                <LocalizedText data={data} field="leaderboardDescription" fallback="" />
              </p>
            )}

            {data.content && renderRichText(data.content)}
            {!data.content && <p>No content available</p>}
          </div>
        )}
      </div>

      <div
        style={{
          marginTop: '2rem',
          padding: '1rem',
          backgroundColor: '#f5f5f5',
          borderRadius: '4px',
        }}
      >
        <h3>Debug Info:</h3>
        <pre style={{ fontSize: '12px', overflow: 'auto' }}>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </React.Fragment>
  )
}
