/* eslint-disable multiline-ternary */
import React from 'react'
import MainRouter from './src/router/main'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { ThemeProvider } from './src/contexts/theme/ThemeContext'
import { ConfigI18nProvider } from './src/contexts/i18n/Configi18nContext'
import { getSecureStorage } from './src/config/mmkv'
import { DialogProvider } from './src/contexts/alerts/DialogContext'
import { AuthProvider } from './src/contexts/auth/AuthContext'
import useSecureStorage from './src/hooks/useSecureStorage'

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

  return storageMMKV ? (
    <SafeAreaProvider>
      <ConfigI18nProvider>
        <ThemeProvider>
          <DialogProvider>
            <AuthProvider>
              <MainRouter />
            </AuthProvider>
          </DialogProvider>
        </ThemeProvider>
      </ConfigI18nProvider>
    </SafeAreaProvider>
  ) : null
}

export default App
