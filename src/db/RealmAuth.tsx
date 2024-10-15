import { RealmProvider, useApp, useRealm } from '@realm/react'
import React, { useEffect } from 'react'
import Realm from 'realm'
import { ModuleSchema } from './models/ModuleSchema'
import { useSecureStorage } from '../contexts/secure/SecureStorageContext'
import { LoadingStore } from '../components/loading/LoadingFull'
import { UserSchema } from './models/UserSchema'
import { ModuleSchemaSchema } from './models/ModuleSchemaSchema'
import { useRealmQueries } from '../hooks/useRealmQueries'

export const RealmAuth = ({ children }: any) => {
  const app = useApp()
  const { getDataJWT, storageMMKV } = useSecureStorage()
  const realmAccessBehavior: Realm.OpenRealmBehaviorConfiguration = {
    type: Realm.OpenRealmBehaviorType.OpenImmediately
  }

  const schemas = [ModuleSchema, ModuleSchemaSchema, UserSchema]

  if (!app?.currentUser?.id || !storageMMKV) {
    return <LoadingStore />
  }

  const dataJWT = getDataJWT()

  return (
    <RealmProvider
      schema={schemas}
      sync={{
        user: app?.currentUser,
        flexible: true,
        initialSubscriptions: {
          rerunOnOpen: true,
          update: (mutableSubs, realm) => {
            try {
              const users = realm
                .objects('User')
                .filtered('tenant == $0', dataJWT?.tenant)
              const modules = realm
                .objects('Module')
                .filtered('tenant == $0', dataJWT?.tenant)

              mutableSubs.add(users, { name: 'usersSubscription' })
              mutableSubs.add(modules, { name: 'modulesSubscription' })
            } catch (error) {
              console.error('Error in initialSubscriptions:', error)
            }
          }
        },
        newRealmFileBehavior: realmAccessBehavior,
        existingRealmFileBehavior: realmAccessBehavior,
        onError: (session, error) => {
          console.log('Session connectionState => ', session.connectionState)
          console.error('Sync error => ', error.message)
        }
      }}>
      <AllProcesses children={children} />
    </RealmProvider>
  )
}

// por si hay que agregar más procesos después de la sincronización inicial
const AllProcesses = ({ children }: any) => {
  const { getModules } = useRealmQueries()
  const realm = useRealm()

  useEffect(() => {
    const subscribeToModuleSchemas = async () => {
      try {
        await realm.subscriptions.update(mutableSubs => {
          const schemaIds = getModules?.map(
            module => module?.schema_id
          ) as string[]
          if (schemaIds.length > 0) {
            mutableSubs.add(
              realm.objects('ModuleSchema').filtered('id IN $0', schemaIds),
              { name: 'moduleSchemaSubscription' }
            )
          }
        })
      } catch (error) {
        console.error('Error updating subscriptions:', error)
      }
    }

    // Verifica que existan módulos antes de intentar la suscripción
    if (getModules?.length > 0) {
      subscribeToModuleSchemas()
    }
  }, [getModules, realm])

  return children
}
