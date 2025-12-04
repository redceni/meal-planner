import { isAdmin, isCaregiver, isKitchen, isAuthenticated } from '../access/roles'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['date', 'mealType', 'resident', 'status'],
    components: {
      beforeList: ['/components/KitchenDashboardLink#default'],
    },
  },
  access: {
    read: isAuthenticated,
    create: ({ req: { user } }) => Boolean(user?.role === 'admin' || user?.role === 'caregiver'),
    update: isAuthenticated,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'date',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
      access: {
        update: ({ req: { user } }) => user?.role !== 'kitchen',
      },
    },
    {
      name: 'mealType',
      type: 'select',
      required: true,
      options: [
        { label: 'Breakfast', value: 'breakfast' },
        { label: 'Lunch', value: 'lunch' },
        { label: 'Dinner', value: 'dinner' },
      ],
      access: {
        update: ({ req: { user } }) => user?.role !== 'kitchen',
      },
    },
    {
      name: 'resident',
      type: 'relationship',
      relationTo: 'residents',
      required: true,
      access: {
        update: ({ req: { user } }) => user?.role !== 'kitchen',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Prepared', value: 'prepared' },
      ],
      admin: {
        components: {
          Cell: '/components/StatusCell#default',
        },
      },
    },
    {
      name: 'highCalorie',
      type: 'checkbox',
      label: 'High Calorie (Hochkalorisch)',
      access: {
        update: ({ req: { user } }) => user?.role !== 'kitchen',
      },
    },
    {
      name: 'aversions',
      type: 'textarea',
      label: 'Dislikes / Aversions (Abneigungen)',
      admin: {
        description: 'Specific dislikes or aversions for this meal',
      },
      access: {
        update: ({ req: { user } }) => user?.role !== 'kitchen',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Other Notes (Sonstiges)',
      admin: {
        description: 'Any other special instructions or notes',
      },
      access: {
        update: ({ req: { user } }) => user?.role !== 'kitchen',
      },
    },
    // Breakfast Fields
    {
      name: 'breakfast',
      type: 'group',
      admin: {
        condition: (_, siblingData) => siblingData?.mealType === 'breakfast',
      },
      access: {
        update: ({ req: { user } }) => user?.role !== 'kitchen',
      },
      fields: [
        {
          name: 'standardBreakfast',
          type: 'checkbox',
          label: 'Standard Breakfast (according to plan)',
        },
        {
          name: 'bread',
          type: 'select',
          hasMany: true,
          options: [
            { label: 'Bread Roll (Brötchen)', value: 'roll' },
            { label: 'Whole Grain Roll (Vollkornbrötchen)', value: 'whole-grain-roll' },
            { label: 'Grey Bread (Graubrot)', value: 'grey-bread' },
            { label: 'Whole Grain Bread (Vollkornbrot)', value: 'whole-grain-bread' },
            { label: 'White Bread (Weißbrot)', value: 'white-bread' },
            { label: 'Crispbread (Knäckebrot)', value: 'crispbread' },
            { label: 'Puree/Porridge (Brei)', value: 'porridge' },
          ],
        },
        // Puree checkbox removed as it's now in bread options
        {
          name: 'preparation',
          type: 'select',
          options: [
            { label: 'Sliced (geschnitten)', value: 'sliced' },
            { label: 'Spread (geschmiert)', value: 'spread' },
          ],
        },
        {
          name: 'spreads',
          type: 'select',
          hasMany: true,
          options: [
            { label: 'Butter', value: 'butter' },
            { label: 'Margarine', value: 'margarine' },
            { label: 'Jam (Konfitüre)', value: 'jam' },
            { label: 'Diabetic Jam', value: 'diabetic-jam' },
            { label: 'Honey', value: 'honey' },
            { label: 'Cheese', value: 'cheese' },
            { label: 'Quark', value: 'quark' },
            { label: 'Sausage (Wurst)', value: 'sausage' },
          ],
        },
        {
          name: 'beverages',
          type: 'select',
          hasMany: true,
          options: [
            { label: 'Coffee', value: 'coffee' },
            { label: 'Tea', value: 'tea' },
            { label: 'Hot Milk', value: 'hot-milk' },
            { label: 'Cold Milk', value: 'cold-milk' },
          ],
        },
        {
          name: 'additions',
          type: 'select',
          hasMany: true,
          options: [
            { label: 'Sugar', value: 'sugar' },
            { label: 'Sweetener', value: 'sweetener' },
            { label: 'Creamer', value: 'creamer' },
          ],
        },
      ],
    },
    // Lunch Fields
    {
      name: 'lunch',
      type: 'group',
      admin: {
        condition: (_, siblingData) => siblingData?.mealType === 'lunch',
      },
      access: {
        update: ({ req: { user } }) => user?.role !== 'kitchen',
      },
      fields: [
        {
          name: 'portionSize',
          type: 'select',
          options: [
            { label: 'Small', value: 'small' },
            { label: 'Large', value: 'large' },
            { label: 'Vegetarian', value: 'vegetarian' },
          ],
        },
        {
          name: 'soup',
          type: 'checkbox',
          label: 'Soup',
        },
        {
          name: 'dessert',
          type: 'checkbox',
          label: 'Dessert',
        },
        {
          name: 'specialPreparation',
          type: 'select',
          hasMany: true,
          options: [
            { label: 'Pureed Food', value: 'pureed-food' },
            { label: 'Pureed Meat', value: 'pureed-meat' },
            { label: 'Sliced Meat', value: 'sliced-meat' },
            { label: 'Mashed Potatoes', value: 'mashed-potatoes' },
          ],
        },
        {
          name: 'restrictions',
          type: 'select',
          hasMany: true,
          options: [
            { label: 'No Fish', value: 'no-fish' },
            { label: 'Fingerfood', value: 'fingerfood' },
            { label: 'Only Sweet', value: 'only-sweet' },
          ],
        },
      ],
    },
    // Dinner Fields
    {
      name: 'dinner',
      type: 'group',
      admin: {
        condition: (_, siblingData) => siblingData?.mealType === 'dinner',
      },
      access: {
        update: ({ req: { user } }) => user?.role !== 'kitchen',
      },
      fields: [
        {
          name: 'standardDinner',
          type: 'checkbox',
          label: 'Standard Dinner (according to plan)',
        },
        {
          name: 'bread',
          type: 'select',
          hasMany: true,
          options: [
            { label: 'Grey Bread (Graubrot)', value: 'grey-bread' },
            { label: 'Whole Grain Bread (Vollkornbrot)', value: 'whole-grain-bread' },
            { label: 'White Bread (Weißbrot)', value: 'white-bread' },
            { label: 'Crispbread (Knäckebrot)', value: 'crispbread' },
          ],
        },
        {
          name: 'preparation',
          type: 'select',
          options: [
            { label: 'Sliced (geschnitten)', value: 'sliced' },
            { label: 'Spread (geschmiert)', value: 'spread' },
          ],
        },
        {
          name: 'spreads',
          type: 'select',
          hasMany: true,
          options: [
            { label: 'Butter', value: 'butter' },
            { label: 'Margarine', value: 'margarine' },
          ],
        },
        {
          name: 'soup',
          type: 'checkbox',
          label: 'Soup',
        },
        {
          name: 'puree',
          type: 'checkbox',
          label: 'Puree (Brei)',
        },
        {
          name: 'noFish',
          type: 'checkbox',
          label: 'No Fish',
        },
        {
          name: 'beverages',
          type: 'select',
          hasMany: true,
          options: [
            { label: 'Tea', value: 'tea' },
            { label: 'Cocoa', value: 'cocoa' },
            { label: 'Hot Milk', value: 'hot-milk' },
            { label: 'Cold Milk', value: 'cold-milk' },
          ],
        },
        {
          name: 'additions',
          type: 'select',
          hasMany: true,
          options: [
            { label: 'Sugar', value: 'sugar' },
            { label: 'Sweetener', value: 'sweetener' },
          ],
        },
      ],
    },
  ],
}
