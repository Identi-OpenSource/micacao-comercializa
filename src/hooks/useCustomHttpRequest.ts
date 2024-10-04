import { useEffect } from 'react'
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { useNavigation } from '@react-navigation/native'
import useSecureStorage from './useSecureStorage'
import { KEYS_MMKV } from '../config/mmkv'

// Tipo para los parámetros de la solicitud
type RequestParams = {
  url: string
  data?: any
  config?: AxiosRequestConfig
}

// Manejador de errores de Axios
const handleAxiosError = (error: AxiosError) => {
  const { response } = error as AxiosError
  if (response) {
    const errorMessage =
      (response.data as { message?: string })?.message || 'Error desconocido'
    if (response.status === 404) {
      console.error('Recurso no encontrado')
    } else {
      console.error(`Error ${response.status}: ${errorMessage}`)
    }
  } else if (error.request) {
    console.error('No se recibió respuesta del servidor')
  } else {
    console.error('Error al configurar la petición:', error.message)
  }
}

// Hook personalizado para manejar peticiones HTTP
const useCustomHttpRequest = (): ((params: RequestParams) => Promise<any>) => {
  const { storageMMKV, getItem, clearMMKV } = useSecureStorage()

  const navigation = useNavigation()

  useEffect(() => {
    // Configurar interceptores
    const requestInterceptor = axios.interceptors.request.use(
      async config => {
        const token = getItem(KEYS_MMKV.ACCESS_TOKEN)
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      error => Promise.reject(error)
    )

    const responseInterceptor = axios.interceptors.response.use(
      response => response,
      async (error: AxiosError) => {
        const errorRsp = error.response
        const isLogout = errorRsp?.status === 401 || errorRsp?.status === 417
        if (isLogout && getItem(KEYS_MMKV.ACCESS_TOKEN)) {
          clearMMKV()
          navigation.navigate('LoginScreen' as never)
        }
        return Promise.reject(error)
      }
    )

    // Limpieza de interceptores cuando el componente se desmonte
    return () => {
      axios.interceptors.request.eject(requestInterceptor)
      axios.interceptors.response.eject(responseInterceptor)
    }
  }, [storageMMKV, navigation])

  // Función de petición HTTP
  const request = async <T>({
    url,
    data = {},
    config = {}
  }: RequestParams): Promise<T> => {
    try {
      const response: AxiosResponse<T> = await axios.request({
        url,
        data,
        ...config
      })
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        handleAxiosError(error)
      } else {
        console.error('Error inesperado:', error)
      }
      throw error
    }
  }

  return request
}

export default useCustomHttpRequest
