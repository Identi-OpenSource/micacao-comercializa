import React from 'react'
import { NavigationContainer } from '@react-navigation/native'

import PublicStack from './public'
import PrivateStack from './private'
import { StyleSheet, View } from 'react-native'
import { useAuth } from '../contexts/auth/AuthContext'

const MainRouter = () => {
  const { isAuthenticated } = useAuth()

  const styleObject = StyleSheet.create({
    container: {
      flex: 1
    }
  })

  return (
    <NavigationContainer>
      <View style={styleObject.container}>
        {isAuthenticated ? <PrivateStack /> : <PublicStack />}
      </View>
    </NavigationContainer>
  )
}

export default MainRouter
