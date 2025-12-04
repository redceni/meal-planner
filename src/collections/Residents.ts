import { isAdmin, isAuthenticated } from '../access/roles'

export const Residents: CollectionConfig = {
  slug: 'residents',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: isAuthenticated, // Everyone needs to see residents
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'room',
      type: 'text',
      label: 'Room Number',
    },
    {
      name: 'table',
      type: 'text',
      label: 'Table Number',
    },
    {
      name: 'station',
      type: 'text',
      label: 'Station',
    },
    {
      name: 'dietaryRestrictions',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Diabetes', value: 'diabetes' },
        { label: 'Lactose Free', value: 'lactose-free' },
        { label: 'Gluten Free', value: 'gluten-free' },
        { label: 'Vegetarian', value: 'vegetarian' },
        { label: 'Vegan', value: 'vegan' },
        { label: 'No Pork', value: 'no-pork' },
      ],
    },
    {
      name: 'aversions',
      type: 'textarea',
      label: 'Aversions / Dislikes',
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Other Notes',
    },
  ],
}
