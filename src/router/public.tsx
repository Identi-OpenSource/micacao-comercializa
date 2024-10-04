import React from 'react'
import { LoginScreen } from '../screens/public/login/LoginScreen'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { COLORS } from '../contexts/theme/neutralTheme'

const Stack = createNativeStackNavigator()

const PublicStack = () => {
  const insets = useSafeAreaInsets()
  const screenOptions = {
    headerShown: false,
    contentStyle: {
      backgroundColor: COLORS.background,
      paddingTop: insets.top
    }
  }
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="Home" component={LoginScreen} />
    </Stack.Navigator>
  )
}

export default PublicStack
