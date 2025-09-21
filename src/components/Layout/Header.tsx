import { useTranslation } from 'react-i18next'
import { Bell, Globe, LogOut, User, Wifi, WifiOff } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useAlerts } from '../../hooks/useAlerts'
import { useOfflineData } from '../../hooks/useOfflineData'

interface HeaderProps {
  onLanguageChange: (lang: string) => void
  currentLanguage: string
}

export function Header({ onLanguageChange, currentLanguage }: HeaderProps) {
  const { t } = useTranslation()
  const { user, profile, signOut } = useAuth()
  const { getActiveAlerts } = useAlerts()
  const { isOnline } = useOfflineData('app')
  
  const activeAlerts = getActiveAlerts()
  const criticalAlerts = activeAlerts.filter(alert => alert.severity === 'critical')

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
  ]

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-ocean-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AA</span>
              </div>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {t('oceanMonitoring')}
              </h1>
            </div>
          </div>

          {/* Status and Actions */}
          <div className="flex items-center space-x-4">
            {/* Network Status */}
            <div className="flex items-center space-x-2">
              {isOnline ? (
                <Wifi className="w-5 h-5 text-green-500" />
              ) : (
                <WifiOff className="w-5 h-5 text-red-500" />
              )}
              <span className={`text-sm ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
                {isOnline ? t('online') : t('offline')}
              </span>
            </div>

            {/* Alerts */}
            <div className="relative">
              <button className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors">
                <Bell className="w-5 h-5" />
                {criticalAlerts.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-danger-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                    {criticalAlerts.length}
                  </span>
                )}
              </button>
            </div>

            {/* Language Selector */}
            <div className="relative">
              <select
                value={currentLanguage}
                onChange={(e) => onLanguageChange(e.target.value)}
                className="appearance-none bg-transparent border-none text-sm text-gray-600 hover:text-gray-900 focus:outline-none cursor-pointer"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
              <Globe className="w-4 h-4 text-gray-400 pointer-events-none absolute right-0 top-1/2 transform -translate-y-1/2" />
            </div>

            {/* User Menu */}
            {user && (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-gray-600" />
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">
                      {profile?.full_name || user.email}
                    </div>
                    <div className="text-gray-500 capitalize">
                      {profile?.role || 'viewer'}
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => signOut()}
                  className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                  title={t('logout')}
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}