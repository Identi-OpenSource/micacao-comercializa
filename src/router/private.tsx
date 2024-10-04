import React from 'react'
import { LoginScreen } from '../screens/public/login/LoginScreen'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

const Stack = createNativeStackNavigator()

const PrivateStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={LoginScreen} />
    </Stack.Navigator>
  )
}

export default PrivateStack
