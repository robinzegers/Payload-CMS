import type { CollectionConfig } from 'payload'
import { isSuperAdmin, getUserTenantIDs } from '../utilities/access'

export const MediaWithCloud: CollectionConfig = {
  slug: 'media',
  hooks: {
    beforeValidate: [
      ({ data, req }) => {
        // If no tenant is selected, try to assign the first available tenant for the user
        if (data && !data.tenant && req.user) {
          const tenantIDs = getUserTenantIDs(req.user)
          if (tenantIDs.length > 0) {
            data.tenant = tenantIDs[0]
          }
        }
        return data
      },
    ],
  },
  access: {
    read: ({ req }) => {
      // Super admins can read all media
      if (isSuperAdmin(req.user)) {
        return true
      }

      // Authenticated users can read media from their tenants
      if (req.user) {
        const tenantIDs = getUserTenantIDs(req.user)
        if (tenantIDs.length > 0) {
          return {
            tenant: {
              in: tenantIDs,
            },
          }
        }
      }

      return false
    },
    create: ({ req }) => {
      // Super admins and authenticated users can create media
      return Boolean(req.user)
    },
    update: ({ req }) => {
      // Super admins can update all media
      if (isSuperAdmin(req.user)) {
        return true
      }

      // Users can update media from their tenants
      if (req.user) {
        const tenantIDs = getUserTenantIDs(req.user)
        if (tenantIDs.length > 0) {
          return {
            tenant: {
              in: tenantIDs,
            },
          }
        }
      }

      return false
    },
    delete: ({ req }) => {
      // Super admins can delete all media
      if (isSuperAdmin(req.user)) {
        return true
      }

      // Users can delete media from their tenants
      if (req.user) {
        const tenantIDs = getUserTenantIDs(req.user)
        if (tenantIDs.length > 0) {
          return {
            tenant: {
              in: tenantIDs,
            },
          }
        }
      }

      return false
    },
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: {
    // For production, use Vercel Blob storage
    // For development, fall back to local storage
    ...(process.env.NODE_ENV === 'production' || process.env.BLOB_READ_WRITE_TOKEN
      ? {}
      : { staticDir: '../public/media' }),
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 1024,
        position: 'centre',
      },
      {
        name: 'tablet',
        width: 1024,
        height: undefined,
        position: 'centre',
      },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*'],
  },
}
