import type { Payload } from 'payload'

/**
 * Get the supported locales for a specific tenant/campaign
 */
export async function getTenantLocales(payload: Payload, tenantId: string): Promise<string[]> {
  try {
    const tenant = await payload.findByID({
      collection: 'tenants',
      id: tenantId,
    })

    if (tenant?.gameSettings?.languages) {
      return tenant.gameSettings.languages.map((lang: any) => lang.language)
    }

    return ['en'] // Default to English if no languages configured
  } catch (error) {
    console.error(`Error getting tenant locales for ${tenantId}:`, error)
    return ['en']
  }
}

/**
 * Middleware to set the available locales based on the current tenant
 */
export function createLocaleMiddleware() {
  return async (req: any, res: any, next: any) => {
    // Check if this is an admin request with a tenant context
    if (req.user && req.headers['x-tenant-id']) {
      const tenantId = req.headers['x-tenant-id']
      try {
        const supportedLocales = await getTenantLocales(req.payload, tenantId)

        // Add supported locales to the request context
        req.tenantLocales = supportedLocales

        // Set default locale based on tenant's first language
        if (supportedLocales.length > 0) {
          req.defaultLocale = supportedLocales[0]
        }
      } catch (error) {
        console.error('Error setting tenant locales:', error)
      }
    }

    next()
  }
}

/**
 * Helper to get localized content for a specific locale with fallback
 */
export function getLocalizedValue(
  data: any,
  field: string,
  locale: string,
  fallbackLocale: string = 'en',
): string | null {
  if (!data || !field) return null

  // Try to get the value for the requested locale
  if (data[field] && typeof data[field] === 'object' && data[field][locale]) {
    return data[field][locale]
  }

  // Fall back to the fallback locale
  if (data[field] && typeof data[field] === 'object' && data[field][fallbackLocale]) {
    return data[field][fallbackLocale]
  }

  // If it's not localized, return the value directly
  if (typeof data[field] === 'string') {
    return data[field]
  }

  return null
}

/**
 * Helper to check if a locale is supported by a tenant
 */
export async function isLocaleSupported(
  payload: Payload,
  tenantId: string,
  locale: string,
): Promise<boolean> {
  const supportedLocales = await getTenantLocales(payload, tenantId)
  return supportedLocales.includes(locale)
}

/**
 * Get the best matching locale for a tenant based on user preference
 */
export async function getBestLocale(
  payload: Payload,
  tenantId: string,
  preferredLocale?: string,
): Promise<string> {
  const supportedLocales = await getTenantLocales(payload, tenantId)

  // If no preference, return the first supported locale
  if (!preferredLocale) {
    return supportedLocales[0] || 'en'
  }

  // If preferred locale is supported, use it
  if (supportedLocales.includes(preferredLocale)) {
    return preferredLocale
  }

  // Try to find a similar locale (e.g., 'en-US' -> 'en')
  const languageCode = preferredLocale.split('-')[0]
  const matchingLocale = supportedLocales.find((locale) => locale.startsWith(languageCode))

  if (matchingLocale) {
    return matchingLocale
  }

  // Fall back to first supported locale
  return supportedLocales[0] || 'en'
}
