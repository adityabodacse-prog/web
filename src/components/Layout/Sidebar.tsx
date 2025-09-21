import { useTranslation } from 'react-i18next'
import { 
  BarChart3, 
  Bell, 
  FileText, 
  Home, 
  Radio, 
  Settings,
  Shield,
  Activity
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const { t } = useTranslation()
  const { hasRole } = useAuth()

  const menuItems = [
    {
      id: 'dashboard',
      label: t('dashboard'),
      icon: Home,
      roles: ['viewer', 'operator', 'admin']
    },
    {
      id: 'sensors',
      label: t('sensors'),
      icon: Radio,
      roles: ['viewer', 'operator', 'admin']
    },
    {
      id: 'alerts',
      label: t('alerts'),
      icon: Bell,
      roles: ['viewer', 'operator', 'admin']
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      roles: ['operator', 'admin']
    },
    {
      id: 'reports',
      label: t('reports'),
      icon: FileText,
      roles: ['operator', 'admin']
    },
    {
      id: 'system',
      label: 'System Health',
      icon: Activity,
      roles: ['admin']
    },
    {
      id: 'settings',
      label: t('settings'),
      icon: Settings,
      roles: ['admin']
    }
  ]

  const visibleItems = menuItems.filter(item => 
    item.roles.some(role => hasRole(role))
  )

  return (
    <aside className="w-64 bg-white shadow-sm border-r border-gray-200 h-full">
      <nav className="mt-8">
        <div className="px-4 space-y-2">
          {visibleItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-ocean-50 text-ocean-700 border-r-2 border-ocean-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-ocean-600' : 'text-gray-400'}`} />
                {item.label}
              </button>
            )
          })}
        </div>
      </nav>
    </aside>
  )
}