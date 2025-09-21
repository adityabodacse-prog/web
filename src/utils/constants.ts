// Application constants
export const APP_NAME = 'Aqua Alert'
export const APP_VERSION = '1.0.0'

// Sensor reading thresholds
export const SENSOR_THRESHOLDS = {
  ph: { min: 6.5, max: 8.5, critical: { min: 6.0, max: 9.0 } },
  temperature: { min: 5, max: 30, critical: { min: 0, max: 35 } },
  turbidity: { min: 0, max: 10, critical: { min: 0, max: 50 } },
  dissolved_oxygen: { min: 4, max: 12, critical: { min: 2, max: 15 } },
  conductivity: { min: 30000, max: 50000, critical: { min: 20000, max: 60000 } },
  salinity: { min: 30, max: 37, critical: { min: 25, max: 40 } },
  water_level: { min: -2, max: 5, critical: { min: -5, max: 10 } }
}

// Alert severity colors
export const SEVERITY_COLORS = {
  low: 'blue',
  medium: 'yellow',
  high: 'orange',
  critical: 'red'
} as const

// Hazard type colors
export const HAZARD_COLORS = {
  tsunami: 'red',
  high_waves: 'blue',
  oil_spill: 'gray',
  chemical_pollution: 'purple',
  biological_pollution: 'green'
} as const

// Map configuration
export const MAP_CONFIG = {
  defaultCenter: [0, 0] as [number, number],
  defaultZoom: 2,
  maxZoom: 18,
  minZoom: 1
}

// Chart configuration
export const CHART_CONFIG = {
  colors: {
    primary: '#0ea5e9',
    secondary: '#f59e0b',
    success: '#10b981',
    danger: '#ef4444',
    warning: '#f59e0b',
    info: '#0ea5e9'
  },
  animation: {
    duration: 300
  }
}

// Time intervals
export const TIME_INTERVALS = {
  REAL_TIME: 30000, // 30 seconds
  SENSOR_UPDATE: 60000, // 1 minute
  ALERT_CHECK: 120000, // 2 minutes
  DATA_REFRESH: 300000 // 5 minutes
}