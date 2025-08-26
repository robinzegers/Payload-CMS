'use client'

import React, { createContext, useContext, ReactNode } from 'react'
import {
  LocalizationHookResult,
  useLocalization,
  getLocaleLabels,
} from '../../hooks/useLocalization'

const LocalizationContext = createContext<LocalizationHookResult | null>(null)

interface LocalizationProviderProps {
  children: ReactNode
  tenant: string
  locale: string
  fallbackLocale?: string
}

export function LocalizationProvider({
  children,
  tenant,
  locale,
  fallbackLocale = 'en',
}: LocalizationProviderProps) {
  const localizationResult = useLocalization({ tenant, locale, fallbackLocale })

  return (
    <LocalizationContext.Provider value={localizationResult}>
      {children}
    </LocalizationContext.Provider>
  )
}

export function useLocalizationContext(): LocalizationHookResult {
  const context = useContext(LocalizationContext)
  if (!context) {
    throw new Error('useLocalizationContext must be used within a LocalizationProvider')
  }
  return context
}

/**
 * Component for displaying localized content
 */
interface LocalizedTextProps {
  data: any
  field: string
  fallback?: string
  className?: string
}

export function LocalizedText({ data, field, fallback, className }: LocalizedTextProps) {
  const { getLocalizedContent } = useLocalizationContext()
  const content = getLocalizedContent(data, field) || fallback || ''

  return <span className={className}>{content}</span>
}

/**
 * Language switcher component
 */
interface LanguageSwitcherProps {
  className?: string
  showLabels?: boolean
}

export function LanguageSwitcher({ className, showLabels = true }: LanguageSwitcherProps) {
  const { currentLocale, supportedLocales, switchLocale } = useLocalizationContext()
  const localeLabels = getLocaleLabels()

  if (supportedLocales.length <= 1) {
    return null // Don't show switcher if only one locale
  }

  return (
    <select
      className={className}
      value={currentLocale}
      onChange={(e) => switchLocale(e.target.value)}
    >
      {supportedLocales.map((locale) => (
        <option key={locale} value={locale}>
          {showLabels ? localeLabels[locale] || locale : locale}
        </option>
      ))}
    </select>
  )
}
