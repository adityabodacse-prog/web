import { useState, useEffect } from 'react'
import { supabase, SensorReading, Sensor } from '../lib/supabase'
import { useOfflineData } from './useOfflineData'

export function useSensorData() {
  const [sensors, setSensors] = useState<Sensor[]>([])
  const [readings, setReadings] = useState<SensorReading[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { data: cachedData, isOnline, cacheData } = useOfflineData('sensors')

  useEffect(() => {
    fetchSensors()
    fetchRecentReadings()

    // Set up real-time subscription
    const subscription = supabase
      .channel('sensor_readings')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'sensor_readings' },
        (payload) => {
          setReadings(prev => [payload.new as SensorReading, ...prev.slice(0, 999)])
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const fetchSensors = async () => {
    try {
      if (!isOnline && cachedData?.sensors) {
        setSensors(cachedData.sensors)
        return
      }

      const { data, error } = await supabase
        .from('sensors')
        .select('*')
        .order('name')

      if (error) throw error

      setSensors(data || [])
      if (isOnline) {
        cacheData({ ...cachedData, sensors: data || [] })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching sensors')
      if (cachedData?.sensors) {
        setSensors(cachedData.sensors)
      }
    }
  }

  const fetchRecentReadings = async () => {
    try {
      setLoading(true)
      
      if (!isOnline && cachedData?.readings) {
        setReadings(cachedData.readings)
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('sensor_readings')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(1000)

      if (error) throw error

      setReadings(data || [])
      if (isOnline) {
        cacheData({ ...cachedData, readings: data || [] })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching readings')
      if (cachedData?.readings) {
        setReadings(cachedData.readings)
      }
    } finally {
      setLoading(false)
    }
  }

  const getReadingsBySensor = (sensorId: string, hours: number = 24) => {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000)
    return readings.filter(reading => 
      reading.sensor_id === sensorId && 
      new Date(reading.timestamp) > cutoff
    )
  }

  const getLatestReading = (sensorId: string) => {
    return readings.find(reading => reading.sensor_id === sensorId)
  }

  return {
    sensors,
    readings,
    loading,
    error,
    isOnline,
    fetchSensors,
    fetchRecentReadings,
    getReadingsBySensor,
    getLatestReading,
  }
}