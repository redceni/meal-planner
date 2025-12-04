import type { Payload } from 'payload'

export const seed = async (payload: Payload): Promise<void> => {
  payload.logger.info('Seeding data...')

  // Create Users
  const users = await payload.find({
    collection: 'users',
    where: {
      email: {
        equals: 'admin@example.com',
      },
    },
  })

  if (users.totalDocs > 0) {
    payload.logger.info('Seeding skipped, data already exists.')
    return
  }

  await payload.create({
    collection: 'users',
    data: {
      email: 'admin@example.com',
      password: 'test',
      role: 'admin',
    },
  })

  await payload.create({
    collection: 'users',
    data: {
      email: 'caregiver@example.com',
      password: 'test',
      role: 'caregiver',
    },
  })

  await payload.create({
    collection: 'users',
    data: {
      email: 'kitchen@example.com',
      password: 'test',
      role: 'kitchen',
    },
  })

  // Create Residents
  const resident1 = await payload.create({
    collection: 'residents',
    data: {
      name: 'Hans Müller',
      room: '101',
      table: '1',
      station: 'A',
      dietaryRestrictions: ['diabetes'],
      notes: 'Likes coffee very hot',
    },
  })

  const resident2 = await payload.create({
    collection: 'residents',
    data: {
      name: 'Maria Schmidt',
      room: '102',
      table: '1',
      station: 'A',
      dietaryRestrictions: ['lactose-free'],
    },
  })

  const resident3 = await payload.create({
    collection: 'residents',
    data: {
      name: 'Klaus Weber',
      room: '103',
      table: '2',
      station: 'A',
      dietaryRestrictions: ['vegetarian'],
    },
  })

  const resident4 = await payload.create({
    collection: 'residents',
    data: {
      name: 'Anna Fischer',
      room: '104',
      table: '2',
      station: 'A',
      aversions: 'No tomatoes',
    },
  })

  const resident5 = await payload.create({
    collection: 'residents',
    data: {
      name: 'Peter Wagner',
      room: '105',
      table: '3',
      station: 'B',
      dietaryRestrictions: ['no-pork'],
    },
  })

  // Create Orders
  const today = new Date().toISOString().split('T')[0]
  
  // Breakfast Orders
  await payload.create({
    collection: 'orders',
    data: {
      date: today,
      mealType: 'breakfast',
      resident: resident1.id,
      status: 'prepared',
      aversions: 'No cold beverages today',
      notes: 'Please serve coffee extra hot as usual',
      breakfast: {
        standardBreakfast: true,
        beverages: ['coffee'],
        additions: ['sweetener'],
      },
    },
  })

  await payload.create({
    collection: 'orders',
    data: {
      date: today,
      mealType: 'breakfast',
      resident: resident2.id,
      status: 'prepared',
      breakfast: {
        bread: ['roll', 'whole-grain-roll'],
        spreads: ['butter', 'jam'],
        beverages: ['tea'],
      },
    },
  })

  // Lunch Orders
  await payload.create({
    collection: 'orders',
    data: {
      date: today,
      mealType: 'lunch',
      resident: resident1.id,
      status: 'pending',
      lunch: {
        portionSize: 'large',
        soup: true,
        dessert: true,
      },
    },
  })

  await payload.create({
    collection: 'orders',
    data: {
      date: today,
      mealType: 'lunch',
      resident: resident3.id,
      status: 'pending',
      notes: 'Birthday today - please add a small candle on dessert if possible',
      lunch: {
        portionSize: 'vegetarian',
        dessert: true,
      },
    },
  })

  // Dinner Orders
  await payload.create({
    collection: 'orders',
    data: {
      date: today,
      mealType: 'dinner',
      resident: resident4.id,
      status: 'pending',
      aversions: 'No onions in soup please',
      dinner: {
        standardDinner: true,
        soup: true,
        beverages: ['tea'],
      },
    },
  })

  await payload.create({
    collection: 'orders',
    data: {
      date: today,
      mealType: 'dinner',
      resident: resident5.id,
      status: 'pending',
      dinner: {
        bread: ['grey-bread', 'white-bread'],
        spreads: ['margarine'],
        beverages: ['hot-milk'],
      },
    },
  })

  payload.logger.info('Seeding completed!')
}
