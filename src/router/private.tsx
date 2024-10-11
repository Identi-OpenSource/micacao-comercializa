import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { ListModules } from '../features/modules/screens/ListModules'
import { ChangePassword } from '../features/users/screens/ChangePassword'
import { useQuery } from '@realm/react'
import { CONST_USER, User } from '../features/users/model/UserSchema'
import { useSecureStorage } from '../contexts/secure/SecureStorageContext'

const Stack = createNativeStackNavigator()

const PrivateStack = () => {
  const { getDataJWT } = useSecureStorage()
  const uuid = getDataJWT()?.uuid
  const userStatus = useQuery<User>('User').filtered('uuid == $0', uuid)[0]
    ?.user_status

  return (
    <Stack.Navigator initialRouteName="">
      {/* <Stack.Screen name="Home" component={HomeScreen} /> */}
      {userStatus === CONST_USER.status.force_change_password ? (
        <Stack.Group>
          <Stack.Screen name="ChangePassword" component={ChangePassword} />
        </Stack.Group>
      ) : (
        <Stack.Group>
          <Stack.Screen name="ListModules" component={ListModules} />
        </Stack.Group>
      )}
    </Stack.Navigator>
  )
}

export default PrivateStack
