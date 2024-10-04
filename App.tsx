/* eslint-disable multiline-ternary */
import React from 'react'
import MainRouter from './src/router/main'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { ThemeProvider } from './src/contexts/theme/ThemeContext'
import { ConfigI18nProvider } from './src/contexts/i18n/Configi18nContext'
import { getSecureStorage } from './src/config/mmkv'
import { MMKV } from 'react-native-mmkv'
import { DialogProvider } from './src/contexts/alerts/DialogContext'

const App = () => {
  const [storage, setStorage] = React.useState<MMKV | null>(null)
  React.useEffect(() => {
    const initializeStorage = async () => {
      try {
        const secureStorage = await getSecureStorage()
        setStorage(secureStorage)
      } catch (error) {
        console.error('Error al inicializar el almacenamiento:', error)
      }
    }

    initializeStorage()
  }, [])
  return storage ? (
    <SafeAreaProvider>
      <ConfigI18nProvider>
        <ThemeProvider>
          <DialogProvider>
            <MainRouter />
          </DialogProvider>
        </ThemeProvider>
      </ConfigI18nProvider>
    </SafeAreaProvider>
  ) : null
}

export default App
