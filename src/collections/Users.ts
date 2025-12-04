import { isAdmin, isAdminOrSelf } from '../access/roles'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  access: {
    read: isAdminOrSelf,
    create: isAdmin,
    update: isAdminOrSelf,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Caregiver', value: 'caregiver' },
        { label: 'Kitchen', value: 'kitchen' },
      ],
      defaultValue: 'caregiver',
      required: true,
      access: {
        update: isAdmin,
      },
    },
  ],
}
