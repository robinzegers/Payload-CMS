#!/usr/bin/env tsx
import 'dotenv/config'
import { getPayload } from 'payload'
import config from './src/payload.config.js'

const run = async () => {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  console.log('=== Checking Database Content ===')

  // Check tenants
  const tenants = await payload.find({ collection: 'tenants' })
  console.log(
    'Tenants:',
    tenants.docs.map((t) => ({ id: t.id, name: t.name, slug: t.slug })),
  )

  // Check users
  const users = await payload.find({ collection: 'users' })
  console.log(
    'Users:',
    users.docs.map((u) => ({ id: u.id, email: u.email })),
  )

  // Check pages
  const pages = await payload.find({ collection: 'pages' })
  console.log(
    'Pages:',
    pages.docs.map((p) => ({ id: p.id, title: p.title, tenant: p.tenant })),
  )

  // Check navigation
  const navigation = await payload.find({ collection: 'navigation' })
  console.log(
    'Navigation:',
    navigation.docs.map((n) => ({ id: n.id, label: n.label })),
  )

  console.log('=== End Check ===')
  process.exit(0)
}

run().catch(console.error)
