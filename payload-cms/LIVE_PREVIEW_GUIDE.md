# Live Preview Setup

This Payload CMS project now includes live preview functionality that allows content editors to see their changes in real-time before publishing.

## Features Added

### 1. Live Preview Configuration

- **Admin Panel**: Live preview is enabled in the Payload admin interface
- **Draft Support**: Pages collection now supports drafts for better content workflow
- **Preview URLs**: Automatic generation of preview URLs based on your content structure

### 2. Frontend Components

- **RenderPage**: Basic page rendering component
- **RenderPageWithLivePreview**: Enhanced component with live preview capabilities
- **LivePreviewProvider**: Client-side provider for live preview functionality

### 3. Routes

- **Dynamic Pages**: `/[...slug]` - Renders published pages
- **Preview Route**: `/preview` - Dedicated preview route for draft content with live preview enabled

## How to Use

### 1. Start the Development Server

```bash
npm run dev
```

### 2. Access the Admin Panel

Navigate to `http://localhost:3000/admin` and log in.

### 3. Create or Edit a Page

1. Go to the Pages collection
2. Create a new page or edit an existing one
3. Add content using the rich text editor
4. Save as draft (don't publish yet)

### 4. Use Live Preview

1. In the admin panel, click the "Live Preview" button while editing a page
2. This will open a new tab/window showing your page with live preview enabled
3. Make changes to your content in the admin panel
4. See the changes appear instantly in the preview window

### 5. Preview URL Structure

- **Regular pages**: `http://localhost:3000/[slug]`
- **Preview pages**: `http://localhost:3000/preview?slug=[slug]&id=[page-id]`

## Technical Implementation

### Live Preview Provider

The `LivePreviewProvider` component:

- Listens for messages from the Payload admin interface
- Automatically refreshes the page when content changes
- Provides visual feedback when updates are being applied

### Rich Text Rendering

The project includes a custom Lexical rich text renderer that supports:

- Paragraphs
- Headings (H1-H6)
- Bold and italic text formatting
- Extensible for additional formatting options

### Environment Variables

Add these to your `.env` file:

```bash
NEXT_PUBLIC_PAYLOAD_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Visual Indicators

When live preview is active, you'll see:

- 🔴 **Live Preview Enabled** banner on the page
- **🔄 Updating preview...** notification when changes are being applied
- Debug information showing the current page data

## Multi-Tenant Support

This implementation is compatible with the multi-tenant setup:

- Preview URLs automatically adapt to tenant slugs or domains
- Live preview works across different tenant contexts
- Proper access control is maintained

## Troubleshooting

### Live Preview Not Working

1. Ensure you're using the preview route (`/preview`) for draft content
2. Check that the admin panel and preview are on the same domain
3. Verify your environment variables are set correctly

### Changes Not Appearing

1. Make sure you've saved your changes in the admin panel
2. Check the browser console for any JavaScript errors
3. Ensure the page is in draft status if using the preview route

## Next Steps

To enhance the live preview functionality further, consider:

1. Adding more rich text formatting options
2. Implementing component-based page building
3. Adding media and image support to the renderer
4. Creating custom preview templates for different page types
