import type { AccessArgs } from 'payload'
import type { User } from '../payload-types'

type Access = (args: AccessArgs<User>) => boolean

export const isAdmin: Access = ({ req: { user } }) => {
  return Boolean((user as any)?.role === 'admin')
}

export const isCaregiver: Access = ({ req: { user } }) => {
  return Boolean((user as any)?.role === 'caregiver')
}

export const isKitchen: Access = ({ req: { user } }) => {
  return Boolean((user as any)?.role === 'kitchen')
}

export const isAuthenticated: Access = ({ req: { user } }) => {
  return Boolean(user)
}

export const isAdminOrSelf: Access = ({ req: { user }, id }) => {
  if (!user) return false
  if ((user as any).role === 'admin') return true
  return user.id === id
}
