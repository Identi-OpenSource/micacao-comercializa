import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect
} from 'react'
import { KEYS_MMKV } from '../../config/mmkv'
import useSecureStorage from '../../hooks/useSecureStorage'
import { getDataFromJWT } from '../../utils/jwt'

interface AuthContextType {
  isAuthenticated: boolean
  login: () => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: () => {},
  logout: () => {}
})

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const { getItem, storageMMKV, clearMMKV } = useSecureStorage()

  useEffect(() => {
    if (storageMMKV !== null) {
      const token = getItem(KEYS_MMKV.ACCESS_TOKEN) as string
      // const tokenRefresh = getItem(KEYS_MMKV.REFRESH_TOKEN) as string
      const decoded = token && getDataFromJWT(token)
      // const decodedRefresh = tokenRefresh && getDataFromJWT(tokenRefresh)
      if (decoded?.isDateValid /* || decodedRefresh?.isDateValid */) {
        login()
      } else {
        logout()
      }
    }
  }, [storageMMKV])

  const login = () => {
    setIsAuthenticated(true)
  }

  const logout = () => {
    clearMMKV()
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
