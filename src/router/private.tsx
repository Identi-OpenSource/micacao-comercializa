import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { ChangePassword } from '../screens/private/users/ChangePassword'
import { useQuery } from '@realm/react'
import { CONST_USER, User } from '../db/models/UserSchema'
import { useSecureStorage } from '../contexts/secure/SecureStorageContext'
import { ListModules } from '../screens/private/modules/ListModules'
import { AddEntity } from '../screens/private/entity/AddEntity'

export type RootStackParamList = {
  ChangePassword: undefined
  ListModules: undefined
  AddEntity: { _id: string }
}

const Stack = createNativeStackNavigator<RootStackParamList>()

const PrivateStack = () => {
  const { getDataJWT } = useSecureStorage()
  const uuid = getDataJWT()?.uuid
  const userStatus = useQuery<User>('User').filtered('uuid == $0', uuid)[0]
    ?.user_status

  return (
    <Stack.Navigator>
      {/* <Stack.Screen name="Home" component={HomeScreen} /> */}
      {userStatus === CONST_USER.status.force_change_password ? (
        <Stack.Group screenOptions={{ headerShown: false }}>
          <Stack.Screen name="ChangePassword" component={ChangePassword} />
        </Stack.Group>
      ) : (
        <>
          <Stack.Group>
            <Stack.Screen name="ListModules" component={ListModules} />
          </Stack.Group>
          <Stack.Group>
            <Stack.Screen name="AddEntity" component={AddEntity} />
          </Stack.Group>
        </>
      )}
    </Stack.Navigator>
  )
}

export default PrivateStack
