#!/usr/bin/env node

import { getPayload } from 'payload'
import config from '../src/payload.config.ts'
import { seed } from '../src/seed.ts'

const run = async () => {
  const payload = await getPayload({ config })

  console.log('Starting seed process...')

  try {
    await seed(payload)
    console.log('✅ Seed completed successfully!')
  } catch (error) {
    console.error('❌ Seed failed:', error)
    process.exit(1)
  }

  process.exit(0)
}

run()
