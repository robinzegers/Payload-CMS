import { Config } from 'payload'

export const seed: NonNullable<Config['onInit']> = async (payload): Promise<void> => {
  console.log('🌱 Starting seed process...')

  // Clear existing data first
  console.log('🧹 Clearing existing data...')

  try {
    const existingPages = await payload.find({ collection: 'pages', limit: 1000 })
    for (const page of existingPages.docs) {
      await payload.delete({ collection: 'pages', id: page.id })
    }
    console.log(`✅ Cleared ${existingPages.docs.length} pages`)
  } catch (error) {
    console.log('No existing pages to clear or error clearing pages:', error)
  }

  try {
    const existingUsers = await payload.find({ collection: 'users', limit: 1000 })
    for (const user of existingUsers.docs) {
      await payload.delete({ collection: 'users', id: user.id })
    }
    console.log(`✅ Cleared ${existingUsers.docs.length} users`)
  } catch (error) {
    console.log('No existing users to clear or error clearing users:', error)
  }

  try {
    const existingTenants = await payload.find({ collection: 'tenants', limit: 1000 })
    for (const tenant of existingTenants.docs) {
      await payload.delete({ collection: 'tenants', id: tenant.id })
    }
    console.log(`✅ Cleared ${existingTenants.docs.length} tenants`)
  } catch (error) {
    console.log('No existing tenants to clear or error clearing tenants:', error)
  }

  console.log('🏗️ Creating new seed data...')

  // Create tenants
  const tenant1 = await payload.create({
    collection: 'tenants',
    data: {
      name: 'Gold Tenant',
      slug: 'gold',
      domain: 'gold.localhost',
      allowPublicRead: false,
    },
  })
  console.log('✅ Created tenant 1 (Gold)')

  const tenant2 = await payload.create({
    collection: 'tenants',
    data: {
      name: 'Silver Tenant',
      slug: 'silver',
      domain: 'silver.localhost',
      allowPublicRead: false,
    },
  })
  console.log('✅ Created tenant 2 (Silver)')

  const tenant3 = await payload.create({
    collection: 'tenants',
    data: {
      name: 'Bronze Tenant (Public)',
      slug: 'bronze',
      domain: 'bronze.localhost',
      allowPublicRead: true,
    },
  })
  console.log('✅ Created tenant 3 (Bronze - Public)')

  // Create super admin user
  await payload.create({
    collection: 'users',
    data: {
      email: 'demo@payloadcms.com',
      password: 'demo',
      roles: ['super-admin'],
      username: 'super-admin',
    },
  })
  console.log('✅ Created super admin user')

  // Create tenant-specific users
  await payload.create({
    collection: 'users',
    data: {
      email: 'tenant1@payloadcms.com',
      password: 'demo',
      roles: ['user'],
      username: 'tenant1-admin',
      tenants: [
        {
          roles: ['tenant-admin'],
          tenant: tenant1.id,
        },
      ],
    },
  })
  console.log('✅ Created tenant 1 admin user')

  await payload.create({
    collection: 'users',
    data: {
      email: 'tenant2@payloadcms.com',
      password: 'demo',
      roles: ['user'],
      username: 'tenant2-admin',
      tenants: [
        {
          roles: ['tenant-admin'],
          tenant: tenant2.id,
        },
      ],
    },
  })
  console.log('✅ Created tenant 2 admin user')

  await payload.create({
    collection: 'users',
    data: {
      email: 'tenant3@payloadcms.com',
      password: 'demo',
      roles: ['user'],
      username: 'tenant3-viewer',
      tenants: [
        {
          roles: ['tenant-viewer'],
          tenant: tenant3.id,
        },
      ],
    },
  })
  console.log('✅ Created tenant 3 viewer user')

  // Create multi-tenant user
  await payload.create({
    collection: 'users',
    data: {
      email: 'multi-admin@payloadcms.com',
      password: 'demo',
      roles: ['user'],
      username: 'multi-tenant-admin',
      tenants: [
        {
          roles: ['tenant-admin'],
          tenant: tenant1.id,
        },
        {
          roles: ['tenant-admin'],
          tenant: tenant2.id,
        },
        {
          roles: ['tenant-viewer'],
          tenant: tenant3.id,
        },
      ],
    },
  })
  console.log('✅ Created multi-tenant admin user')

  // Create sample pages for each tenant
  await payload.create({
    collection: 'pages',
    data: {
      title: 'Home Page - Gold Tenant',
      slug: 'home-gold',
      pageType: 'standard',
      tenant: tenant1.id,
      content: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              version: 1,
              children: [
                {
                  type: 'text',
                  text: 'Welcome to the Gold Tenant home page! This is a premium tenant with exclusive content.',
                  version: 1,
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
      status: 'published',
    },
  })
  console.log('✅ Created Gold tenant home page')

  await payload.create({
    collection: 'pages',
    data: {
      title: 'Home Page - Silver Tenant',
      slug: 'home-silver',
      pageType: 'standard',
      tenant: tenant2.id,
      content: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              version: 1,
              children: [
                {
                  type: 'text',
                  text: 'Welcome to the Silver Tenant home page! This is a standard tenant with good features.',
                  version: 1,
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
      status: 'published',
    },
  })
  console.log('✅ Created Silver tenant home page')

  await payload.create({
    collection: 'pages',
    data: {
      title: 'Public Home Page - Bronze Tenant',
      slug: 'home-bronze',
      pageType: 'standard',
      tenant: tenant3.id,
      content: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              version: 1,
              children: [
                {
                  type: 'text',
                  text: 'Welcome to the Bronze (Public) Tenant home page! This content is publicly accessible.',
                  version: 1,
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
      status: 'published',
    },
  })
  console.log('✅ Created Bronze tenant home page')

  console.log('')
  console.log('🎉 Database seeded successfully!')
  console.log('')
  console.log('🔑 Login credentials:')
  console.log('  Super Admin: demo@payloadcms.com / demo')
  console.log('  Gold Tenant Admin: tenant1@payloadcms.com / demo')
  console.log('  Silver Tenant Admin: tenant2@payloadcms.com / demo')
  console.log('  Bronze Tenant Viewer: tenant3@payloadcms.com / demo')
  console.log('  Multi-Tenant Admin: multi-admin@payloadcms.com / demo')
  console.log('')
  console.log('🌐 Access URLs:')
  console.log('  Admin Panel: http://localhost:3000/admin')
  console.log('  Gold Tenant: http://gold.localhost:3000')
  console.log('  Silver Tenant: http://silver.localhost:3000')
  console.log('  Bronze Tenant: http://bronze.localhost:3000')
  console.log('')
  console.log('📝 Note: Add these entries to your /etc/hosts file:')
  console.log('  127.0.0.1 gold.localhost silver.localhost bronze.localhost')
}
