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
import { Campaigns } from './collections/Campaigns'
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

        // Fallback to basic preview
        return `${protocol}://${host}/preview${data?.slug ? `/${data.slug}` : ''}`
      },
      collections: ['pages'],
    },
  },
  collections: [
    Users,
    Campaigns,
    process.env.NODE_ENV === 'production' || process.env.BLOB_READ_WRITE_TOKEN
      ? MediaWithCloud
      : Media,
    Pages,
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
      tenantSelectorLabel: 'Select a campaign',
      userHasAccessToAllTenants: (user) => isSuperAdmin(user),
    }),
  ],
})
