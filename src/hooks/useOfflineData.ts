import { useState, useEffect } from 'react'

interface OfflineData {
  [key: string]: any
}

export function useOfflineData(key: string) {
  const [data, setData] = useState<OfflineData | null>(null)
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    // Load cached data on mount
    const cachedData = localStorage.getItem(`offline_${key}`)
    if (cachedData) {
      try {
        setData(JSON.parse(cachedData))
      } catch (error) {
        console.error('Error parsing cached data:', error)
      }
    }

    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [key])

  const cacheData = (newData: OfflineData) => {
    try {
      localStorage.setItem(`offline_${key}`, JSON.stringify(newData))
      setData(newData)
    } catch (error) {
      console.error('Error caching data:', error)
    }
  }

  const clearCache = () => {
    localStorage.removeItem(`offline_${key}`)
    setData(null)
  }

  return {
    data,
    isOnline,
    cacheData,
    clearCache,
  }
}