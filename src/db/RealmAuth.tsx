import { RealmProvider, useApp } from '@realm/react'
import React from 'react'
import Realm from 'realm'
import { ModuleSchema } from '../features/modules/model/ModuleSchema'
import { useSecureStorage } from '../contexts/secure/SecureStorageContext'
import { LoadingStore } from '../components/loading/LoadingFull'
import { UserSchema } from '../features/users/model/UserSchema'

export const RealmAuth = ({ children }: any) => {
  const app = useApp()
  const { getDataJWT, storageMMKV } = useSecureStorage()
  const realmAccessBehavior: Realm.OpenRealmBehaviorConfiguration = {
    type: Realm.OpenRealmBehaviorType.OpenImmediately
  }

  const schemas = [ModuleSchema, UserSchema]

  if (!app?.currentUser?.id || !storageMMKV) {
    return <LoadingStore />
  }
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
              const dataJWT = getDataJWT()
              const users = realm
                .objects('User')
                .filtered('tenant == $0', dataJWT?.tenant)
              const modules = realm
                .objects('Module')
                .filtered('tenant == $0', dataJWT?.tenant)
              // const person = realm
              //   .objects('PersonEntity')
              //   .filtered('tenant == $0', user?.data?.tenant)
              // const country = realm.objects('Country')
              // const department = realm.objects('Department')
              // const province = realm.objects('Province')
              // const district = realm.objects('District')

              mutableSubs.add(users, { name: 'usersSubscription' })
              mutableSubs.add(modules, { name: 'modulesSubscription' })
              // mutableSubs.add(person, { name: 'personSubscription' })
              // mutableSubs.add(country, { name: 'countrySubscription' })
              // mutableSubs.add(department, { name: 'departmentSubscription' })
              // mutableSubs.add(province, { name: 'provinceSubscription' })
              // mutableSubs.add(district, { name: 'districtSubscription' })
            } catch (error) {
              console.error('Error in initialSubscriptions:', error)
            }
          }
        },
        newRealmFileBehavior: realmAccessBehavior,
        existingRealmFileBehavior: realmAccessBehavior,
        onError: (session, error) => {
          console.log('session => ', session.connectionState)
          console.error('error => ', error.message)
        }
      }}>
      {children}
    </RealmProvider>
  )
}
