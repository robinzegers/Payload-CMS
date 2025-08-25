import type { CollectionConfig } from 'payload'
import { tenantsArrayField } from '@payloadcms/plugin-multi-tenant/fields'

// Access control functions
const isSuperAdmin = (user: any): boolean => {
  return user?.roles?.includes('super-admin')
}

const createAccess = ({ req }: any) => {
  // Anyone can create their first user (public registration)
  // Only super-admins can create other users
  return !req.user || isSuperAdmin(req.user)
}

const readAccess = ({ req }: any) => {
  // Super-admins can read all users
  if (isSuperAdmin(req.user)) {
    return true
  }

  // Users can read themselves
  if (req.user) {
    return {
      id: {
        equals: req.user.id,
      },
    }
  }

  return false
}

const updateAndDeleteAccess = ({ req }: any) => {
  // Super-admins can update/delete all users
  if (isSuperAdmin(req.user)) {
    return true
  }

  // Users can update/delete themselves
  if (req.user) {
    return {
      id: {
        equals: req.user.id,
      },
    }
  }

  return false
}

const defaultTenantArrayField = tenantsArrayField({
  tenantsArrayFieldName: 'tenants',
  tenantsArrayTenantFieldName: 'tenant',
  tenantsCollectionSlug: 'tenants',
  arrayFieldAccess: {},
  tenantFieldAccess: {},
  rowFields: [
    {
      name: 'roles',
      type: 'select',
      defaultValue: ['tenant-viewer'],
      hasMany: true,
      options: ['tenant-admin', 'tenant-viewer'],
      required: true,
    },
  ],
})

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  access: {
    create: createAccess,
    delete: updateAndDeleteAccess,
    read: readAccess,
    update: updateAndDeleteAccess,
  },
  fields: [
    {
      admin: {
        position: 'sidebar',
      },
      name: 'roles',
      type: 'select',
      defaultValue: ['user'],
      hasMany: true,
      options: ['super-admin', 'user'],
      access: {
        update: ({ req }) => {
          return isSuperAdmin(req.user)
        },
      },
    },
    {
      name: 'username',
      type: 'text',
      index: true,
    },
    {
      ...defaultTenantArrayField,
      admin: {
        ...(defaultTenantArrayField?.admin || {}),
        position: 'sidebar',
      },
    },
  ],
}
