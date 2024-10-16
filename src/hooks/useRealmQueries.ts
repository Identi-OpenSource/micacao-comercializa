import { useObject, useQuery } from '@realm/react'
import { Module } from '../db/models/ModuleSchema'
import { User } from '../db/models/UserSchema'
import { useSecureStorage } from '../contexts/secure/SecureStorageContext'
import { useMemo } from 'react'
import { ModuleSchema } from '../db/models/ModuleSchemaSchema'
import { BSON } from 'realm'
import { PersonEntity } from '../db/models/PersonEntitySchema'
import { GLOBALS } from '../config/consts'

export const useRealmQueries = () => {
  const { getDataJWT } = useSecureStorage()
  const tenant = getDataJWT()?.tenant || ''
  const uuidUser = getDataJWT()?.uuid || ''

  const allModules = useQuery<Module>('Module')
  const allModuleSchemas = useQuery<ModuleSchema>('ModuleSchema')
  const users = useQuery<User>('User')
  const personEntity = useQuery<PersonEntity>('PersonEntity')

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

  const getPersonEntity = useMemo(() => {
    const persons = personEntity.filtered('tenant == $0', tenant)
    return persons.length > 0 ? persons : undefined
  }, [uuidUser])

  const getAllEntities = useMemo(
    () => (entity: string) => {
      switch (entity) {
        case GLOBALS.entity_type.PER:
        case GLOBALS.entity_type.PERSON:
          return getPersonEntity

        default:
          break
      }
    },
    []
  )

  return {
    getModules,
    getModuleSchemaById,
    getUser,
    getPersonEntity,
    getAllEntities
  }
}

// Custom hook para obtener un Module por su id directamente sin useMemo
export const useModuleById = (_id: string) => {
  const id = new BSON.ObjectId(_id)
  const module = useObject<Module>('Module', id)

  return module
}
