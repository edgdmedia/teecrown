type UserWithRole = {
  id?: number | string
  role?: 'admin' | 'editor' | null
}

type AccessArgs = {
  req: { user?: UserWithRole | null }
  id?: number | string
}

const isAdmin = (user?: UserWithRole | null) => !user?.role || user.role === 'admin'
const isEditor = (user?: UserWithRole | null) => user?.role === 'editor'

export const adminsOnly: (args: AccessArgs) => boolean = ({ req: { user } }) =>
  isAdmin(user as UserWithRole | null)

export const adminsAndEditors: (args: AccessArgs) => boolean = ({ req: { user } }) => {
  const currentUser = user as UserWithRole | null
  return isAdmin(currentUser) || isEditor(currentUser)
}

export const adminsOrSelf: (args: AccessArgs) => boolean = ({ req: { user }, id }) => {
  const currentUser = user as UserWithRole | null
  if (!currentUser) return false
  if (isAdmin(currentUser)) return true
  return String(currentUser.id) === String(id)
}
