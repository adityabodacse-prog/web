import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface SensorReading {
  id: string
  sensor_id: string
  timestamp: string
  ph: number
  temperature: number
  turbidity: number
  dissolved_oxygen: number
  conductivity: number
  salinity: number
  water_level: number
  location_lat: number
  location_lng: number
  created_at: string
}

export interface HazardAlert {
  id: string
  type: 'tsunami' | 'high_waves' | 'oil_spill' | 'chemical_pollution' | 'biological_pollution'
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string
  description: string
  location_lat: number
  location_lng: number
  affected_radius: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface UserProfile {
  id: string
  email: string
  role: 'admin' | 'operator' | 'viewer'
  full_name: string
  organization: string
  created_at: string
  updated_at: string
}

export interface Sensor {
  id: string
  name: string
  location_lat: number
  location_lng: number
  is_active: boolean
  last_reading_at: string
  created_at: string
}