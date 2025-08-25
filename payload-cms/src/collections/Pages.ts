import type { CollectionConfig } from 'payload'

// Access control functions
const isSuperAdmin = (user: any): boolean => {
  return user?.roles?.includes('super-admin')
}

const superAdminOrTenantAdminAccess = ({ req }: any) => {
  // Super-admins can access all pages
  if (isSuperAdmin(req.user)) {
    return true
  }

  // Tenant admins can access pages for their tenants
  if (req.user?.tenants?.length > 0) {
    const tenantIds = req.user.tenants
      .filter((tenantRow: any) => tenantRow.roles?.includes('tenant-admin'))
      .map((tenantRow: any) => tenantRow.tenant)

    if (tenantIds.length > 0) {
      return {
        tenant: {
          in: tenantIds,
        },
      }
    }
  }

  return false
}

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    create: superAdminOrTenantAdminAccess,
    delete: superAdminOrTenantAdminAccess,
    read: () => true, // Everyone can read pages (you can restrict this if needed)
    update: superAdminOrTenantAdminAccess,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'content',
      type: 'richText',
    },
    {
      name: 'status',
      type: 'select',
      options: [
        {
          label: 'Draft',
          value: 'draft',
        },
        {
          label: 'Published',
          value: 'published',
        },
      ],
      defaultValue: 'draft',
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
