// Utility function to check if a user is a super admin
export const isSuperAdmin = (user: any): boolean => {
  return user?.roles?.includes('super-admin')
}

// Utility function to get tenant IDs for a user
export const getUserTenantIDs = (user: any): string[] => {
  if (!user?.tenants?.length) return []

  return user.tenants
    .map((tenantRow: any) => {
      if (typeof tenantRow.tenant === 'string') {
        return tenantRow.tenant
      }
      return tenantRow.tenant?.id
    })
    .filter(Boolean)
}
