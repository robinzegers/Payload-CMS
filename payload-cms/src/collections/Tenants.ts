import type { CollectionConfig } from 'payload'

// Access control functions
const isSuperAdmin = (user: any): boolean => {
  return user?.roles?.includes('super-admin')
}

const isSuperAdminAccess = ({ req }: any) => {
  return isSuperAdmin(req.user)
}

const updateAndDeleteAccess = ({ req }: any) => {
  // Super-admins can update/delete all tenants
  if (isSuperAdmin(req.user)) {
    return true
  }

  // Tenant admins can update their own tenants
  if (req.user?.tenants?.length > 0) {
    const tenantIds = req.user.tenants
      .filter((tenantRow: any) => tenantRow.roles?.includes('tenant-admin'))
      .map((tenantRow: any) => tenantRow.tenant)

    if (tenantIds.length > 0) {
      return {
        id: {
          in: tenantIds,
        },
      }
    }
  }

  return false
}

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  access: {
    create: isSuperAdminAccess,
    delete: updateAndDeleteAccess,
    read: ({ req }) => Boolean(req.user), // Any authenticated user can read tenants
    update: updateAndDeleteAccess,
  },
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Used for url paths, example: /tenant-slug/page-slug',
      },
      index: true,
    },
    {
      name: 'domain',
      type: 'text',
      admin: {
        description: 'Used for domain-based tenant handling',
      },
    },
    {
      name: 'allowPublicRead',
      type: 'checkbox',
      admin: {
        description:
          'If checked, logging in is not required to read. Useful for building public pages.',
        position: 'sidebar',
      },
      defaultValue: false,
      index: true,
    },
  ],
}
