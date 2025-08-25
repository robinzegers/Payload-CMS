#!/usr/bin/env tsx

import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import { seed } from '../src/seed'

const run = async (): Promise<void> => {
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
