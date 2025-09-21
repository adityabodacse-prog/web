import { useState, useEffect } from 'react'
import { supabase, HazardAlert } from '../lib/supabase'
import { useOfflineData } from './useOfflineData'

export function useAlerts() {
  const [alerts, setAlerts] = useState<HazardAlert[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { data: cachedData, isOnline, cacheData } = useOfflineData('alerts')

  useEffect(() => {
    fetchAlerts()

    // Set up real-time subscription
    const subscription = supabase
      .channel('hazard_alerts')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'hazard_alerts' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setAlerts(prev => [payload.new as HazardAlert, ...prev])
          } else if (payload.eventType === 'UPDATE') {
            setAlerts(prev => prev.map(alert => 
              alert.id === payload.new.id ? payload.new as HazardAlert : alert
            ))
          } else if (payload.eventType === 'DELETE') {
            setAlerts(prev => prev.filter(alert => alert.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const fetchAlerts = async () => {
    try {
      setLoading(true)
      
      if (!isOnline && cachedData?.alerts) {
        setAlerts(cachedData.alerts)
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('hazard_alerts')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setAlerts(data || [])
      if (isOnline) {
        cacheData({ ...cachedData, alerts: data || [] })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching alerts')
      if (cachedData?.alerts) {
        setAlerts(cachedData.alerts)
      }
    } finally {
      setLoading(false)
    }
  }

  const getActiveAlerts = () => {
    return alerts.filter(alert => alert.is_active)
  }

  const getAlertsByType = (type: HazardAlert['type']) => {
    return alerts.filter(alert => alert.type === type)
  }

  const getAlertsBySeverity = (severity: HazardAlert['severity']) => {
    return alerts.filter(alert => alert.severity === severity)
  }

  const createAlert = async (alertData: Omit<HazardAlert, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('hazard_alerts')
        .insert([alertData])
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'Error creating alert' }
    }
  }

  const updateAlert = async (id: string, updates: Partial<HazardAlert>) => {
    try {
      const { data, error } = await supabase
        .from('hazard_alerts')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'Error updating alert' }
    }
  }

  return {
    alerts,
    loading,
    error,
    isOnline,
    fetchAlerts,
    getActiveAlerts,
    getAlertsByType,
    getAlertsBySeverity,
    createAlert,
    updateAlert,
  }
}