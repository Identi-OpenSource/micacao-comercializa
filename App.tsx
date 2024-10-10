import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import useSecureStorage from './src/hooks/useSecureStorage'
import { getSecureStorage } from './src/config/mmkv'
import { ProvidersAllApp } from './src/contexts/main/Providers'
import { AppProvider, UserProvider } from '@realm/react'
import PublicStack from './src/router/public'
import Config from 'react-native-config'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { RealmAuth } from './src/models/db/RealmAuth'
import PrivateStack from './src/router/private'

const App = () => {
  const { storageMMKV } = useSecureStorage()
  React.useEffect(() => {
    const initializeStorage = async () => {
      try {
        await getSecureStorage()
      } catch (error) {
        console.error('Error al inicializar el almacenamiento:', error)
      }
    }

    initializeStorage()
  }, [])

  // Configuración para realm de mongo Atlas
  return (
    <SafeAreaProvider>
      <AppProvider id={Config.ATLAS_APP || ''}>
        <ProvidersAllApp>
          <NavigationContainer>
            <UserProvider fallback={<PublicStack />}>
              <RealmAuth>{storageMMKV && <PrivateStack />}</RealmAuth>
            </UserProvider>
          </NavigationContainer>
        </ProvidersAllApp>
      </AppProvider>
    </SafeAreaProvider>
  )
}

export default App
