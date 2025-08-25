// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { multiTenantPlugin } from '@payloadcms/plugin-multi-tenant'
import type { Config } from './payload-types'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { MediaWithCloud } from './collections/MediaWithCloud'
import { Pages } from './collections/Pages'
import { Navigation } from './collections/Navigation'
import { Tenants } from './collections/Tenants'
import { isSuperAdmin, getUserTenantIDs } from './utilities/access'
import { seed } from './seed'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    livePreview: {
      url: ({ data, req: _req }) => {
        const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
        const host =
          process.env.NODE_ENV === 'production' ? 'payload-cms-pearl.vercel.app' : 'localhost:3000'

        // For multi-tenant setup, we need to determine the preview URL based on tenant
        if (data?.tenant) {
          // If using tenant slugs
          if (data.tenant.slug) {
            return `${protocol}://${host}/tenant-slugs/${data.tenant.slug}${data.slug ? `/${data.slug}` : ''}`
          }
          // If using tenant domains
          if (data.tenant.domain) {
            return `${protocol}://${data.tenant.domain}/tenant-domains/${data.slug || ''}`
          }
        }

        // Fallback to basic preview
        return `${protocol}://${host}/preview${data?.slug ? `/${data.slug}` : ''}`
      },
      collections: ['pages'],
    },
  },
  collections: [
    Users,
    Tenants,
    process.env.NODE_ENV === 'production' || process.env.BLOB_READ_WRITE_TOKEN
      ? MediaWithCloud
      : Media,
    Pages,
    Navigation,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  onInit: async (payload) => {
    if (process.env.SEED_DB === 'true') {
      await seed(payload)
    }
  },
  sharp,
  plugins: [
    payloadCloudPlugin(),
    // Only use Vercel Blob storage in production or when token is available
    ...(process.env.NODE_ENV === 'production' || process.env.BLOB_READ_WRITE_TOKEN
      ? [
          vercelBlobStorage({
            collections: {
              media: true,
            },
            token: process.env.BLOB_READ_WRITE_TOKEN!,
          }),
        ]
      : []),
    multiTenantPlugin<Config>({
      collections: {
        pages: {},
        media: {},
        navigation: {
          isGlobal: true,
        },
      },
      tenantField: {
        access: {
          read: () => true,
          create: ({ req }) => {
            if (isSuperAdmin(req.user)) {
              return true
            }
            return getUserTenantIDs(req.user).length > 0
          },
          update: ({ req }) => {
            if (isSuperAdmin(req.user)) {
              return true
            }
            return getUserTenantIDs(req.user).length > 0
          },
        },
      },
      tenantsArrayField: {
        includeDefaultField: false,
      },
      userHasAccessToAllTenants: (user) => isSuperAdmin(user),
    }),
  ],
})
