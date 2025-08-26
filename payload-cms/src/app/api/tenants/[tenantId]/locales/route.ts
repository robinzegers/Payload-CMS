import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '../../../../../payload.config'
import { getTenantLocales } from '../../../../../utilities/localization'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ tenantId: string }> },
) {
  try {
    const payload = await getPayload({ config: configPromise })
    const { tenantId } = await context.params

    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant ID is required' }, { status: 400 })
    }

    // Get supported locales for the tenant
    const locales = await getTenantLocales(payload, tenantId)

    return NextResponse.json({
      locales,
      defaultLocale: locales[0] || 'en',
    })
  } catch (error) {
    console.error('Error fetching tenant locales:', error)
    return NextResponse.json({ error: 'Failed to fetch tenant locales' }, { status: 500 })
  }
}
