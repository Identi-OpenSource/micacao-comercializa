import { useEffect, useState } from 'react'
import { MMKV } from 'react-native-mmkv'
import { getSecureStorage, KEYS_MMKV } from '../db/mmkv'
import { getDataFromJWT } from '../utils/jwt'

type StorageValueType = string | number | boolean | null

const useSecureStorage = () => {
  const [storage, setStorage] = useState<MMKV | null>(null)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const initializeStorage = async () => {
      try {
        const secureStorage = await getSecureStorage()
        setStorage(secureStorage)
      } catch (err) {
        setError(err as Error)
      }
    }

    initializeStorage()
  }, [])

  const getItem = (key: string): StorageValueType => {
    if (!storage) {
      throw new Error('Storage is not initialized')
    }
    return storage.getString(key) as StorageValueType
  }

  const getDataJWT = (): any => {
    const token = getItem(KEYS_MMKV.ACCESS_TOKEN) as string
    return getDataFromJWT(token) || {}
  }

  const setItem = (key: string, value: StorageValueType): void => {
    if (!storage) {
      throw new Error('Storage is not initialized')
    }
    if (value) {
      storage.set(key, value)
    } else {
      storage.delete(key)
    }
  }

  const removeItem = (key: string): void => {
    if (!storage) {
      throw new Error('Storage is not initialized')
    }
    storage.delete(key)
  }

  const clear = (): void => {
    if (!storage) {
      throw new Error('Storage is not initialized')
    }
    storage.clearAll()
  }

  return {
    setStorage,
    storageMMKV: storage,
    errorMMKV: error,
    getItem,
    getDataJWT,
    setItem,
    removeItem,
    clearMMKV: clear
  }
}

export default useSecureStorage
