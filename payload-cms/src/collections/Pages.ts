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

        // Fallback to basic preview
        return `${protocol}://${host}/preview?slug=${data?.slug || 'home'}&id=${data?.id}`
      },
    },
    preview: (data) => {
      const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || `${protocol}://localhost:3000`

      return `${baseUrl}/preview?slug=${data?.slug || 'home'}&id=${data?.id}`
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
      localized: true,
    },
    {
      name: 'pageType',
      type: 'select',
      options: [
        {
          label: 'Standard Page',
          value: 'standard',
        },
        {
          label: 'Landing Page',
          value: 'landing',
        },
        {
          label: 'Leaderboard page',
          value: 'leaderboard',
        },
        {
          label: 'Loading Page',
          value: 'loading',
        },
      ],
      defaultValue: 'standard',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'landingDescription',
      type: 'textarea',
      localized: true,
      admin: {
        condition: (data) => data.pageType === 'landing',
        description: 'A brief description for the landing page',
      },
    },
    {
      name: 'loadingDescription',
      type: 'textarea',
      localized: true,
      admin: {
        condition: (data) => data.pageType === 'loading',
        description: 'A brief description for the loading page',
      },
    },
    {
      name: 'leaderboardDescription',
      type: 'textarea',
      localized: true,
      admin: {
        condition: (data) => data.pageType === 'leaderboard',
        description: 'A brief description for the leaderboard page',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      admin: {
        position: 'sidebar',
        description: 'URL-friendly version of the page title',
      },
      validate: async (val: any, { data, req }: any) => {
        // Check for duplicate slugs within the same tenant
        if (val && data?.tenant) {
          const existingPages = await req.payload.find({
            collection: 'pages',
            where: {
              and: [
                { slug: { equals: val } },
                { tenant: { equals: data.tenant } },
                { id: { not_equals: data.id || '' } },
              ],
            },
            limit: 1,
          })

          if (existingPages.docs.length > 0) {
            return `A page with slug "${val}" already exists in this campaign. Please choose a different slug.`
          }
        }
        return true
      },
    },
    {
      name: 'content',
      type: 'richText',
      localized: true,
      admin: {
        description: 'Page content in rich text format',
      },
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
