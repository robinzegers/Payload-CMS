import type { Tenant } from '../payload-types'

/**
 * Utility functions for working with tenant settings
 */

export interface TenantSettings {
  campaignId?: string
  market?: string
  gameKey?: string
  languages: string[]
  externalRegistration: boolean
  enableQrRedeem: boolean
  enableCodeClaim: boolean
  codeClaimFields: Array<{
    fieldName: string
    fieldType: 'text' | 'email' | 'number' | 'date' | 'select' | 'checkbox'
    required: boolean
    placeholder?: string
  }>
  startDate?: string
  endDate?: string
  countryTimezone?: string
  lookerStudioConnector?: string
  countryCode?: string
  collectionId?: string
  purposeIds: Array<{
    purposeId: string
    description?: string
    required: boolean
  }>
}

/**
 * Extract and normalize tenant settings from a tenant object
 */
export function getTenantSettings(tenant: Tenant): TenantSettings {
  return {
    campaignId: tenant.campaignSettings?.campaignId || undefined,
    market: tenant.campaignSettings?.market || undefined,
    gameKey: tenant.gameSettings?.gameKey || undefined,
    languages: tenant.gameSettings?.languages?.map((lang) => lang.language) || [],
    externalRegistration: tenant.registrationSettings?.externalRegistration || false,
    enableQrRedeem: tenant.registrationSettings?.enableQrRedeem || false,
    enableCodeClaim: tenant.registrationSettings?.enableCodeClaim || false,
    codeClaimFields:
      tenant.registrationSettings?.codeClaimFields?.map((field) => ({
        fieldName: field.fieldName,
        fieldType: field.fieldType,
        required: field.required || false,
        placeholder: field.placeholder || undefined,
      })) || [],
    startDate: tenant.timelineSettings?.startDate || undefined,
    endDate: tenant.timelineSettings?.endDate || undefined,
    countryTimezone: tenant.timelineSettings?.countryTimezone || undefined,
    lookerStudioConnector: tenant.analyticsSettings?.lookerStudioConnector || undefined,
    countryCode: tenant.locationSettings?.countryCode || undefined,
    collectionId: tenant.dataSettings?.collectionId || undefined,
    purposeIds:
      tenant.dataSettings?.purposeIds?.map((purpose) => ({
        purposeId: purpose.purposeId,
        description: purpose.description || undefined,
        required: purpose.required || false,
      })) || [],
  }
}

/**
 * Check if a tenant's campaign is currently active based on start/end dates
 */
export function isCampaignActive(tenant: Tenant): boolean {
  const settings = getTenantSettings(tenant)
  const now = new Date()

  if (settings.startDate) {
    const startDate = new Date(settings.startDate)
    if (now < startDate) return false
  }

  if (settings.endDate) {
    const endDate = new Date(settings.endDate)
    if (now > endDate) return false
  }

  return true
}

/**
 * Get supported languages for a tenant
 */
export function getTenantLanguages(tenant: Tenant): string[] {
  return getTenantSettings(tenant).languages
}

/**
 * Check if a language is supported by a tenant
 */
export function isTenantLanguageSupported(tenant: Tenant, language: string): boolean {
  return getTenantLanguages(tenant).includes(language)
}

/**
 * Get the primary language for a tenant (first in the list)
 */
export function getTenantPrimaryLanguage(tenant: Tenant): string | null {
  const languages = getTenantLanguages(tenant)
  return languages.length > 0 ? languages[0] : null
}

/**
 * Check if QR code redemption is enabled for a tenant
 */
export function isQrRedeemEnabled(tenant: Tenant): boolean {
  return getTenantSettings(tenant).enableQrRedeem
}

/**
 * Check if code claim is enabled for a tenant
 */
export function isCodeClaimEnabled(tenant: Tenant): boolean {
  return getTenantSettings(tenant).enableCodeClaim
}

/**
 * Get code claim fields for a tenant
 */
export function getCodeClaimFields(tenant: Tenant) {
  return getTenantSettings(tenant).codeClaimFields
}

/**
 * Check if external registration is enabled for a tenant
 */
export function isExternalRegistrationEnabled(tenant: Tenant): boolean {
  return getTenantSettings(tenant).externalRegistration
}

/**
 * Get purpose IDs for data collection
 */
export function getTenantPurposeIds(tenant: Tenant, requiredOnly = false) {
  const settings = getTenantSettings(tenant)
  return requiredOnly ? settings.purposeIds.filter((p) => p.required) : settings.purposeIds
}

/**
 * Get campaign and market information
 */
export function getCampaignInfo(tenant: Tenant) {
  const settings = getTenantSettings(tenant)
  return {
    campaignId: settings.campaignId,
    market: settings.market,
    gameKey: settings.gameKey,
  }
}
