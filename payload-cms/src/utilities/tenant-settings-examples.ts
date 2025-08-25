import type { Tenant } from '../payload-types'
import {
  getTenantSettings,
  isCampaignActive,
  getTenantLanguages,
  isTenantLanguageSupported,
  isQrRedeemEnabled,
  isCodeClaimEnabled,
  getCodeClaimFields,
  getCampaignInfo,
  getTenantPurposeIds,
} from '../utilities/tenant-settings'

/**
 * Example usage of tenant settings utilities
 * This file demonstrates how to use the tenant settings in your application
 */

// Example: Get all settings for a tenant
export function exampleGetAllSettings(tenant: Tenant) {
  const settings = getTenantSettings(tenant)

  console.log('Campaign ID:', settings.campaignId)
  console.log('Market:', settings.market)
  console.log('Game Key:', settings.gameKey)
  console.log('Languages:', settings.languages)
  console.log('QR Redeem Enabled:', settings.enableQrRedeem)
  console.log('Code Claim Enabled:', settings.enableCodeClaim)
  console.log('Country Code:', settings.countryCode)
  console.log('Collection ID:', settings.collectionId)

  return settings
}

// Example: Check if campaign is active
export function exampleCheckCampaignStatus(tenant: Tenant) {
  const isActive = isCampaignActive(tenant)

  if (isActive) {
    console.log('Campaign is currently active')
    // Show campaign content
  } else {
    console.log('Campaign is not active')
    // Show coming soon or ended message
  }

  return isActive
}

// Example: Language handling
export function exampleLanguageHandling(tenant: Tenant, userLanguage: string) {
  const supportedLanguages = getTenantLanguages(tenant)
  const isSupported = isTenantLanguageSupported(tenant, userLanguage)

  if (isSupported) {
    console.log(`User language ${userLanguage} is supported`)
    return userLanguage
  } else {
    const primaryLanguage = supportedLanguages[0] || 'en'
    console.log(`Falling back to primary language: ${primaryLanguage}`)
    return primaryLanguage
  }
}

// Example: Feature flags based on tenant settings
export function exampleFeatureFlags(tenant: Tenant) {
  const features = {
    qrRedeem: isQrRedeemEnabled(tenant),
    codeClaim: isCodeClaimEnabled(tenant),
    externalReg: getTenantSettings(tenant).externalRegistration,
  }

  console.log('Available features:', features)
  return features
}

// Example: Dynamic form fields for code claim
export function exampleCodeClaimForm(tenant: Tenant) {
  if (!isCodeClaimEnabled(tenant)) {
    console.log('Code claim is not enabled for this tenant')
    return null
  }

  const fields = getCodeClaimFields(tenant)

  // Build form schema based on tenant settings
  const formSchema = fields.map((field) => ({
    name: field.fieldName,
    type: field.fieldType,
    required: field.required,
    placeholder: field.placeholder,
    validation: field.required ? 'required' : 'optional',
  }))

  console.log('Code claim form schema:', formSchema)
  return formSchema
}

// Example: Campaign analytics setup
export function exampleAnalyticsSetup(tenant: Tenant) {
  const { campaignId, market, gameKey } = getCampaignInfo(tenant)
  const settings = getTenantSettings(tenant)

  const analyticsConfig = {
    campaignId,
    market,
    gameKey,
    countryCode: settings.countryCode,
    timezone: settings.countryTimezone,
    lookerConnector: settings.lookerStudioConnector,
  }

  console.log('Analytics configuration:', analyticsConfig)
  return analyticsConfig
}

// Example: Data collection compliance
export function exampleDataCompliance(tenant: Tenant) {
  const allPurposes = getTenantPurposeIds(tenant)
  const requiredPurposes = getTenantPurposeIds(tenant, true)

  console.log('All data collection purposes:', allPurposes)
  console.log('Required purposes:', requiredPurposes)

  // Check if user has consented to all required purposes
  const checkConsent = (userConsents: string[]) => {
    const requiredIds = requiredPurposes.map((p) => p.purposeId)
    return requiredIds.every((id) => userConsents.includes(id))
  }

  return { allPurposes, requiredPurposes, checkConsent }
}

// Example: Timezone-aware date handling
export function exampleTimezoneHandling(tenant: Tenant) {
  const settings = getTenantSettings(tenant)
  const timezone = settings.countryTimezone || 'UTC'

  // Format dates in tenant's timezone
  const formatDateForTenant = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  if (settings.startDate) {
    const startDate = new Date(settings.startDate)
    console.log('Campaign starts:', formatDateForTenant(startDate))
  }

  if (settings.endDate) {
    const endDate = new Date(settings.endDate)
    console.log('Campaign ends:', formatDateForTenant(endDate))
  }

  return { timezone, formatDateForTenant }
}

// Example: Integration with Next.js middleware for tenant routing
export function exampleMiddlewareIntegration(tenant: Tenant, request: Request) {
  const settings = getTenantSettings(tenant)

  // Add tenant settings to request headers for downstream use
  const headers = new Headers(request.headers)
  headers.set('x-tenant-campaign-id', settings.campaignId || '')
  headers.set('x-tenant-market', settings.market || '')
  headers.set('x-tenant-languages', settings.languages.join(','))
  headers.set('x-tenant-timezone', settings.countryTimezone || 'UTC')
  headers.set('x-tenant-country', settings.countryCode || '')

  return headers
}
