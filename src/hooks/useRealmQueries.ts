import { useObject, useQuery } from '@realm/react'
import { Module } from '../db/models/ModuleSchema'
import { User } from '../db/models/UserSchema'
import { useSecureStorage } from '../contexts/secure/SecureStorageContext'
import { useMemo } from 'react'
import { ModuleSchema } from '../db/models/ModuleSchemaSchema'
import { BSON } from 'realm'

export const useRealmQueries = () => {
  const { getDataJWT } = useSecureStorage()
  const tenant = getDataJWT()?.tenant || ''
  const uuidUser = getDataJWT()?.uuid || ''

  const allModules = useQuery<Module>('Module')
  const allModuleSchemas = useQuery<ModuleSchema>('ModuleSchema')
  const users = useQuery<User>('User')

  const getModules = useMemo(() => {
    return allModules.filtered('tenant == $0', tenant)
  }, [tenant, allModules])

  const getModuleSchemaById = useMemo(
    () => (id: string) => {
      return allModuleSchemas.filtered('id == $0', id)?.[0]
    },
    [tenant, allModuleSchemas]
  )

  const getUser = useMemo(() => {
    const user = users.filtered('uuid == $0', uuidUser)
    return user.length > 0 ? user[0] : undefined
  }, [uuidUser, users])

  return {
    getModules,
    getModuleSchemaById,
    getUser
  }
}

// Custom hook para obtener un Module por su id directamente sin useMemo
export const useModuleById = (_id: string) => {
  const id = new BSON.ObjectId(_id)
  const module = useObject<Module>('Module', id)

  return module
}
