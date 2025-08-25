# Media Setup for Production Deployment

This guide explains how to set up media uploads for production deployment using Vercel Blob storage.

## Problem

The default Payload CMS media collection stores files locally in the `public/media` directory. This works fine for development but fails in production because:

1. **Serverless platforms** (Vercel, Netlify) have read-only file systems
2. **Uploaded files are lost** between deployments
3. **Multiple server instances** can't share local files
4. **Static files** are not persisted across builds

## Solution

This project uses a dual-configuration approach:

- **Development**: Local file storage (`public/media`)
- **Production**: Vercel Blob storage (cloud-based)

## Setup Instructions

### 1. Vercel Blob Storage Setup

1. **Create a Vercel account** at [vercel.com](https://vercel.com)

2. **Create a Blob store:**
   - Go to your [Vercel Dashboard](https://vercel.com/dashboard)
   - Navigate to **Storage** → **Create Database** → **Blob**
   - Create a new blob store for your project

3. **Get your Blob token:**
   - In your blob store settings, find and copy the `BLOB_READ_WRITE_TOKEN`

### 2. Environment Variables

Add the following environment variable to your deployment platform:

```bash
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token_here
```

#### For Vercel:

1. Go to your project settings in Vercel
2. Navigate to **Environment Variables**
3. Add `BLOB_READ_WRITE_TOKEN` with your token value

#### For other platforms:

Add the environment variable according to your platform's documentation.

### 3. Testing Locally with Blob Storage (Optional)

To test Vercel Blob storage locally:

1. Create a `.env.local` file in your project root
2. Add your blob token:
   ```bash
   BLOB_READ_WRITE_TOKEN=your_token_here
   ```
3. Restart your development server

The application will automatically use Vercel Blob storage when the token is available.

## How It Works

The media configuration automatically switches between storage adapters:

### Development Mode

```typescript
// Uses local file storage
upload: {
  staticDir: '../public/media',
  // ... other config
}
```

### Production Mode

```typescript
// Uses Vercel Blob storage via plugin
plugins: [
  vercelBlobStorage({
    collections: {
      media: true,
    },
    token: process.env.BLOB_READ_WRITE_TOKEN!,
  }),
]
```

## File Structure

```
payload-cms/
├── src/
│   └── collections/
│       ├── Media.ts              # Local storage (development)
│       └── MediaWithCloud.ts     # Cloud storage (production)
├── public/
│   └── media/                    # Local media files (dev only)
├── .env.example                  # Environment variables template
└── MEDIA_SETUP.md               # This guide
```

## Migration from Local to Cloud

If you have existing media files in your local `public/media` directory that you want to move to production:

1. **Upload files manually** through the Payload admin panel after deployment
2. **Use Payload's import/export** functionality
3. **Write a migration script** to transfer files programmatically

## Troubleshooting

### Media uploads fail in production

- ✅ Check that `BLOB_READ_WRITE_TOKEN` is set correctly
- ✅ Verify the token has read/write permissions
- ✅ Check Vercel Blob storage limits and usage

### Files not showing in production

- ✅ Ensure files were uploaded after the cloud storage was configured
- ✅ Check browser console for any CORS or network errors
- ✅ Verify the Vercel Blob storage is accessible

### Local development issues

- ✅ Make sure `public/media` directory exists and is writable
- ✅ Check file permissions on your local system
- ✅ Restart the development server after config changes

## Additional Resources

- [Payload CMS Upload Documentation](https://payloadcms.com/docs/upload/overview)
- [Vercel Blob Storage Documentation](https://vercel.com/docs/storage/vercel-blob)
- [Payload Storage Adapters](https://payloadcms.com/docs/upload/storage-adapters)
