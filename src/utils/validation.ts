import { SENSOR_THRESHOLDS } from './constants'

// Validation utilities
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export const validateCoordinate = (lat: number, lng: number): boolean => {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180
}

export const validateSensorReading = (parameter: string, value: number): {
  isValid: boolean
  severity: 'normal' | 'warning' | 'critical'
  message?: string
} => {
  const threshold = SENSOR_THRESHOLDS[parameter as keyof typeof SENSOR_THRESHOLDS]
  
  if (!threshold) {
    return { isValid: false, severity: 'critical', message: 'Unknown parameter' }
  }
  
  if (value < threshold.critical.min || value > threshold.critical.max) {
    return { 
      isValid: false, 
      severity: 'critical', 
      message: `Critical: Value outside safe range (${threshold.critical.min}-${threshold.critical.max})` 
    }
  }
  
  if (value < threshold.min || value > threshold.max) {
    return { 
      isValid: true, 
      severity: 'warning', 
      message: `Warning: Value outside normal range (${threshold.min}-${threshold.max})` 
    }
  }
  
  return { isValid: true, severity: 'normal' }
}

export const validateRequired = (value: any): boolean => {
  if (value === null || value === undefined) return false
  if (typeof value === 'string') return value.trim().length > 0
  if (Array.isArray(value)) return value.length > 0
  return true
}

export const validateNumericRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max
}