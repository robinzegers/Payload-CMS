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
    livePreview: {
      url: ({ data, req }) => {
        const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
        const host = req.headers.get('host') || 'localhost:3000'

        // For multi-tenant setup, we need to determine the preview URL based on tenant
        if (data.tenant) {
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
        return `${protocol}://${host}/preview?slug=${data.slug || 'home'}&id=${data.id}`
      },
    },
    preview: (data) => {
      const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
      const host = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

      // For multi-tenant setup
      if (data.tenant && typeof data.tenant === 'object') {
        const tenant = data.tenant as any
        if (tenant.slug) {
          return `${protocol}://${host}/tenant-slugs/${tenant.slug}${data.slug ? `/${data.slug}` : ''}`
        }
        if (tenant.domain) {
          return `${protocol}://${tenant.domain}/tenant-domains/${data.slug || ''}`
        }
      }

      return `${host}/preview?slug=${data.slug || 'home'}&id=${data.id}`
    },
  },
  versions: {
    drafts: true,
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
