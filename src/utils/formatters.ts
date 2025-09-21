// Utility functions for formatting data

export const formatNumber = (value: number, decimals: number = 2): string => {
  return value.toFixed(decimals)
}

export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString()
}

export const formatDateTime = (date: string | Date): string => {
  return new Date(date).toLocaleString()
}

export const formatTime = (date: string | Date): string => {
  return new Date(date).toLocaleTimeString()
}

export const formatCoordinate = (coord: number): string => {
  return coord.toFixed(4)
}

export const formatDistance = (meters: number): string => {
  if (meters < 1000) {
    return `${meters.toFixed(0)}m`
  }
  return `${(meters / 1000).toFixed(1)}km`
}

export const formatPercentage = (value: number): string => {
  return `${(value * 100).toFixed(1)}%`
}

export const formatFileSize = (bytes: number): string => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  if (bytes === 0) return '0 Bytes'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`
}

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return `${text.substring(0, maxLength)}...`
}

export const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const formatSensorValue = (parameter: string, value: number): string => {
  const units: Record<string, string> = {
    ph: '',
    temperature: '°C',
    turbidity: 'NTU',
    dissolved_oxygen: 'mg/L',
    conductivity: 'μS/cm',
    salinity: 'PSU',
    water_level: 'm'
  }
  
  const unit = units[parameter] || ''
  return `${formatNumber(value)} ${unit}`.trim()
}