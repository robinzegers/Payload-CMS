import type { CollectionConfig, PayloadRequest } from 'payload'
import type { User } from '../payload-types'

// After change hook to create default pages and set default values
const createDefaultPages = async ({ doc, req, operation }: any) => {
  // Only run on create operations
  if (operation !== 'create') return doc

  console.log(`🚀 Setting up campaign: ${doc.name}`)

  // Set default campaign settings if not provided
  const updatedDoc = { ...doc }

  // Set default values for campaign settings
  if (!updatedDoc.campaignSettings?.campaignId) {
    updatedDoc.campaignSettings = {
      ...updatedDoc.campaignSettings,
      campaignId: `campaign_${doc.slug}_${Date.now()}`,
    }
  }

  if (!updatedDoc.gameSettings?.languages || updatedDoc.gameSettings.languages.length === 0) {
    updatedDoc.gameSettings = {
      ...updatedDoc.gameSettings,
      languages: [{ language: 'en' }], // Default to English
    }
  }

  if (!updatedDoc.locationSettings?.countryCode) {
    updatedDoc.locationSettings = {
      ...updatedDoc.locationSettings,
      countryCode: 'US', // Default to US
    }
  }

  if (!updatedDoc.timelineSettings?.countryTimezone) {
    updatedDoc.timelineSettings = {
      ...updatedDoc.timelineSettings,
      countryTimezone: 'UTC', // Default to UTC
    }
  }

  // Update the document with default values
  if (updatedDoc !== doc) {
    try {
      await req.payload.update({
        collection: 'tenants',
        id: doc.id,
        data: updatedDoc,
        req,
      })
      console.log(`✅ Updated campaign with default settings: ${doc.name}`)
    } catch (error) {
      console.error(`⚠️ Warning: Could not update campaign with default settings:`, error)
    }
  }

  console.log(`📄 Creating default pages for campaign: ${doc.name}`)

  // Define default pages to create for each campaign
  const defaultPages = [
    {
      title: `Home - ${doc.name}`,
      slug: 'home',
      pageType: 'landing',
      landingDescription: `Welcome to ${doc.name}! This is your campaign's home page where users will first land.`,
      status: 'published',
      content: {
        root: {
          type: 'root',
          children: [
            {
              type: 'heading',
              tag: 'h1',
              children: [
                {
                  type: 'text',
                  text: `Welcome to ${doc.name}`,
                },
              ],
            },
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: `Get ready for an amazing experience with ${doc.name}! Join our campaign and discover what awaits you.`,
                },
              ],
            },
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'Ready to get started? Click below to begin your journey.',
                },
              ],
            },
          ],
          direction: null,
          format: '',
          indent: 0,
          version: 1,
        },
      },
    },
    {
      title: `Leaderboard - ${doc.name}`,
      slug: 'leaderboard',
      pageType: 'leaderboard',
      leaderboardDescription: `View the top performers in ${doc.name} campaign.`,
      status: 'published',
      content: {
        root: {
          type: 'root',
          children: [
            {
              type: 'heading',
              tag: 'h1',
              children: [
                {
                  type: 'text',
                  text: `${doc.name} Leaderboard`,
                },
              ],
            },
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'Check out the top performers in our campaign! See how you rank against other participants.',
                },
              ],
            },
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'The leaderboard updates in real-time as participants complete challenges and earn points.',
                },
              ],
            },
          ],
          direction: null,
          format: '',
          indent: 0,
          version: 1,
        },
      },
    },
    {
      title: `Loading - ${doc.name}`,
      slug: 'loading',
      pageType: 'loading',
      loadingDescription: `Please wait while we prepare your ${doc.name} experience.`,
      status: 'published',
      content: {
        root: {
          type: 'root',
          children: [
            {
              type: 'heading',
              tag: 'h1',
              children: [
                {
                  type: 'text',
                  text: 'Loading...',
                },
              ],
            },
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: `Please wait while we prepare your ${doc.name} experience. This won't take long!`,
                },
              ],
            },
          ],
          direction: null,
          format: '',
          indent: 0,
          version: 1,
        },
      },
    },
    {
      title: `Game Page - ${doc.name}`,
      slug: 'game',
      pageType: 'standard',
      status: 'draft',
      content: {
        root: {
          type: 'root',
          children: [
            {
              type: 'heading',
              tag: 'h1',
              children: [
                {
                  type: 'text',
                  text: `${doc.name} Game`,
                },
              ],
            },
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'This is the main game page. Configure your game content and mechanics here.',
                },
              ],
            },
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'Remember to update this page with your specific game instructions and interface.',
                },
              ],
            },
          ],
          direction: null,
          format: '',
          indent: 0,
          version: 1,
        },
      },
    },
    {
      title: `Rules - ${doc.name}`,
      slug: 'rules',
      pageType: 'standard',
      status: 'draft',
      content: {
        root: {
          type: 'root',
          children: [
            {
              type: 'heading',
              tag: 'h1',
              children: [
                {
                  type: 'text',
                  text: `${doc.name} Rules`,
                },
              ],
            },
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'Welcome to the rules page. Here you can outline the terms and conditions for participating in this campaign.',
                },
              ],
            },
            {
              type: 'heading',
              tag: 'h2',
              children: [
                {
                  type: 'text',
                  text: 'How to Participate',
                },
              ],
            },
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'Add your participation instructions here.',
                },
              ],
            },
            {
              type: 'heading',
              tag: 'h2',
              children: [
                {
                  type: 'text',
                  text: 'Eligibility',
                },
              ],
            },
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'Define who can participate in your campaign.',
                },
              ],
            },
            {
              type: 'heading',
              tag: 'h2',
              children: [
                {
                  type: 'text',
                  text: 'Prizes and Rewards',
                },
              ],
            },
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'Describe the prizes and rewards participants can win.',
                },
              ],
            },
          ],
          direction: null,
          format: '',
          indent: 0,
          version: 1,
        },
      },
    },
    {
      title: `Privacy Policy - ${doc.name}`,
      slug: 'privacy',
      pageType: 'standard',
      status: 'draft',
      content: {
        root: {
          type: 'root',
          children: [
            {
              type: 'heading',
              tag: 'h1',
              children: [
                {
                  type: 'text',
                  text: 'Privacy Policy',
                },
              ],
            },
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: `This privacy policy explains how ${doc.name} collects, uses, and protects your personal information.`,
                },
              ],
            },
            {
              type: 'heading',
              tag: 'h2',
              children: [
                {
                  type: 'text',
                  text: 'Information We Collect',
                },
              ],
            },
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'Describe what information you collect from participants.',
                },
              ],
            },
            {
              type: 'heading',
              tag: 'h2',
              children: [
                {
                  type: 'text',
                  text: 'How We Use Your Information',
                },
              ],
            },
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'Explain how you use the collected information.',
                },
              ],
            },
            {
              type: 'heading',
              tag: 'h2',
              children: [
                {
                  type: 'text',
                  text: 'Data Protection',
                },
              ],
            },
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'Describe your data protection measures and participant rights.',
                },
              ],
            },
          ],
          direction: null,
          format: '',
          indent: 0,
          version: 1,
        },
      },
    },
    {
      title: `Terms & Conditions - ${doc.name}`,
      slug: 'terms',
      pageType: 'standard',
      status: 'draft',
      content: {
        root: {
          type: 'root',
          children: [
            {
              type: 'heading',
              tag: 'h1',
              children: [
                {
                  type: 'text',
                  text: 'Terms & Conditions',
                },
              ],
            },
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: `By participating in ${doc.name}, you agree to these terms and conditions.`,
                },
              ],
            },
            {
              type: 'heading',
              tag: 'h2',
              children: [
                {
                  type: 'text',
                  text: 'Acceptance of Terms',
                },
              ],
            },
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'By accessing and using this campaign, you accept and agree to be bound by the terms and provision of this agreement.',
                },
              ],
            },
            {
              type: 'heading',
              tag: 'h2',
              children: [
                {
                  type: 'text',
                  text: 'Use License',
                },
              ],
            },
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'Define the terms under which participants can use your campaign materials.',
                },
              ],
            },
            {
              type: 'heading',
              tag: 'h2',
              children: [
                {
                  type: 'text',
                  text: 'Disclaimer',
                },
              ],
            },
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'Add your legal disclaimers and limitations of liability here.',
                },
              ],
            },
          ],
          direction: null,
          format: '',
          indent: 0,
          version: 1,
        },
      },
    },
  ]

  try {
    const createdPages = []
    for (const pageData of defaultPages) {
      try {
        const page = await req.payload.create({
          collection: 'pages',
          data: {
            ...pageData,
            tenant: doc.id, // Link page to this campaign/tenant
          },
          req,
        })
        createdPages.push(page)
        console.log(`✅ Created page: ${page.title} (${page.slug})`)
      } catch (pageError: any) {
        console.error(`❌ Failed to create page "${pageData.title}":`, pageError.message)
        // Continue with other pages even if one fails
      }
    }

    console.log(
      `🎉 Successfully created ${createdPages.length}/${defaultPages.length} default pages for campaign: ${doc.name}`,
    )

    if (createdPages.length < defaultPages.length) {
      console.log(`⚠️ Some pages failed to create. You may need to create them manually.`)
    }
  } catch (error) {
    console.error(`❌ Error creating default pages for campaign ${doc.name}:`, error)
  }

  return doc
}

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

export const Campaigns: CollectionConfig = {
  slug: 'tenants',
  labels: {
    singular: 'Campaign',
    plural: 'Campaigns',
  },
  access: {
    create: isSuperAdminAccess,
    delete: updateAndDeleteAccess,
    read: ({ req }) => Boolean(req.user), // Any authenticated user can read tenants
    update: updateAndDeleteAccess,
  },
  admin: {
    useAsTitle: 'name',
  },
  hooks: {
    afterChange: [createDefaultPages],
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
