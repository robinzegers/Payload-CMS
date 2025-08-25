# Tenant Settings Configuration

This document describes the comprehensive tenant settings system implemented in your Payload CMS project. Each tenant can now be configured with specific settings for campaigns, games, registration, analytics, and more.

## Settings Overview

Each tenant can be configured with the following settings:

### Campaign Settings

- **Campaign ID**: Unique identifier for the campaign
- **Market**: Market identifier for this tenant

### Game Configuration

- **Game Key**: Unique game key identifier
- **Languages**: Array of supported languages (en, es, fr, de, nl, it, pt, zh, ja, ko)

### Registration & Redemption Settings

- **External Registration**: Enable external registration system integration
- **Enable QR Redeem**: Enable QR code redemption functionality
- **Enable Code Claim**: Enable code claim functionality
- **Code Claim Fields**: Custom fields for code claim process with field type, required status, and placeholder text

### Timeline Settings

- **Start Date**: Campaign start date and time
- **End Date**: Campaign end date and time
- **Country Timezone**: Primary timezone for this tenant (supports major timezones)

### Analytics & Integration

- **Looker Studio Connector**: Looker Studio connector configuration

### Location Settings

- **Country Code**: ISO country code (US, CA, GB, DE, FR, ES, IT, NL, BE, AU, JP, KR, CN, BR, MX)

### Data Collection Settings

- **Collection ID**: Collection identifier for data organization
- **Purpose IDs**: Array of purpose identifiers for data processing with descriptions and required status

## Usage

### Basic Usage

```typescript
import { getTenantSettings } from '../utilities/tenant-settings'

// Get all settings for a tenant
const settings = getTenantSettings(tenant)
console.log(settings.campaignId)
console.log(settings.languages)
```

### Feature Flags

```typescript
import { isQrRedeemEnabled, isCodeClaimEnabled } from '../utilities/tenant-settings'

// Check if features are enabled
if (isQrRedeemEnabled(tenant)) {
  // Show QR redeem functionality
}

if (isCodeClaimEnabled(tenant)) {
  // Show code claim form
}
```

### Campaign Status

```typescript
import { isCampaignActive } from '../utilities/tenant-settings'

// Check if campaign is currently active
if (isCampaignActive(tenant)) {
  // Show active campaign content
} else {
  // Show coming soon or ended message
}
```

### Language Support

```typescript
import { getTenantLanguages, isTenantLanguageSupported } from '../utilities/tenant-settings'

// Get supported languages
const languages = getTenantLanguages(tenant)

// Check if a language is supported
if (isTenantLanguageSupported(tenant, 'es')) {
  // Show Spanish content
}
```

### Dynamic Form Generation

```typescript
import { getCodeClaimFields } from '../utilities/tenant-settings'

// Generate form fields based on tenant configuration
const fields = getCodeClaimFields(tenant)
fields.forEach((field) => {
  // Create form field based on field.fieldType
  // field.fieldName, field.required, field.placeholder
})
```

### Analytics Configuration

```typescript
import { getCampaignInfo } from '../utilities/tenant-settings'

// Get campaign information for analytics
const { campaignId, market, gameKey } = getCampaignInfo(tenant)
```

### Data Compliance

```typescript
import { getTenantPurposeIds } from '../utilities/tenant-settings'

// Get all purpose IDs
const allPurposes = getTenantPurposeIds(tenant)

// Get only required purposes
const requiredPurposes = getTenantPurposeIds(tenant, true)
```

## Admin Interface

The tenant settings are organized into logical groups in the Payload admin interface:

1. **Campaign Settings**: Campaign ID and market configuration
2. **Game Configuration**: Game key and supported languages
3. **Registration & Redemption Settings**: External registration, QR redeem, and code claim configuration
4. **Timeline Settings**: Start/end dates and timezone
5. **Analytics & Integration**: Looker Studio connector
6. **Location Settings**: Country code
7. **Data Collection Settings**: Collection ID and purpose IDs

## Field Types

### Code Claim Fields

When code claim is enabled, you can configure custom fields with these types:

- **Text**: Regular text input
- **Email**: Email validation
- **Number**: Numeric input
- **Date**: Date picker
- **Select**: Dropdown selection
- **Checkbox**: Boolean checkbox

### Language Options

Supported languages include:

- English (en)
- Spanish (es)
- French (fr)
- German (de)
- Dutch (nl)
- Italian (it)
- Portuguese (pt)
- Chinese (zh)
- Japanese (ja)
- Korean (ko)

### Timezone Options

Supported timezones include major regions:

- UTC
- US timezones (Eastern, Central, Mountain, Pacific)
- European timezones (London, Paris, Berlin, Amsterdam)
- Asian timezones (Tokyo, Shanghai, Seoul)
- Australian timezone (Sydney)

### Country Codes

Supported countries include:

- United States (US)
- Canada (CA)
- United Kingdom (GB)
- Germany (DE)
- France (FR)
- Spain (ES)
- Italy (IT)
- Netherlands (NL)
- Belgium (BE)
- Australia (AU)
- Japan (JP)
- South Korea (KR)
- China (CN)
- Brazil (BR)
- Mexico (MX)

## Examples

See `src/utilities/tenant-settings-examples.ts` for comprehensive usage examples including:

- Feature flag handling
- Dynamic form generation
- Analytics setup
- Data compliance checking
- Timezone-aware date formatting
- Next.js middleware integration

## Type Safety

All tenant settings are fully typed using TypeScript. The types are automatically generated by Payload CMS when you run:

```bash
npm run generate:types
```

This ensures type safety when working with tenant settings throughout your application.
