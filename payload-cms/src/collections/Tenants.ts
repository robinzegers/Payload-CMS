import type { CollectionConfig, PayloadRequest } from 'payload'
import type { User } from '../payload-types'

// Access control functions
const isSuperAdmin = (user: User): boolean => {
  return user?.roles?.includes('super-admin') ?? false
}

const isSuperAdminAccess = ({ req }: { req: PayloadRequest }) => {
  return isSuperAdmin(req.user as User)
}

const updateAndDeleteAccess = ({ req }: { req: PayloadRequest }) => {
  // Super-admins can update/delete all tenants
  if (isSuperAdmin(req.user as User)) {
    return true
  }

  // Tenant admins can update their own tenants
  const user = req.user as User
  if (user?.tenants && user.tenants.length > 0) {
    const tenantIds = user.tenants
      .filter((tenantRow) => tenantRow.roles?.includes('tenant-admin'))
      .map((tenantRow) => tenantRow.tenant)

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
    // Campaign Settings
    {
      name: 'campaignSettings',
      type: 'group',
      admin: {
        description: 'Campaign and market configuration',
      },
      fields: [
        {
          name: 'campaignId',
          type: 'text',
          admin: {
            description: 'Unique identifier for the campaign',
          },
        },
        {
          name: 'market',
          type: 'text',
          admin: {
            description: 'Market identifier for this tenant',
          },
        },
      ],
    },
    // Game Configuration
    {
      name: 'gameSettings',
      type: 'group',
      admin: {
        description: 'Game-specific configuration',
      },
      fields: [
        {
          name: 'gameKey',
          type: 'text',
          admin: {
            description: 'Unique game key identifier',
          },
        },
        {
          name: 'languages',
          type: 'array',
          admin: {
            description: 'Supported languages for this tenant',
          },
          fields: [
            {
              name: 'language',
              type: 'select',
              required: true,
              options: [
                { label: 'English', value: 'en' },
                { label: 'Spanish', value: 'es' },
                { label: 'French', value: 'fr' },
                { label: 'German', value: 'de' },
                { label: 'Dutch', value: 'nl' },
                { label: 'Italian', value: 'it' },
                { label: 'Portuguese', value: 'pt' },
                { label: 'Chinese', value: 'zh' },
                { label: 'Japanese', value: 'ja' },
                { label: 'Korean', value: 'ko' },
              ],
            },
          ],
        },
      ],
    },
    // Registration & Redemption Settings
    {
      name: 'registrationSettings',
      type: 'group',
      admin: {
        description: 'Registration and redemption configuration',
      },
      fields: [
        {
          name: 'externalRegistration',
          type: 'checkbox',
          admin: {
            description: 'Enable external registration system integration',
          },
          defaultValue: false,
        },
        {
          name: 'enableQrRedeem',
          type: 'checkbox',
          admin: {
            description: 'Enable QR code redemption functionality',
          },
          defaultValue: false,
        },
        {
          name: 'enableCodeClaim',
          type: 'checkbox',
          admin: {
            description: 'Enable code claim functionality',
          },
          defaultValue: false,
        },
        {
          name: 'codeClaimFields',
          type: 'array',
          admin: {
            description: 'Custom fields for code claim process',
            condition: (data, siblingData) => siblingData?.enableCodeClaim,
          },
          fields: [
            {
              name: 'fieldName',
              type: 'text',
              required: true,
              admin: {
                description: 'Name of the field',
              },
            },
            {
              name: 'fieldType',
              type: 'select',
              required: true,
              options: [
                { label: 'Text', value: 'text' },
                { label: 'Email', value: 'email' },
                { label: 'Number', value: 'number' },
                { label: 'Date', value: 'date' },
                { label: 'Select', value: 'select' },
                { label: 'Checkbox', value: 'checkbox' },
              ],
            },
            {
              name: 'required',
              type: 'checkbox',
              defaultValue: false,
            },
            {
              name: 'placeholder',
              type: 'text',
              admin: {
                description: 'Placeholder text for the field',
              },
            },
          ],
        },
      ],
    },
    // Campaign Timeline
    {
      name: 'timelineSettings',
      type: 'group',
      admin: {
        description: 'Campaign timeline and timezone settings',
      },
      fields: [
        {
          name: 'startDate',
          type: 'date',
          admin: {
            description: 'Campaign start date and time',
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
        {
          name: 'endDate',
          type: 'date',
          admin: {
            description: 'Campaign end date and time',
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
        {
          name: 'countryTimezone',
          type: 'select',
          admin: {
            description: 'Primary timezone for this tenant',
          },
          options: [
            { label: 'UTC', value: 'UTC' },
            { label: 'US/Eastern', value: 'America/New_York' },
            { label: 'US/Central', value: 'America/Chicago' },
            { label: 'US/Mountain', value: 'America/Denver' },
            { label: 'US/Pacific', value: 'America/Los_Angeles' },
            { label: 'Europe/London', value: 'Europe/London' },
            { label: 'Europe/Paris', value: 'Europe/Paris' },
            { label: 'Europe/Berlin', value: 'Europe/Berlin' },
            { label: 'Europe/Amsterdam', value: 'Europe/Amsterdam' },
            { label: 'Asia/Tokyo', value: 'Asia/Tokyo' },
            { label: 'Asia/Shanghai', value: 'Asia/Shanghai' },
            { label: 'Asia/Seoul', value: 'Asia/Seoul' },
            { label: 'Australia/Sydney', value: 'Australia/Sydney' },
          ],
        },
      ],
    },
    // Analytics & Integration
    {
      name: 'analyticsSettings',
      type: 'group',
      admin: {
        description: 'Analytics and external integrations',
      },
      fields: [
        {
          name: 'lookerStudioConnector',
          type: 'text',
          admin: {
            description: 'Looker Studio connector configuration',
          },
        },
      ],
    },
    // Location Settings
    {
      name: 'locationSettings',
      type: 'group',
      admin: {
        description: 'Geographic and location settings',
      },
      fields: [
        {
          name: 'countryCode',
          type: 'select',
          admin: {
            description: 'ISO country code for this tenant',
          },
          options: [
            { label: 'United States', value: 'US' },
            { label: 'Canada', value: 'CA' },
            { label: 'United Kingdom', value: 'GB' },
            { label: 'Germany', value: 'DE' },
            { label: 'France', value: 'FR' },
            { label: 'Spain', value: 'ES' },
            { label: 'Italy', value: 'IT' },
            { label: 'Netherlands', value: 'NL' },
            { label: 'Belgium', value: 'BE' },
            { label: 'Australia', value: 'AU' },
            { label: 'Japan', value: 'JP' },
            { label: 'South Korea', value: 'KR' },
            { label: 'China', value: 'CN' },
            { label: 'Brazil', value: 'BR' },
            { label: 'Mexico', value: 'MX' },
          ],
        },
      ],
    },
    // Collection & Purpose IDs
    {
      name: 'dataSettings',
      type: 'group',
      admin: {
        description: 'Data collection and purpose configuration',
      },
      fields: [
        {
          name: 'collectionId',
          type: 'text',
          admin: {
            description: 'Collection identifier for data organization',
          },
        },
        {
          name: 'purposeIds',
          type: 'array',
          admin: {
            description: 'Purpose identifiers for data processing',
          },
          fields: [
            {
              name: 'purposeId',
              type: 'text',
              required: true,
              admin: {
                description: 'Purpose ID for data collection',
              },
            },
            {
              name: 'description',
              type: 'textarea',
              admin: {
                description: 'Description of the purpose',
              },
            },
            {
              name: 'required',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: 'Is this purpose required?',
              },
            },
          ],
        },
      ],
    },
  ],
}
