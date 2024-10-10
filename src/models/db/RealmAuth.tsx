import { RealmProvider, useApp } from '@realm/react'
import React from 'react'
import Realm from 'realm'
import { ModuleSchema } from './ModuleSchema'

export const RealmAuth = ({ children }: any) => {
  const app = useApp()
  const realmAccessBehavior: Realm.OpenRealmBehaviorConfiguration = {
    type: Realm.OpenRealmBehaviorType.OpenImmediately
  }

  const schemas = [ModuleSchema]

  if (!app?.currentUser?.id) {
    return <></>
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
              const modules = realm
                .objects('Module')
                .filtered('tenant == $0', 'sfsf')
              // const users = realm
              //   .objects('User')
              //   .filtered('tenant == $0', user?.data?.tenant)
              // const person = realm
              //   .objects('PersonEntity')
              //   .filtered('tenant == $0', user?.data?.tenant)
              // const country = realm.objects('Country')
              // const department = realm.objects('Department')
              // const province = realm.objects('Province')
              // const district = realm.objects('District')

              mutableSubs.add(modules, { name: 'modulesSubscription' })
              // mutableSubs.add(users, { name: 'usersSubscription' })
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
