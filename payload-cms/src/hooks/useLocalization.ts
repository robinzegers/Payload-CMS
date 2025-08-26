'use client'

import { useCallback, useEffect, useState } from 'react'
import { getLocalizedValue } from '../utilities/localization'

export interface UseLocalizationOptions {
  tenant: string
  locale: string
  fallbackLocale?: string
}

export interface LocalizationHookResult {
  currentLocale: string
  supportedLocales: string[]
  switchLocale: (newLocale: string) => void
  getLocalizedContent: (data: any, field: string) => string | null
  isLoading: boolean
  error: string | null
}

/**
 * React hook for handling localization in the frontend
 */
export function useLocalization({
  tenant,
  locale,
  fallbackLocale = 'en',
}: UseLocalizationOptions): LocalizationHookResult {
  const [currentLocale, setCurrentLocale] = useState(locale)
  const [supportedLocales, setSupportedLocales] = useState<string[]>([locale])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load supported locales for the tenant
  useEffect(() => {
    const loadSupportedLocales = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch(`/api/tenants/${tenant}/locales`)

        if (!response.ok) {
          throw new Error(`Failed to load supported locales: ${response.statusText}`)
        }

        const data = await response.json()
        setSupportedLocales(data.locales || [locale])

        // If current locale is not supported, switch to the best available one
        if (!data.locales?.includes(currentLocale)) {
          const bestLocale = data.locales?.[0] || fallbackLocale
          setCurrentLocale(bestLocale)
        }
      } catch (err) {
        console.error('Error loading supported locales:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
        setSupportedLocales([locale])
      } finally {
        setIsLoading(false)
      }
    }

    if (tenant) {
      loadSupportedLocales()
    }
  }, [tenant, locale, fallbackLocale, currentLocale])

  // Function to switch locale
  const switchLocale = useCallback(
    (newLocale: string) => {
      if (supportedLocales.includes(newLocale)) {
        setCurrentLocale(newLocale)

        // Store preference in localStorage
        try {
          localStorage.setItem(`locale_${tenant}`, newLocale)
        } catch (e) {
          // Ignore localStorage errors
        }
      }
    },
    [supportedLocales, tenant],
  )

  // Function to get localized content
  const getLocalizedContent = useCallback(
    (data: any, field: string): string | null => {
      return getLocalizedValue(data, field, currentLocale, fallbackLocale)
    },
    [currentLocale, fallbackLocale],
  )

  return {
    currentLocale,
    supportedLocales,
    switchLocale,
    getLocalizedContent,
    isLoading,
    error,
  }
}

/**
 * Helper function to get supported locale labels
 */
export function getLocaleLabels(): Record<string, string> {
  return {
    en: 'English',
    es: 'Español',
    fr: 'Français',
    de: 'Deutsch',
    nl: 'Nederlands',
    it: 'Italiano',
    pt: 'Português',
    zh: '中文',
    ja: '日本語',
    ko: '한국어',
  }
}
